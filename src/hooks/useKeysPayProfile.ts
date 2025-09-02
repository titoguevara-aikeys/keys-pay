import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface KeysPayProfile {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  timezone: string;
  business_role?: string;
  role: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  organization?: {
    id: string;
    name: string;
    type: string;
    country_code: string;
    kyb_status: string;
  };
}

export interface UpdateProfileParams {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  timezone: string;
}

export interface UpdateOrganizationParams {
  name: string;
  type: string;
  licenseNumber?: string;
  taxId?: string;
  address?: string;
  city: string;
  countryCode: string;
}

// Hook to fetch user profile with organization
export const useKeysPayProfile = () => {
  return useQuery({
    queryKey: ['keyspay-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          organizations!role_memberships(
            id,
            name,
            type,
            country_code,
            kyb_status
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;

      return {
        ...profile,
        organization: Array.isArray(profile.organizations) 
          ? profile.organizations[0] 
          : profile.organizations
      } as KeysPayProfile;
    },
    enabled: !!supabase.auth.getUser(),
  });
};

// Hook to update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateProfileParams) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update({
          first_name: params.firstName,
          last_name: params.lastName,
          email: params.email,
          phone: params.phone,
          timezone: params.timezone,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keyspay-profile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });
};

// Hook to update organization
export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateOrganizationParams) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user's organization via role_memberships
      const { data: membership } = await supabase
        .from('role_memberships')
        .select('organization_id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      if (!membership) throw new Error('No organization found');

      const { data, error } = await supabase
        .from('organizations')
        .update({
          name: params.name,
          type: params.type,
          license_number: params.licenseNumber,
          tax_id: params.taxId,
          country_code: params.countryCode,
          updated_at: new Date().toISOString()
        })
        .eq('id', membership.organization_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keyspay-profile'] });
      toast.success('Organization updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update organization: ${error.message}`);
    },
  });
};

// Hook to update security settings
export const useUpdateSecuritySettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Record<string, boolean>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('security_settings')
        .upsert({
          user_id: user.id,
          two_factor_enabled: settings.twoFactorEnabled,
          biometric_enabled: settings.biometricEnabled,
          login_notifications: settings.loginNotifications,
          suspicious_activity_alerts: settings.transactionAlerts,
          device_verification_required: settings.deviceVerification,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keyspay-profile'] });
      toast.success('Security settings updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update security settings: ${error.message}`);
    },
  });
};