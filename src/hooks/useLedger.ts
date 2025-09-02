import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

type LedgerAccount = Database['public']['Tables']['ledger_accounts']['Row'];
type LedgerEntry = Database['public']['Tables']['ledger_entries']['Row'];

export const useLedgerAccounts = (organizationId?: string, currency?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['ledger-accounts', organizationId, currency],
    queryFn: async () => {
      if (!user || !organizationId) throw new Error('User not authenticated or organization not specified');
      
      let query = supabase
        .from('ledger_accounts')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('is_active', true);
      
      if (currency) {
        query = query.eq('currency', currency);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as LedgerAccount[];
    },
    enabled: !!user && !!organizationId,
  });
};

export const useLedgerEntries = (accountId?: string, limit: number = 50) => {
  return useQuery({
    queryKey: ['ledger-entries', accountId, limit],
    queryFn: async () => {
      if (!accountId) return [];
      
      const { data, error } = await supabase
        .from('ledger_entries')
        .select(`
          *,
          ledger_accounts (
            account_name,
            currency,
            account_type
          )
        `)
        .eq('account_id', accountId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    },
    enabled: !!accountId,
  });
};

export const useCreateLedgerAccount = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (account: {
      organization_id: string;
      currency: string;
      account_type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
      account_name: string;
      account_code: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('ledger_accounts')
        .insert(account)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ledger-accounts'] });
    },
  });
};

export const useAccountBalance = (accountId?: string) => {
  return useQuery({
    queryKey: ['account-balance', accountId],
    queryFn: async () => {
      if (!accountId) return { balance: 0, currency: 'AED' };
      
      const { data, error } = await supabase
        .from('ledger_entries')
        .select('debit_amount, credit_amount, currency')
        .eq('account_id', accountId);
      
      if (error) throw error;
      
      let balance = 0;
      let currency = 'AED';
      
      data.forEach(entry => {
        currency = entry.currency;
        if (entry.debit_amount) {
          balance += Number(entry.debit_amount);
        }
        if (entry.credit_amount) {
          balance -= Number(entry.credit_amount);
        }
      });
      
      return { balance, currency };
    },
    enabled: !!accountId,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};