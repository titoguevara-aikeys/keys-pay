-- Fix security events table to handle null user_id for system events
ALTER TABLE public.security_events ALTER COLUMN user_id DROP NOT NULL;

-- Add index for better performance on security event queries
CREATE INDEX IF NOT EXISTS idx_security_events_user_id_created_at 
ON public.security_events(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_security_events_event_type 
ON public.security_events(event_type);

CREATE INDEX IF NOT EXISTS idx_security_events_severity 
ON public.security_events((metadata->>'severity'));

-- Update the log_security_event function to handle both user and system events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type text,
  p_event_description text,
  p_user_id uuid DEFAULT NULL,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_device_fingerprint text DEFAULT NULL,
  p_location text DEFAULT NULL,
  p_risk_score integer DEFAULT 0,
  p_blocked boolean DEFAULT false,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.security_events (
    user_id, event_type, event_description, ip_address, 
    user_agent, device_fingerprint, location, risk_score, blocked, metadata
  ) VALUES (
    p_user_id, p_event_type, p_event_description, p_ip_address,
    p_user_agent, p_device_fingerprint, p_location, p_risk_score, p_blocked, p_metadata
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$function$;

-- Create a function to get security metrics for dashboard
CREATE OR REPLACE FUNCTION public.get_security_metrics(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  result jsonb;
  total_events integer;
  critical_events integer;
  high_events integer;
  blocked_events integer;
  recent_events integer;
BEGIN
  -- Get event counts for the user
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE metadata->>'severity' = 'critical'),
    COUNT(*) FILTER (WHERE metadata->>'severity' = 'high'),
    COUNT(*) FILTER (WHERE blocked = true),
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours')
  INTO total_events, critical_events, high_events, blocked_events, recent_events
  FROM public.security_events
  WHERE user_id = p_user_id OR user_id IS NULL; -- Include system events
  
  result := jsonb_build_object(
    'totalEvents', total_events,
    'criticalEvents', critical_events,
    'highRiskEvents', high_events,
    'blockedEvents', blocked_events,
    'recentEvents', recent_events,
    'lastUpdated', NOW()
  );
  
  RETURN result;
END;
$function$;