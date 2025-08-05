import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

export type FamilyMember = Database['public']['Tables']['family_controls']['Row'] & {
  child_profile?: {
    first_name?: string | null;
    last_name?: string | null;
  };
};

export const useFamilyMembers = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['family-members', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('family_controls')
        .select(`
          *,
          child_profile:profiles!family_controls_child_id_fkey(
            first_name,
            last_name
          )
        `)
        .eq('parent_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useAddFamilyMember = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (memberData: {
      email: string;
      first_name: string;
      last_name: string;
      relationship_type: string;
      spending_limit?: number;
      daily_limit?: number;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      // For now, we'll need the child to already have an account
      // In a real app, this would involve sending an invitation
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', memberData.email)
        .maybeSingle();
      
      if (profileError) throw profileError;
      if (!existingProfile) {
        throw new Error('Child profile not found. Child must create an account first.');
      }
      
      const childId = existingProfile.user_id;
      
      // Create family control relationship
      const { data, error } = await supabase
        .from('family_controls')
        .insert({
          parent_id: user.id,
          child_id: childId,
          relationship_type: memberData.relationship_type,
          spending_limit: memberData.spending_limit,
          transaction_limit: memberData.daily_limit,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-members'] });
    },
  });
};

export const useUpdateFamilyMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      memberId, 
      updates 
    }: { 
      memberId: string; 
      updates: Partial<FamilyMember> 
    }) => {
      const { data, error } = await supabase
        .from('family_controls')
        .update(updates)
        .eq('id', memberId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-members'] });
    },
  });
};