import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/MockAuthContext';
import type { Database } from '@/integrations/supabase/types';

export type Card = Database['public']['Tables']['cards']['Row'];

export const useCards = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['cards', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('cards')
        .select(`
          *,
          accounts!inner(user_id)
        `)
        .eq('accounts.user_id', user.id)
        .eq('card_status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useCreateCard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cardData: {
      account_id: string;
      card_type: string;
      spending_limit?: number;
    }) => {
      const { data, error } = await supabase
        .from('cards')
        .insert({
          ...cardData,
          card_number: `****-****-****-${Math.floor(1000 + Math.random() * 9000)}`,
          card_status: 'active',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
};

export const useUpdateCard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      cardId, 
      updates 
    }: { 
      cardId: string; 
      updates: Partial<Card> 
    }) => {
      const { data, error } = await supabase
        .from('cards')
        .update(updates)
        .eq('id', cardId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
};