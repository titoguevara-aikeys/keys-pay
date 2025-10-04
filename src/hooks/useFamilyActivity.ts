import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Temporary type until database migration is complete
export type FamilyActivity = {
  id: string;
  parent_id: string;
  child_id: string;
  activity_type: string;
  description: string;
  amount?: number;
  created_at: string;
  child_profile?: {
    first_name?: string | null;
    last_name?: string | null;
  };
};

export const useFamilyActivity = (limit: number = 20) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['family-activity', user?.id, limit],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      // Temporary mock data until database tables are ready
      return [] as FamilyActivity[];
    },
    enabled: !!user,
  });
};

export const useFamilyStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['family-stats', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      // Temporary mock data until database tables are ready
      const allowances: any[] = [];
      const chores: any[] = [];
      const savingsGoals: any[] = [];
      
      // Calculate stats
      const activeChores = chores?.filter(c => c.status === 'pending' || c.status === 'in_progress').length || 0;
      const pendingApprovals = chores?.filter(c => c.status === 'completed').length || 0;
      const completedGoals = savingsGoals?.filter(g => g.current_amount >= g.target_amount).length || 0;
      
      const totalSavings = savingsGoals?.reduce((sum, goal) => sum + (goal.current_amount || 0), 0) || 0;
      
      const weeklyAllowances = allowances?.reduce((sum, allowance) => {
        const amount = allowance.amount || 0;
        if (allowance.frequency === 'weekly') return sum + amount;
        if (allowance.frequency === 'monthly') return sum + (amount / 4.33); // Approximate weeks in month
        return sum;
      }, 0) || 0;
      
      const avgProgress = savingsGoals?.length ? 
        savingsGoals.reduce((sum, goal) => {
          const progress = goal.target_amount > 0 ? (goal.current_amount || 0) / goal.target_amount * 100 : 0;
          return sum + Math.min(progress, 100);
        }, 0) / savingsGoals.length : 0;
      
      return {
        activeChores,
        pendingApprovals,
        totalSavings,
        weeklyAllowances,
        completedGoals,
        avgProgressPercentage: Math.round(avgProgress),
        interestEarned: 0, // Would be calculated from transactions
      };
    },
    enabled: !!user,
  });
};