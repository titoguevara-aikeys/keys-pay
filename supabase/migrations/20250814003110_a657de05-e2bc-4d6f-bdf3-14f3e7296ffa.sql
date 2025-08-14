-- AIKeys Wallet Security Hardening & Circle Integration
-- Create idempotency table for webhook deduplication
CREATE TABLE IF NOT EXISTS public.idempotency_keys (
  provider text NOT NULL,
  key text NOT NULL,
  created_at timestamptz DEFAULT now(),
  payload_hash text,
  response_status integer,
  PRIMARY KEY (provider, key)
);

-- Enable RLS on idempotency_keys
ALTER TABLE public.idempotency_keys ENABLE ROW LEVEL SECURITY;

-- Create policy for idempotency_keys (system use only)
CREATE POLICY "System can manage idempotency keys" 
ON public.idempotency_keys 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create payment_events table for Circle webhook events
CREATE TABLE IF NOT EXISTS public.payment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text UNIQUE NOT NULL,
  event_type text NOT NULL,
  payment_id text,
  wallet_id text,
  amount numeric,
  currency text DEFAULT 'USDC',
  status text NOT NULL,
  raw_event jsonb NOT NULL,
  processed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on payment_events
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

-- Create policies for payment_events
CREATE POLICY "Admins can view payment events" 
ON public.payment_events 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "System can manage payment events" 
ON public.payment_events 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_events_event_type ON public.payment_events(event_type);
CREATE INDEX IF NOT EXISTS idx_payment_events_status ON public.payment_events(status);
CREATE INDEX IF NOT EXISTS idx_payment_events_created_at ON public.payment_events(created_at);
CREATE INDEX IF NOT EXISTS idx_idempotency_keys_created_at ON public.idempotency_keys(created_at);

-- Fix function search paths (security issue from linter)
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type text, 
  p_event_description text, 
  p_user_id uuid DEFAULT NULL::uuid, 
  p_ip_address inet DEFAULT NULL::inet, 
  p_user_agent text DEFAULT NULL::text, 
  p_device_fingerprint text DEFAULT NULL::text, 
  p_location text DEFAULT NULL::text, 
  p_risk_score integer DEFAULT 0, 
  p_blocked boolean DEFAULT false, 
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- Update other functions with proper search paths
CREATE OR REPLACE FUNCTION public.get_security_metrics(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  result jsonb;
  total_events integer;
  critical_events integer;
  high_events integer;
  blocked_events integer;
  recent_events integer;
BEGIN
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE metadata->>'severity' = 'critical'),
    COUNT(*) FILTER (WHERE metadata->>'severity' = 'high'),
    COUNT(*) FILTER (WHERE blocked = true),
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours')
  INTO total_events, critical_events, high_events, blocked_events, recent_events
  FROM public.security_events
  WHERE user_id = p_user_id OR user_id IS NULL;
  
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

-- Create webhook health check function
CREATE OR REPLACE FUNCTION public.webhook_health_check()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  result jsonb;
  recent_webhooks integer;
  failed_webhooks integer;
  last_webhook_time timestamptz;
BEGIN
  -- Count recent webhook activity
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE raw_event->>'status' = 'failed'),
    MAX(created_at)
  INTO recent_webhooks, failed_webhooks, last_webhook_time
  FROM public.payment_events
  WHERE created_at >= NOW() - INTERVAL '1 hour';
  
  result := jsonb_build_object(
    'status', 'healthy',
    'recentWebhooks', recent_webhooks,
    'failedWebhooks', failed_webhooks,
    'lastWebhookTime', last_webhook_time,
    'checkTime', NOW()
  );
  
  RETURN result;
END;
$function$;