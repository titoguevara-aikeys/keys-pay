-- Create Ramp webhook tracking table
CREATE TABLE IF NOT EXISTS public.ramp_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT,
  order_id TEXT,
  signature TEXT,
  payload JSONB NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_ramp_webhooks_order ON public.ramp_webhooks(order_id);
CREATE INDEX IF NOT EXISTS idx_ramp_webhooks_event ON public.ramp_webhooks(event_type);
CREATE INDEX IF NOT EXISTS idx_ramp_webhooks_received ON public.ramp_webhooks(received_at DESC);

-- Create Ramp test results table
CREATE TABLE IF NOT EXISTS public.ramp_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_name TEXT NOT NULL,
  ok BOOLEAN NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ramp_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ramp_tests ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can view ramp webhooks" ON public.ramp_webhooks
  FOR SELECT USING (is_admin());

CREATE POLICY "System can insert ramp webhooks" ON public.ramp_webhooks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage ramp tests" ON public.ramp_tests
  FOR ALL USING (is_admin());

CREATE POLICY "System can insert ramp tests" ON public.ramp_tests
  FOR INSERT WITH CHECK (true);