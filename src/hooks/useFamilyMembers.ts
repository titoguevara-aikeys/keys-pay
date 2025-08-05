import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface FamilyMember {
  id: string;
  parent_id: string;
  child_id: string;
  relationship_type: string;
  spending_limit?: number;
  daily_limit?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  child_profile?: {
    first_name?: string;
    last_name?: string;
  };
}

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
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as FamilyMember[];
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
      
      // First, create or find the child user profile
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', memberData.email)
        .single();
      
      let childId;
      
      if (existingProfile) {
        childId = existingProfile.id;
      } else {
        // Create new profile for the child
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            email: memberData.email,
            first_name: memberData.first_name,
            last_name: memberData.last_name,
          })
          .select('id')
          .single();
        
        if (createError) throw createError;
        childId = newProfile.id;
      }
      
      // Create family control relationship
      const { data, error } = await supabase
        .from('family_controls')
        .insert({
          parent_id: user.id,
          child_id: childId,
          relationship_type: memberData.relationship_type,
          spending_limit: memberData.spending_limit,
          daily_limit: memberData.daily_limit,
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