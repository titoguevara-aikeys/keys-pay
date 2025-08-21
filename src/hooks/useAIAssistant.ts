import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/MockAuthContext';
import type { Database } from '@/integrations/supabase/types';

const OFFLINE: boolean = typeof window !== 'undefined' ? ((localStorage.getItem('aikeys_offline') ?? '1') === '1') : true;

// Deterministic mock data for offline mode
const mockNow = () => new Date().toISOString();
const mockInsights = [
  {
    id: 'mock-insight-1',
    user_id: 'mock-user',
    title: 'Optimize recurring subscriptions',
    description: 'You can save ~$25/month by cancelling unused subscriptions',
    type: 'savings',
    priority: 'high',
    confidence: 0.86,
    action_items: ['Audit subscriptions', 'Cancel unused trials'],
    estimated_impact: 25,
    is_dismissed: false,
    is_read: false,
    created_at: mockNow()
  },
] as unknown as AIInsight[];

const mockHealth = {
  id: 'mock-health-1',
  user_id: 'mock-user',
  score: 78,
  breakdown: { savings: 0.7, investments: 0.8, debt: 0.6 },
  created_at: mockNow()
} as unknown as FinancialHealthScore;

const mockSessions = [
  { id: 'mock-session-1', user_id: 'mock-user', title: 'Financial Chat', created_at: mockNow(), updated_at: mockNow() },
] as unknown as AIChatSession[];

const mockMessages = (sessionId: string) => ([
  { id: 'm1', session_id: sessionId, role: 'assistant', content: 'How can I help with your finances today?', created_at: mockNow() },
]) as unknown as AIChatMessage[];

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
      if (OFFLINE) return mockInsights;
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
      if (OFFLINE) return mockSessions;
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
      if (OFFLINE) return mockMessages(sessionId);
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
      if (OFFLINE) return mockHealth;
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
      if (OFFLINE) return { ok: true } as any;
      const { data, error } = await supabase.functions.invoke('ai-financial-advisor', {
        body: { action: 'generate_insights' }
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
      if (OFFLINE) {
        return {
          sessionId: messageData.sessionId || 'mock-session-1',
          messageId: `mock-${Date.now()}`
        } as any;
      }
      const { data, error } = await supabase.functions.invoke('ai-financial-advisor', {
        body: { action: 'chat', data: messageData }
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
      if (OFFLINE) return { ok: true } as any;
      const { data, error } = await supabase.functions.invoke('ai-financial-advisor', {
        body: { action: 'calculate_health_score' }
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
      if (OFFLINE) return;
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
      if (OFFLINE) return;
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