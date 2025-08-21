import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { niumCardsAPI, type NiumCard, type NiumCardTransaction, type NiumCardControls } from '@/lib/nium/cards-api';
import { useToast } from '@/hooks/use-toast';

// Hook to get all NIUM cards
export const useNiumCards = (customerId?: string) => {
  return useQuery({
    queryKey: ['nium-cards', customerId],
    queryFn: async () => {
      const result = await niumCardsAPI.getCards(customerId);
      return result.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
};

// Hook to issue a new NIUM card
export const useNiumIssueCard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: {
      customerId: string;
      cardType: 'virtual' | 'physical';
      cardSubType: 'debit' | 'prepaid';
      cardHolderName: string;
      spendingLimit: number;
      dailyLimit: number;
      currency?: string;
    }) => {
      const result = await niumCardsAPI.issueCard(data);
      if (!result.ok) {
        throw new Error('Failed to issue card');
      }
      return result.data;
    },
    onSuccess: (newCard) => {
      queryClient.invalidateQueries({ queryKey: ['nium-cards'] });
      toast({
        title: 'Card Issued Successfully',
        description: `${newCard.cardType === 'virtual' ? 'Virtual' : 'Physical'} card ending in ${newCard.last4} has been created.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Issue Card',
        description: error.message || 'An error occurred while issuing the card.',
        variant: 'destructive',
      });
    },
  });
};

// Hook to activate a NIUM card
export const useNiumActivateCard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ cardId, activationCode }: { cardId: string; activationCode: string }) => {
      const result = await niumCardsAPI.activateCard(cardId, activationCode);
      if (!result.ok) {
        throw new Error('Failed to activate card');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nium-cards'] });
      toast({
        title: 'Card Activated',
        description: 'Your card has been activated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Activation Failed',
        description: error.message || 'Failed to activate card.',
        variant: 'destructive',
      });
    },
  });
};

// Hook to block/unblock a NIUM card
export const useNiumCardToggle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ cardId, action, reason }: { 
      cardId: string; 
      action: 'block' | 'unblock'; 
      reason?: string 
    }) => {
      const result = action === 'block' 
        ? await niumCardsAPI.blockCard(cardId, reason || 'User requested')
        : await niumCardsAPI.unblockCard(cardId);
      
      if (!result.ok) {
        throw new Error(`Failed to ${action} card`);
      }
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['nium-cards'] });
      toast({
        title: `Card ${variables.action === 'block' ? 'Blocked' : 'Unblocked'}`,
        description: `Your card has been ${variables.action === 'block' ? 'blocked' : 'unblocked'} successfully.`,
      });
    },
    onError: (error: Error, variables) => {
      toast({
        title: `Failed to ${variables.action} card`,
        description: error.message || `An error occurred while ${variables.action}ing the card.`,
        variant: 'destructive',
      });
    },
  });
};

// Hook to get NIUM card transactions
export const useNiumCardTransactions = (cardId: string, limit = 50) => {
  return useQuery({
    queryKey: ['nium-card-transactions', cardId, limit],
    queryFn: async () => {
      const result = await niumCardsAPI.getCardTransactions(cardId, limit);
      return result.data;
    },
    enabled: !!cardId,
    refetchInterval: 60000, // Refetch every minute for transaction updates
  });
};

// Hook to get NIUM card controls
export const useNiumCardControls = (cardId: string) => {
  return useQuery({
    queryKey: ['nium-card-controls', cardId],
    queryFn: async () => {
      const result = await niumCardsAPI.getCardControls(cardId);
      return result.data;
    },
    enabled: !!cardId,
  });
};

// Hook to update NIUM card controls
export const useNiumUpdateCardControls = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ cardId, controls }: { 
      cardId: string; 
      controls: Partial<NiumCardControls> 
    }) => {
      const result = await niumCardsAPI.updateCardControls(cardId, controls);
      if (!result.ok) {
        throw new Error('Failed to update card controls');
      }
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['nium-card-controls', variables.cardId] });
      toast({
        title: 'Card Controls Updated',
        description: 'Your card security settings have been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update card controls.',
        variant: 'destructive',
      });
    },
  });
};

// Hook to update spending limits
export const useNiumUpdateSpendingLimits = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ cardId, limits }: { 
      cardId: string; 
      limits: { daily?: number; monthly?: number; perTransaction?: number } 
    }) => {
      const result = await niumCardsAPI.updateSpendingLimits(cardId, limits);
      if (!result.ok) {
        throw new Error('Failed to update spending limits');
      }
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['nium-cards'] });
      queryClient.invalidateQueries({ queryKey: ['nium-card-controls', variables.cardId] });
      toast({
        title: 'Spending Limits Updated',
        description: 'Your card spending limits have been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update spending limits.',
        variant: 'destructive',
      });
    },
  });
};

// Hook to order physical card
export const useNiumOrderPhysicalCard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: {
      customerId: string;
      cardHolderName: string;
      shippingAddress: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
    }) => {
      const result = await niumCardsAPI.orderPhysicalCard(data);
      if (!result.ok) {
        throw new Error('Failed to order physical card');
      }
      return result.data;
    },
    onSuccess: (newCard) => {
      queryClient.invalidateQueries({ queryKey: ['nium-cards'] });
      toast({
        title: 'Physical Card Ordered',
        description: `Physical card ending in ${newCard.last4} has been ordered and will be shipped to your address.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Order Failed',
        description: error.message || 'Failed to order physical card.',
        variant: 'destructive',
      });
    },
  });
};

// Hook to track physical card
export const useNiumTrackPhysicalCard = (cardId: string) => {
  return useQuery({
    queryKey: ['nium-card-tracking', cardId],
    queryFn: async () => {
      const result = await niumCardsAPI.trackPhysicalCard(cardId);
      return result.data;
    },
    enabled: !!cardId,
    refetchInterval: 300000, // Refetch every 5 minutes for tracking updates
  });
};

// Hook for NIUM cards health check
export const useNiumCardsHealth = () => {
  return useQuery({
    queryKey: ['nium-cards-health'],
    queryFn: async () => {
      const result = await niumCardsAPI.healthCheck();
      return result;
    },
    refetchInterval: 60000, // Check every minute
  });
};