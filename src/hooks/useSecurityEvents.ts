import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/MockAuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface SecurityEvent {
  id: string;
  user_id: string;
  event_type: string;
  event_description: string;
  ip_address?: string;
  user_agent?: string;
  device_fingerprint?: string;
  location?: string;
  risk_score: number;
  blocked: boolean;
  metadata?: any;
  created_at: string;
}

export const useSecurityEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSecurityEvents();
    }
  }, [user]);

  const fetchSecurityEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('security_events')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (fetchError) {
        throw fetchError;
      }

      setEvents((data || []).map(event => ({
        ...event,
        ip_address: event.ip_address as string || '',
        user_agent: event.user_agent || '',
        device_fingerprint: event.device_fingerprint || '',
        location: event.location || '',
        metadata: event.metadata || {}
      })));
    } catch (err) {
      console.error('Failed to fetch security events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch security events');
    } finally {
      setLoading(false);
    }
  };

  const logSecurityEvent = async (eventData: {
    event_type: string;
    event_description: string;
    risk_score?: number;
    blocked?: boolean;
    metadata?: any;
  }) => {
    if (!user) return;

    try {
      const { error } = await supabase.functions.invoke('log-security-event', {
        body: {
          ...eventData,
          user_id: user.id,
          risk_score: eventData.risk_score || 0,
          blocked: eventData.blocked || false,
          metadata: eventData.metadata || {}
        }
      });

      if (error) {
        console.error('Failed to log security event:', error);
      } else {
        // Refresh events after logging
        await fetchSecurityEvents();
      }
    } catch (err) {
      console.error('Error logging security event:', err);
    }
  };

  return {
    events,
    loading,
    error,
    refetch: fetchSecurityEvents,
    logSecurityEvent
  };
};