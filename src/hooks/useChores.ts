import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Chore {
  id: string;
  title: string;
  description?: string;
  reward_amount: number;
  assigned_to: string;
  due_date?: string;
  status: 'pending' | 'completed' | 'approved' | 'rejected';
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  category: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  created_at: string;
  updated_at: string;
  family_id: string;
}

export const useChores = (familyId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['chores', user?.id, familyId],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      // For demo purposes, return mock data
      const mockChores: Chore[] = [
        {
          id: '1',
          title: 'Take out trash',
          description: 'Empty all trash cans and take to curb',
          reward_amount: 5,
          assigned_to: 'Sarah',
          status: 'pending',
          frequency: 'weekly',
          category: 'household',
          difficulty: 2,
          due_date: '2024-12-08',
          created_at: '2024-12-01T00:00:00Z',
          updated_at: '2024-12-01T00:00:00Z',
          family_id: 'family-1'
        },
        {
          id: '2',
          title: 'Wash dishes',
          description: 'Load dishwasher and hand wash pots',
          reward_amount: 3,
          assigned_to: 'Alex',
          status: 'completed',
          frequency: 'daily',
          category: 'household',
          difficulty: 1,
          created_at: '2024-12-01T00:00:00Z',
          updated_at: '2024-12-01T00:00:00Z',
          family_id: 'family-1'
        }
      ];
      
      return mockChores;
    },
    enabled: !!user,
  });
};

export const useCreateChore = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (choreData: Omit<Chore, 'id' | 'created_at' | 'updated_at' | 'family_id'>) => {
      if (!user) throw new Error('User not authenticated');
      
      // For demo purposes, just return the data with an ID
      return { ...choreData, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), family_id: 'family-1' };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores'] });
    },
  });
};

export const useUpdateChore = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      choreId, 
      updates 
    }: { 
      choreId: string; 
      updates: Partial<Chore> 
    }) => {
      // For demo purposes, just return the updates
      return { ...updates, updated_at: new Date().toISOString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores'] });
    },
  });
};