// Custom hooks for NIUM Family API integration
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/MockAuthContext';
import { niumFamilyAPI, type NiumFamilyMember, type NiumFamilyActivity } from '@/lib/nium/family-api';
import { useToast } from './use-toast';

// Family Members Management
export const useNiumFamilyMembers = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['nium-family-members', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      const response = await niumFamilyAPI.getFamilyMembers(user.id);
      if (!response.ok) throw new Error('Failed to fetch family members');
      return response.data;
    },
    enabled: !!user,
    staleTime: 30000, // 30 seconds
  });
};

export const useAddNiumFamilyMember = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (memberData: {
      firstName: string;
      lastName: string;
      email: string;
      relationshipType: string;
      spendingLimit: number;
      dailyLimit: number;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      console.log('🟣 Calling niumFamilyAPI.createFamilyMember with:', {
        parentId: user.id,
        ...memberData,
      });
      
      const response = await niumFamilyAPI.createFamilyMember({
        parentId: user.id,
        ...memberData,
      });
      
      console.log('🟣 API Response:', response);
      
      if (!response.ok) throw new Error('Failed to create family member');
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['nium-family-members'] });
      queryClient.invalidateQueries({ queryKey: ['nium-family-stats'] });
      toast({
        title: 'Family Member Added',
        description: `${data.firstName} ${data.lastName} has been added with NIUM account and virtual card.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error Adding Family Member',
        description: error.message || 'Failed to add family member through NIUM sandbox.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateNiumSpendingLimits = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ memberId, limits }: {
      memberId: string;
      limits: { spendingLimit: number; dailyLimit: number };
    }) => {
      const response = await niumFamilyAPI.updateSpendingLimits(memberId, limits);
      if (!response.ok) throw new Error('Failed to update spending limits');
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nium-family-members'] });
      toast({
        title: 'Spending Limits Updated',
        description: 'Spending limits have been updated via NIUM sandbox.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error Updating Limits',
        description: error.message || 'Failed to update spending limits.',
        variant: 'destructive',
      });
    },
  });
};

export const useSuspendNiumMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (memberId: string) => {
      const response = await niumFamilyAPI.suspendMember(memberId);
      if (!response.ok) throw new Error('Failed to suspend member');
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nium-family-members'] });
      toast({
        title: 'Member Suspended',
        description: 'Family member has been suspended via NIUM sandbox.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error Suspending Member',
        description: error.message || 'Failed to suspend member.',
        variant: 'destructive',
      });
    },
  });
};

// Allowance Management
export const useProcessAllowance = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: {
      childId: string;
      amount: number;
      currency: string;
      description: string;
      frequency: 'weekly' | 'monthly' | 'one-time';
    }) => {
      const response = await niumFamilyAPI.processAllowancePayment(data);
      if (!response.ok) throw new Error('Failed to process allowance payment');
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['nium-family-members'] });
      queryClient.invalidateQueries({ queryKey: ['nium-family-activity'] });
      queryClient.invalidateQueries({ queryKey: ['nium-family-stats'] });
      toast({
        title: 'Allowance Processed',
        description: `Allowance payment of ${data.currency} ${data.amount} has been processed via NIUM.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Allowance Payment Failed',
        description: error.message || 'Failed to process allowance payment.',
        variant: 'destructive',
      });
    },
  });
};

// Card Management
export const useIssueChildCard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (memberId: string) => {
      const response = await niumFamilyAPI.issueChildCard(memberId);
      if (!response.ok) throw new Error('Failed to issue card');
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['nium-family-members'] });
      toast({
        title: 'Card Issued',
        description: `Virtual card ending in ${data.last4} has been issued via NIUM.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Card Issuance Failed',
        description: error.message || 'Failed to issue child card.',
        variant: 'destructive',
      });
    },
  });
};

export const useBlockChildCard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ memberId, cardId }: { memberId: string; cardId: string }) => {
      const response = await niumFamilyAPI.blockChildCard(memberId, cardId);
      if (!response.ok) throw new Error('Failed to block card');
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nium-family-members'] });
      toast({
        title: 'Card Blocked',
        description: 'Child card has been blocked via NIUM sandbox.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Card Block Failed',
        description: error.message || 'Failed to block child card.',
        variant: 'destructive',
      });
    },
  });
};

// Activity and Stats
export const useNiumFamilyActivity = (limit = 20) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['nium-family-activity', user?.id, limit],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      const response = await niumFamilyAPI.getFamilyActivity(user.id, limit);
      if (!response.ok) throw new Error('Failed to fetch family activity');
      return response.data;
    },
    enabled: !!user,
    refetchInterval: 60000, // Refresh every minute
  });
};

export const useNiumFamilyStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['nium-family-stats', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      const response = await niumFamilyAPI.getFamilyStats(user.id);
      if (!response.ok) throw new Error('Failed to fetch family stats');
      return response.data;
    },
    enabled: !!user,
    staleTime: 60000, // 1 minute
  });
};

// Transfer Money
export const useTransferToChild = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: {
      parentWalletId: string;
      childWalletId: string;
      amount: number;
      currency: string;
      description: string;
    }) => {
      const response = await niumFamilyAPI.transferToChild(data);
      if (!response.ok) throw new Error('Failed to transfer money');
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['nium-family-members'] });
      queryClient.invalidateQueries({ queryKey: ['nium-family-activity'] });
      toast({
        title: 'Transfer Successful',
        description: `Money has been transferred successfully. Reference: ${data.systemReferenceNumber}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Transfer Failed',
        description: error.message || 'Failed to transfer money to child account.',
        variant: 'destructive',
      });
    },
  });
};

// NIUM Health Check
export const useNiumFamilyHealth = () => {
  return useQuery({
    queryKey: ['nium-family-health'],
    queryFn: async () => {
      const response = await niumFamilyAPI.healthCheck();
      return response;
    },
    staleTime: 300000, // 5 minutes
    retry: 1,
  });
};