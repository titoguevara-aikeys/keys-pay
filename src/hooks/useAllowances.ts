import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/MockAuthContext';

// Temporary type until database migration is complete
export type Allowance = {
  id: string;
  parent_id: string;
  child_id: string;
  amount: number;
  frequency: 'weekly' | 'monthly';
  split_spend?: number;
  split_save?: number;
  split_give?: number;
  auto_pay?: boolean;
  status: string;
  next_payment?: string;
  created_at: string;
  updated_at: string;
  child_profile?: {
    first_name?: string | null;
    last_name?: string | null;
  };
};

export const useAllowances = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['allowances', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      // Temporary mock data until database tables are ready
      return [] as Allowance[];
    },
    enabled: !!user,
  });
};

export const useCreateAllowance = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (allowanceData: {
      child_id: string;
      amount: number;
      frequency: 'weekly' | 'monthly';
      split_spend?: number;
      split_save?: number;
      split_give?: number;
      auto_pay?: boolean;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      // Temporary mock implementation until database tables are ready
      throw new Error('Database tables not yet available. Please complete the migration first.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allowances'] });
    },
  });
};

export const useUpdateAllowance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Allowance> }) => {
      // Temporary mock implementation until database tables are ready
      throw new Error('Database tables not yet available. Please complete the migration first.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allowances'] });
    },
  });
};

export const usePayAllowance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (allowanceId: string) => {
      // Temporary mock implementation until database tables are ready
      throw new Error('Database tables not yet available. Please complete the migration first.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allowances'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};