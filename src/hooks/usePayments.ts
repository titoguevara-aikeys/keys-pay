import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

export type QRPayment = Database['public']['Tables']['qr_payments']['Row'];
export type Bill = Database['public']['Tables']['bills']['Row'];
export type ScheduledTransfer = Database['public']['Tables']['scheduled_transfers']['Row'];

export const useQRPayments = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['qr-payments', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('qr_payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useBills = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['bills', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useScheduledTransfers = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['scheduled-transfers', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('scheduled_transfers')
        .select('*')
        .eq('user_id', user.id)
        .order('next_execution', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useCreateQRPayment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (paymentData: {
      account_id: string;
      amount?: number;
      description?: string;
      expires_hours?: number;
      is_reusable?: boolean;
      max_uses?: number;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      // Generate QR code data (simplified - in real app you'd use a proper QR library)
      const qrData = {
        type: 'payment',
        user_id: user.id,
        account_id: paymentData.account_id,
        amount: paymentData.amount,
        timestamp: Date.now(),
      };
      const qr_code = btoa(JSON.stringify(qrData));
      
      const expires_at = paymentData.expires_hours 
        ? new Date(Date.now() + paymentData.expires_hours * 60 * 60 * 1000).toISOString()
        : null;
      
      const { data, error } = await supabase
        .from('qr_payments')
        .insert({
          user_id: user.id,
          qr_code,
          expires_at,
          ...paymentData,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qr-payments'] });
    },
  });
};

export const useCreateBill = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (billData: {
      payee_name: string;
      payee_account: string;
      amount?: number;
      due_date?: string;
      category?: string;
      is_recurring?: boolean;
      recurring_frequency?: string;
      account_id?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('bills')
        .insert({
          user_id: user.id,
          ...billData,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });
};

export const useCreateScheduledTransfer = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (transferData: {
      from_account_id: string;
      to_account_id?: string;
      external_recipient?: string;
      amount: number;
      frequency: string;
      next_execution: string;
      end_date?: string;
      description?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('scheduled_transfers')
        .insert({
          user_id: user.id,
          ...transferData,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-transfers'] });
    },
  });
};