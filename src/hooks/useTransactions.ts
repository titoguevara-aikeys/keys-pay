import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Transaction {
  id: string;
  account_id: string;
  card_id?: string;
  transaction_type: string;
  amount: number;
  currency: string;
  description: string;
  merchant_name?: string;
  category?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useTransactions = (accountId?: string, limit: number = 20) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['transactions', user?.id, accountId, limit],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      let query = supabase
        .from('transactions')
        .select(`
          *,
          accounts!inner(user_id)
        `)
        .eq('accounts.user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (accountId) {
        query = query.eq('account_id', accountId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (transactionData: {
      account_id: string;
      transaction_type: string;
      amount: number;
      description: string;
      merchant_name?: string;
      category?: string;
      card_id?: string;
    }) => {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transactionData,
          currency: 'USD',
          status: 'completed',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};

export const useTransactionCategories = () => {
  return {
    data: [
      'Food & Dining',
      'Shopping',
      'Transportation',
      'Bills & Utilities',
      'Entertainment',
      'Health & Medical',
      'Travel',
      'Education',
      'Groceries',
      'Gas',
      'Income',
      'Transfer',
      'Other'
    ]
  };
};