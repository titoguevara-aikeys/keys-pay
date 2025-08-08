import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

export type AIInsight = Database['public']['Tables']['ai_insights']['Row'];
export type AIChatSession = Database['public']['Tables']['ai_chat_sessions']['Row'];
export type AIChatMessage = Database['public']['Tables']['ai_chat_messages']['Row'];
export type FinancialHealthScore = Database['public']['Tables']['financial_health_scores']['Row'];

export const useAIInsights = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['ai-insights', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_dismissed', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useChatSessions = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['ai-chat-sessions', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('ai_chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useChatMessages = (sessionId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['ai-chat-messages', sessionId],
    queryFn: async () => {
      if (!user || !sessionId) throw new Error('User not authenticated or no session');
      
      const { data, error } = await supabase
        .from('ai_chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!sessionId,
  });
};

export const useFinancialHealthScore = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['financial-health-score', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('financial_health_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useGenerateInsights = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.functions.invoke('ai-financial-advisor', {
        body: {
          action: 'generate_insights'
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
    },
  });
};

export const useSendChatMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (messageData: {
      message: string;
      sessionId?: string;
      createNewSession?: boolean;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.functions.invoke('ai-financial-advisor', {
        body: {
          action: 'chat',
          data: messageData
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ai-chat-sessions'] });
      if (variables.sessionId || data.sessionId) {
        queryClient.invalidateQueries({ 
          queryKey: ['ai-chat-messages', variables.sessionId || data.sessionId] 
        });
      }
    },
  });
};

export const useCalculateHealthScore = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.functions.invoke('ai-financial-advisor', {
        body: {
          action: 'calculate_health_score'
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-health-score'] });
    },
  });
};

export const useDismissInsight = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (insightId: string) => {
      const { error } = await supabase
        .from('ai_insights')
        .update({ is_dismissed: true })
        .eq('id', insightId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
    },
  });
};

export const useMarkInsightAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (insightId: string) => {
      const { error } = await supabase
        .from('ai_insights')
        .update({ is_read: true })
        .eq('id', insightId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
    },
  });
};