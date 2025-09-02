import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface KeysPayCard {
  id: string;
  user_id: string;
  account_id: string;
  card_number: string;
  card_type: 'virtual' | 'physical';
  card_status: 'active' | 'blocked' | 'expired';
  provider: string;
  provider_card_id?: string;
  last_four?: string;
  expiry_month?: number;
  expiry_year?: number;
  cvv?: string;
  spending_limits: {
    daily: number;
    monthly: number;
    perTransaction: number;
  };
  card_controls: Record<string, any>;
  provider_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateCardParams {
  cardType: 'virtual' | 'physical';
  spendingLimit: number;
  dailyLimit: number;
  perTransactionLimit: number;
}

// Hook to fetch user's cards
export const useKeysPayCards = () => {
  return useQuery({
    queryKey: ['keyspay-cards'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('cards')
        .select(`
          id,
          account_id,
          card_number,
          card_type,
          card_status,
          provider,
          provider_card_id,
          last_four,
          expiry_month,
          expiry_year,
          cvv,
          spending_limits,
          card_controls,
          provider_data,
          created_at,
          updated_at,
          accounts!inner(user_id)
        `)
        .eq('accounts.user_id', user.id);

      if (error) throw error;
      
      // Transform the data to match our interface
      return data.map(card => ({
        id: card.id,
        user_id: (card.accounts as any).user_id,
        account_id: card.account_id,
        card_number: card.card_number,
        card_type: card.card_type as 'virtual' | 'physical',
        card_status: card.card_status as 'active' | 'blocked' | 'expired',
        provider: card.provider,
        provider_card_id: card.provider_card_id,
        last_four: card.last_four,
        expiry_month: card.expiry_month,
        expiry_year: card.expiry_year,
        cvv: card.cvv,
        spending_limits: (card.spending_limits as any) || {
          daily: 500,
          monthly: 2000,
          perTransaction: 250
        },
        card_controls: (card.card_controls as any) || {},
        provider_data: (card.provider_data as any) || {},
        created_at: card.created_at,
        updated_at: card.updated_at
      })) as KeysPayCard[];
    },
    enabled: !!supabase.auth.getUser(),
  });
};

// Hook to issue a new card
export const useIssueCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateCardParams) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user's default account
      const { data: accounts } = await supabase
        .from('accounts')
        .select('id')
        .eq('user_id', user.id)
        .eq('account_type', 'checking')
        .limit(1);

      if (!accounts || accounts.length === 0) {
        throw new Error('No account found');
      }

      // Generate mock card data (in real implementation, this would call NymCard API)
      const cardNumber = '4532' + Math.random().toString().slice(2, 14);
      const newCard = {
        account_id: accounts[0].id,
        card_number: cardNumber,
        card_type: params.cardType,
        card_status: 'active',
        provider: 'nymcard',
        last_four: cardNumber.slice(-4),
        expiry_month: 12,
        expiry_year: 2027,
        cvv: Math.floor(Math.random() * 900 + 100).toString(),
        spending_limits: {
          daily: params.dailyLimit,
          monthly: params.spendingLimit,
          perTransaction: params.perTransactionLimit
        },
        card_controls: {
          online_purchases: true,
          international_transactions: false,
          atm_withdrawals: false,
          contactless_payments: true
        },
        provider_data: {}
      };

      const { data, error } = await supabase
        .from('cards')
        .insert(newCard)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keyspay-cards'] });
      toast.success('Card issued successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to issue card: ${error.message}`);
    },
  });
};

// Hook to update card limits
export const useUpdateCardLimits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      cardId, 
      limits 
    }: { 
      cardId: string; 
      limits: { daily: number; monthly: number; perTransaction: number } 
    }) => {
      const { data, error } = await supabase
        .from('cards')
        .update({ 
          spending_limits: limits,
          updated_at: new Date().toISOString()
        })
        .eq('id', cardId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keyspay-cards'] });
      toast.success('Card limits updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update limits: ${error.message}`);
    },
  });
};

// Hook to toggle card status (block/unblock)
export const useToggleCardStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      cardId, 
      action 
    }: { 
      cardId: string; 
      action: 'block' | 'unblock' 
    }) => {
      const newStatus = action === 'block' ? 'blocked' : 'active';
      
      const { data, error } = await supabase
        .from('cards')
        .update({ 
          card_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', cardId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['keyspay-cards'] });
      toast.success(`Card ${variables.action}ed successfully!`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update card status: ${error.message}`);
    },
  });
};