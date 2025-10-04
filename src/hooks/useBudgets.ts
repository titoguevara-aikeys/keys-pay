import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

export type Budget = Database['public']['Tables']['budgets']['Row'];
export type SpendingInsight = Database['public']['Tables']['spending_insights']['Row'];

export const useBudgets = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['budgets', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useSpendingInsights = (period: 'week' | 'month' | 'year' = 'month') => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['spending-insights', user?.id, period],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const now = new Date();
      let startDate: Date;
      
      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default: // month
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }
      
      const { data, error } = await supabase
        .from('spending_insights')
        .select('*')
        .eq('user_id', user.id)
        .gte('period_start', startDate.toISOString().split('T')[0])
        .order('total_amount', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (budgetData: {
      name: string;
      category: string;
      amount: number;
      period: string;
      start_date: string;
      end_date?: string;
      alert_threshold?: number;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('budgets')
        .insert({
          user_id: user.id,
          ...budgetData,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      budgetId, 
      updates 
    }: { 
      budgetId: string; 
      updates: Partial<Budget> 
    }) => {
      const { data, error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', budgetId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};