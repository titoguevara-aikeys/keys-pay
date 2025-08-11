-- Circle Payment Integration Schema

-- Feature flags table (if not exists)
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT 'true',
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Audit events table
CREATE TABLE IF NOT EXISTS public.audit_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  actor_id UUID,
  actor_email TEXT,
  ip_address INET,
  event_type TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Circle payment transactions
CREATE TABLE IF NOT EXISTS public.circle_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  circle_transaction_id TEXT UNIQUE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdraw')),
  amount DECIMAL(20,8) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USDC',
  status TEXT NOT NULL DEFAULT 'pending',
  circle_wallet_id TEXT,
  deposit_address TEXT,
  destination_address TEXT,
  idempotency_key TEXT UNIQUE,
  circle_response JSONB,
  error_details JSONB,
  webhook_received_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Circle webhooks for replay protection
CREATE TABLE IF NOT EXISTS public.circle_webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  webhook_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  signature TEXT NOT NULL,
  raw_payload TEXT, -- encrypted in production
  processed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payment queue for resilience
CREATE TABLE IF NOT EXISTS public.payment_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_type TEXT NOT NULL,
  job_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'queued_kill_switch')),
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  error_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Circle health metrics
CREATE TABLE IF NOT EXISTS public.circle_health_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  endpoint TEXT NOT NULL,
  response_time_ms INTEGER NOT NULL,
  status_code INTEGER,
  error_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  circuit_breaker_state TEXT DEFAULT 'closed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_circle_transactions_user_id ON public.circle_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_circle_transactions_status ON public.circle_transactions(status);
CREATE INDEX IF NOT EXISTS idx_circle_transactions_created_at ON public.circle_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_events_timestamp ON public.audit_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_events_actor_id ON public.audit_events(actor_id);
CREATE INDEX IF NOT EXISTS idx_feature_flags_key ON public.feature_flags(key);
CREATE INDEX IF NOT EXISTS idx_payment_queue_status ON public.payment_queue(status);
CREATE INDEX IF NOT EXISTS idx_payment_queue_scheduled_at ON public.payment_queue(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_circle_health_metrics_timestamp ON public.circle_health_metrics(timestamp);

-- Enable RLS
ALTER TABLE public.circle_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own circle transactions" 
ON public.circle_transactions FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all circle transactions" 
ON public.circle_transactions FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "System can insert circle transactions" 
ON public.circle_transactions FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update circle transactions" 
ON public.circle_transactions FOR UPDATE 
USING (true);

-- Webhook policies (system only)
CREATE POLICY "System can manage webhooks" 
ON public.circle_webhooks FOR ALL 
USING (true);

-- Payment queue policies (system only)
CREATE POLICY "System can manage payment queue" 
ON public.payment_queue FOR ALL 
USING (true);

-- Health metrics policies (admins only)
CREATE POLICY "Admins can view health metrics" 
ON public.circle_health_metrics FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "System can insert health metrics" 
ON public.circle_health_metrics FOR INSERT 
WITH CHECK (true);

-- Audit events policies (admins only)
CREATE POLICY "Admins can view audit events" 
ON public.audit_events FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "System can insert audit events" 
ON public.audit_events FOR INSERT 
WITH CHECK (true);

-- Feature flags policies
CREATE POLICY "Everyone can read feature flags" 
ON public.feature_flags FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage feature flags" 
ON public.feature_flags FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

-- Insert default feature flags for Circle payments
INSERT INTO public.feature_flags (key, value, description) VALUES
('FF_PAYMENTS_ENABLED', 'true', 'Global payments enabled flag'),
('FF_WITHDRAWALS_ENABLED', 'true', 'Enable withdrawal functionality'),
('FF_DEPOSITS_ENABLED', 'true', 'Enable deposit functionality'),
('FF_WEBHOOKS_ENABLED', 'true', 'Enable webhook processing'),
('FF_SECONDARY_USDC_PROVIDER', 'false', 'Enable secondary USDC provider'),
('CIRCLE_TIMEOUT_MS', '8000', 'Circle API timeout in milliseconds'),
('CIRCLE_MAX_QPS', '10', 'Maximum queries per second to Circle'),
('PAYMENTS_RETRY_MAX_ATTEMPTS', '4', 'Maximum retry attempts for payments'),
('PAYMENTS_RETRY_BASE_MS', '500', 'Base retry delay in milliseconds'),
('PAYMENTS_CACHE_TTL_SECONDS', '60', 'Cache TTL for payment data'),
('PAYMENTS_BREAKER_THRESHOLD_ERRORS', '0.5', 'Circuit breaker error threshold'),
('PAYMENTS_BREAKER_MIN_REQUESTS', '20', 'Minimum requests for circuit breaker'),
('PAYMENTS_BREAKER_OPEN_SECONDS', '30', 'Circuit breaker open duration'),
('AUTO_RESTORE_MAX_MINUTES', '20', 'Maximum minutes before auto-restore'),
('CANARY_DEFAULT_PERCENT', '5', 'Default canary percentage'),
('CANARY_HEALTH_ERROR_RATE_MAX', '0.02', 'Maximum error rate for canary health'),
('CANARY_HEALTH_P95_MS_MAX', '1200', 'Maximum P95 latency for canary health'),
('KILL_SWITCH_REQUIRE_OTP', 'false', 'Require OTP for kill switch operations')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = now();

-- Create function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_actor_id UUID,
  p_actor_email TEXT,
  p_ip_address INET,
  p_event_type TEXT,
  p_details JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.audit_events (
    actor_id, actor_email, ip_address, event_type, details
  ) VALUES (
    p_actor_id, p_actor_email, p_ip_address, p_event_type, p_details
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- Create function to update feature flags with audit
CREATE OR REPLACE FUNCTION public.update_feature_flag(
  p_key TEXT,
  p_value JSONB,
  p_actor_id UUID DEFAULT NULL,
  p_actor_email TEXT DEFAULT NULL,
  p_ip_address INET DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  old_value JSONB;
BEGIN
  -- Get old value for audit
  SELECT value INTO old_value FROM public.feature_flags WHERE key = p_key;
  
  -- Update flag
  UPDATE public.feature_flags 
  SET value = p_value, updated_at = now(), updated_by = p_actor_id
  WHERE key = p_key;
  
  -- Log audit event
  PERFORM public.log_audit_event(
    p_actor_id,
    p_actor_email,
    p_ip_address,
    'FEATURE_FLAG_UPDATED',
    jsonb_build_object(
      'key', p_key,
      'old_value', old_value,
      'new_value', p_value
    )
  );
  
  RETURN FOUND;
END;
$$;

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_circle_transactions_updated_at
  BEFORE UPDATE ON public.circle_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_queue_updated_at
  BEFORE UPDATE ON public.payment_queue
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();