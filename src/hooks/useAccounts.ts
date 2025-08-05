import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Account {
  id: string;
  user_id: string;
  account_number: string;
  account_type: string;
  balance: number;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useAccounts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['accounts', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Account[];
    },
    enabled: !!user,
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (accountData: {
      account_type: string;
      balance?: number;
      currency?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('accounts')
        .insert({
          user_id: user.id,
          account_number: `ACC${Date.now()}${Math.floor(Math.random() * 1000)}`,
          ...accountData,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};

export const useUpdateAccountBalance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      accountId, 
      amount, 
      type 
    }: { 
      accountId: string; 
      amount: number; 
      type: 'add' | 'subtract' 
    }) => {
      const { data: account, error: fetchError } = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', accountId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const newBalance = type === 'add' 
        ? account.balance + amount 
        : account.balance - amount;
      
      if (newBalance < 0) throw new Error('Insufficient funds');
      
      const { data, error } = await supabase
        .from('accounts')
        .update({ balance: newBalance })
        .eq('id', accountId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};