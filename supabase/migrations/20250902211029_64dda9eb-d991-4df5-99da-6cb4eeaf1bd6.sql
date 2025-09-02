-- Update cards table to support Keys Pay card management
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS provider_data jsonb DEFAULT '{}';
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS last_four text;
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS expiry_month integer;
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS expiry_year integer;
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS cvv text;

-- Update crypto_orders table to support Keys Pay integration
ALTER TABLE public.crypto_orders ADD COLUMN IF NOT EXISTS checkout_session_id text;
ALTER TABLE public.crypto_orders ADD COLUMN IF NOT EXISTS provider_response jsonb DEFAULT '{}';

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