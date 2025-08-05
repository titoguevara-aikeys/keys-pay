-- Create security events table for audit logging
CREATE TABLE public.security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  event_description TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  device_fingerprint TEXT,
  location TEXT,
  risk_score INTEGER DEFAULT 0,
  blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create two-factor authentication table
CREATE TABLE public.user_2fa (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  secret TEXT NOT NULL,
  enabled BOOLEAN DEFAULT FALSE,
  backup_codes TEXT[],
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trusted devices table
CREATE TABLE public.trusted_devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  device_name TEXT NOT NULL,
  device_fingerprint TEXT NOT NULL UNIQUE,
  device_type TEXT NOT NULL,
  last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  trusted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create login sessions table
CREATE TABLE public.login_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  device_fingerprint TEXT,
  ip_address INET,
  user_agent TEXT,
  location TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create security settings table
CREATE TABLE public.security_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  biometric_enabled BOOLEAN DEFAULT FALSE,
  fraud_monitoring_enabled BOOLEAN DEFAULT TRUE,
  login_notifications BOOLEAN DEFAULT TRUE,
  suspicious_activity_alerts BOOLEAN DEFAULT TRUE,
  device_verification_required BOOLEAN DEFAULT FALSE,
  session_timeout_minutes INTEGER DEFAULT 480,
  max_concurrent_sessions INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_2fa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for security_events
CREATE POLICY "Users can view their own security events" 
ON public.security_events 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert security events" 
ON public.security_events 
FOR INSERT 
WITH CHECK (true);

-- Create RLS policies for user_2fa
CREATE POLICY "Users can view their own 2FA settings" 
ON public.user_2fa 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own 2FA settings" 
ON public.user_2fa 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for trusted_devices
CREATE POLICY "Users can view their own trusted devices" 
ON public.trusted_devices 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own trusted devices" 
ON public.trusted_devices 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for login_sessions
CREATE POLICY "Users can view their own login sessions" 
ON public.login_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can manage login sessions" 
ON public.login_sessions 
FOR ALL 
USING (true);

-- Create RLS policies for security_settings
CREATE POLICY "Users can view their own security settings" 
ON public.security_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own security settings" 
ON public.security_settings 
FOR ALL 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX idx_security_events_created_at ON public.security_events(created_at);
CREATE INDEX idx_trusted_devices_user_id ON public.trusted_devices(user_id);
CREATE INDEX idx_trusted_devices_fingerprint ON public.trusted_devices(device_fingerprint);
CREATE INDEX idx_login_sessions_user_id ON public.login_sessions(user_id);
CREATE INDEX idx_login_sessions_token ON public.login_sessions(session_token);

-- Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_event_description TEXT,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_device_fingerprint TEXT DEFAULT NULL,
  p_location TEXT DEFAULT NULL,
  p_risk_score INTEGER DEFAULT 0,
  p_blocked BOOLEAN DEFAULT FALSE
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.security_events (
    user_id, event_type, event_description, ip_address, 
    user_agent, device_fingerprint, location, risk_score, blocked
  ) VALUES (
    p_user_id, p_event_type, p_event_description, p_ip_address,
    p_user_agent, p_device_fingerprint, p_location, p_risk_score, p_blocked
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for security_settings timestamps
CREATE TRIGGER update_security_settings_updated_at
BEFORE UPDATE ON public.security_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for user_2fa timestamps
CREATE TRIGGER update_user_2fa_updated_at
BEFORE UPDATE ON public.user_2fa
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();