import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/MockAuthContext';

export interface SecuritySettings {
  id: string;
  user_id: string;
  two_factor_enabled: boolean;
  biometric_enabled: boolean;
  fraud_monitoring_enabled: boolean;
  login_notifications: boolean;
  suspicious_activity_alerts: boolean;
  device_verification_required: boolean;
  session_timeout_minutes: number;
  max_concurrent_sessions: number;
  created_at: string;
  updated_at: string;
}

export const useSecuritySettings = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['security-settings', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('security_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No settings found, create default
          const { data: newSettings, error: insertError } = await supabase
            .from('security_settings')
            .insert({ user_id: user.id })
            .select()
            .single();
          
          if (insertError) throw insertError;
          return newSettings;
        }
        throw error;
      }
      
      return data;
    },
    enabled: !!user,
  });
};

export const useUpdateSecuritySettings = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (updates: Partial<SecuritySettings>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('security_settings')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-settings'] });
    },
  });
};