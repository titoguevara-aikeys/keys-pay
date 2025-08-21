import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/MockAuthContext';
import type { Database } from '@/integrations/supabase/types';

export type Account = Database['public']['Tables']['accounts']['Row'];

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
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
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
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      if (!account) throw new Error('Account not found');
      
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