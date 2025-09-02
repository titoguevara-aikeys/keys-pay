-- Update cards table to support Keys Pay card management
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS provider_data jsonb DEFAULT '{}';
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS last_four text;
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS expiry_month integer;
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS expiry_year integer;
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS cvv text;

-- Update crypto_orders table to support Keys Pay integration
ALTER TABLE public.crypto_orders ADD COLUMN IF NOT EXISTS checkout_session_id text;
ALTER TABLE public.crypto_orders ADD COLUMN IF NOT EXISTS provider_response jsonb DEFAULT '{}';

-- Create API rate limits table for Keys Pay endpoints
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier text NOT NULL, -- IP address or user ID
  endpoint text NOT NULL,
  requests_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_identifier_endpoint ON public.api_rate_limits(identifier, endpoint);
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_window_start ON public.api_rate_limits(window_start);

-- Enable RLS on rate limits table
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policy for rate limits (system only)
CREATE POLICY "System can manage rate limits" ON public.api_rate_limits
  FOR ALL USING (true);

-- Update profiles table to support Keys Pay business profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'Asia/Dubai';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_role text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS registration_platform text DEFAULT 'keys-pay';

-- Create webhook events table for Keys Pay providers
CREATE TABLE IF NOT EXISTS public.keyspay_webhook_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  provider text NOT NULL, -- 'guardarian', 'nymcard', 'wio', 'ramp'
  event_type text NOT NULL,
  event_id text NOT NULL,
  payload jsonb NOT NULL,
  signature text,
  processed boolean DEFAULT false,
  processed_at timestamp with time zone,
  error_message text,
  retry_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Create unique constraint on provider + event_id for idempotency
CREATE UNIQUE INDEX IF NOT EXISTS idx_keyspay_webhook_events_provider_event_id 
  ON public.keyspay_webhook_events(provider, event_id);

-- Enable RLS on webhook events
ALTER TABLE public.keyspay_webhook_events ENABLE ROW LEVEL SECURITY;

-- Create policies for webhook events
CREATE POLICY "System can manage webhook events" ON public.keyspay_webhook_events
  FOR ALL USING (true);

CREATE POLICY "Admins can view webhook events" ON public.keyspay_webhook_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Create user sessions table for Keys Pay authentication tracking
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  session_token text NOT NULL,
  ip_address inet,
  user_agent text,
  device_fingerprint text,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  last_accessed_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on user sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for user sessions
CREATE POLICY "Users can view their own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage sessions" ON public.user_sessions
  FOR ALL USING (true);

-- Create cleanup function for expired data
CREATE OR REPLACE FUNCTION public.cleanup_keyspay_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Clean up expired rate limits (older than 1 hour)
  DELETE FROM public.api_rate_limits 
  WHERE window_start < now() - INTERVAL '1 hour';
  
  -- Clean up old webhook events (older than 30 days)
  DELETE FROM public.keyspay_webhook_events 
  WHERE created_at < now() - INTERVAL '30 days' AND processed = true;
  
  -- Clean up expired user sessions
  DELETE FROM public.user_sessions 
  WHERE expires_at < now();
END;
$$;