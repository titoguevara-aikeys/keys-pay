import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/MockAuthContext';
import type { Database } from '@/integrations/supabase/types';

export type PaymentRequest = Database['public']['Tables']['payment_requests']['Row'];

export const usePaymentRequests = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['payment-requests', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('payment_requests')
        .select('*')
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useCreatePaymentRequest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (requestData: {
      to_email?: string;
      to_user_id?: string;
      amount: number;
      description?: string;
      expires_hours?: number;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const expires_at = requestData.expires_hours 
        ? new Date(Date.now() + requestData.expires_hours * 60 * 60 * 1000).toISOString()
        : null;
      
      const { data, error } = await supabase
        .from('payment_requests')
        .insert({
          from_user_id: user.id,
          expires_at,
          ...requestData,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-requests'] });
    },
  });
};

export const useRespondToPaymentRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      requestId, 
      action,
      paymentData
    }: { 
      requestId: string; 
      action: 'pay' | 'cancel';
      paymentData?: {
        fromAccountId: string;
        toAccountId: string;
      };
    }) => {
      if (action === 'pay' && paymentData) {
        // First perform the actual transfer
        const { data: transferData, error: transferError } = await supabase.functions.invoke('transfer-money', {
          body: {
            fromAccountId: paymentData.fromAccountId,
            toAccountId: paymentData.toAccountId,
          }
        });
        
        if (transferError) throw transferError;
      }
      
      // Update the payment request status
      const { data, error } = await supabase
        .from('payment_requests')
        .update({ 
          status: action === 'pay' ? 'paid' : 'cancelled',
          paid_at: action === 'pay' ? new Date().toISOString() : null
        })
        .eq('id', requestId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-requests'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};