-- Create cron jobs for automated monitoring
SELECT cron.schedule(
  'aikeys-monitor-5min',
  '*/5 * * * *', -- Every 5 minutes
  $$
  SELECT
    net.http_post(
        url:='https://lovable-api.supabase.co/functions/v1/aikeys-monitor?action=monitor',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvdmFibGUtYXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MzA4ODAsImV4cCI6MjA0NzAwNjg4MH0.SnrXyJOW_FJT4IjP--cKmM6Cr1LhGN_p4cBhQ4vGzhs"}'::jsonb,
        body:=concat('{"timestamp": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- Create hourly status reports
SELECT cron.schedule(
  'aikeys-monitor-hourly',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT
    net.http_post(
        url:='https://lovable-api.supabase.co/functions/v1/aikeys-monitor?action=hourly',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvdmFibGUtYXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MzA4ODAsImV4cCI6MjA0NzAwNjg4MH0.SnrXyJOW_FJT4IjP--cKmM6Cr1LhGN_p4cBhQ4vGzhs"}'::jsonb,
        body:=concat('{"timestamp": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- Create monitoring events table for historical data
CREATE TABLE IF NOT EXISTS public.monitoring_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  mode TEXT NOT NULL,
  ttfb INTEGER NOT NULL,
  lcp INTEGER NOT NULL,
  api_error_rate DECIMAL NOT NULL,
  current_users INTEGER NOT NULL,
  requests_per_second INTEGER NOT NULL,
  uptime DECIMAL NOT NULL,
  alert_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.monitoring_events ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access only
CREATE POLICY "Admins can view monitoring events" 
ON public.monitoring_events 
FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "System can insert monitoring events" 
ON public.monitoring_events 
FOR INSERT 
WITH CHECK (true);

-- Create feature flags for monitoring system
INSERT INTO public.feature_flags (key, value, description) VALUES
('monitoring_enabled', 'true', 'Enable automated monitoring system'),
('self_healing_enabled', 'true', 'Enable self-healing capabilities'),
('emergency_mode_threshold', '10', 'Error rate threshold for emergency mode'),
('performance_threshold_ttfb', '3000', 'TTFB threshold in milliseconds'),
('performance_threshold_lcp', '4000', 'LCP threshold in milliseconds')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();