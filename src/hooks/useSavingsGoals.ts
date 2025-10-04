import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Temporary type until database migration is complete
export type SavingsGoal = {
  id: string;
  parent_id: string;
  child_id: string;
  title: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  interest_rate?: number;
  auto_save_amount?: number;
  auto_save_frequency?: 'weekly' | 'monthly';
  status: string;
  created_at: string;
  updated_at: string;
  child_profile?: {
    first_name?: string | null;
    last_name?: string | null;
  };
};

export const useSavingsGoals = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['savings-goals', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      // Temporary mock data until database tables are ready
      return [] as SavingsGoal[];
    },
    enabled: !!user,
  });
};

export const useCreateSavingsGoal = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (goalData: {
      child_id: string;
      title: string;
      description?: string;
      target_amount: number;
      target_date?: string;
      interest_rate?: number;
      auto_save_amount?: number;
      auto_save_frequency?: 'weekly' | 'monthly';
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      // Temporary mock implementation until database tables are ready
      throw new Error('Database tables not yet available. Please complete the migration first.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
    },
  });
};

export const useUpdateSavingsGoal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SavingsGoal> }) => {
      // Temporary mock implementation until database tables are ready
      throw new Error('Database tables not yet available. Please complete the migration first.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
    },
  });
};

export const useContributeToGoal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ goalId, amount }: { goalId: string; amount: number }) => {
      // Temporary mock implementation until database tables are ready
      throw new Error('Database tables not yet available. Please complete the migration first.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};