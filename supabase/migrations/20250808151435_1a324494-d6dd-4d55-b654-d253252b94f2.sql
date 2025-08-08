-- Enable RLS on new tables and add missing policies
ALTER TABLE public.device_trust ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_rules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for device_trust
CREATE POLICY "Users can manage their own device trust" 
ON public.device_trust 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for biometric_credentials
CREATE POLICY "Users can manage their own biometric credentials" 
ON public.biometric_credentials 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for fraud_rules (admin only)
CREATE POLICY "Only admins can manage fraud rules" 
ON public.fraud_rules 
FOR ALL 
USING (public.is_admin());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_device_trust_user_id ON public.device_trust(user_id);
CREATE INDEX IF NOT EXISTS idx_device_trust_fingerprint ON public.device_trust(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_device_trust_trust_level ON public.device_trust(trust_level);

CREATE INDEX IF NOT EXISTS idx_biometric_credentials_user_id ON public.biometric_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_biometric_credentials_credential_id ON public.biometric_credentials(credential_id);

-- Add triggers for updated_at
CREATE TRIGGER IF NOT EXISTS update_device_trust_updated_at
BEFORE UPDATE ON public.device_trust
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_biometric_credentials_updated_at
BEFORE UPDATE ON public.biometric_credentials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_fraud_rules_updated_at
BEFORE UPDATE ON public.fraud_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default fraud detection rules (only if they don't exist)
INSERT INTO public.fraud_rules (rule_name, rule_type, rule_config, risk_score, is_active) 
SELECT rule_name, rule_type, rule_config::jsonb, risk_score, is_active
FROM (VALUES
  ('high_velocity_transactions', 'velocity', '{"max_amount": 5000, "time_window_hours": 24, "max_transactions": 10}', 70, true),
  ('impossible_travel', 'geolocation', '{"max_velocity_kmh": 500}', 90, true),
  ('suspicious_login_time', 'behavioral', '{"unusual_hours": [0, 1, 2, 3, 4, 5]}', 30, true),
  ('large_transaction', 'transaction', '{"threshold_amount": 10000}', 60, true),
  ('new_device_login', 'behavioral', '{"trust_duration_days": 30}', 40, true)
) AS new_rules(rule_name, rule_type, rule_config, risk_score, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM public.fraud_rules WHERE fraud_rules.rule_name = new_rules.rule_name
);

-- Create function to evaluate fraud risk with proper search path
CREATE OR REPLACE FUNCTION public.evaluate_fraud_risk(
  p_user_id UUID,
  p_transaction_amount NUMERIC DEFAULT NULL,
  p_location JSONB DEFAULT NULL,
  p_device_fingerprint TEXT DEFAULT NULL
) RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  total_risk_score INTEGER := 0;
  rule_record RECORD;
  recent_transactions NUMERIC;
  device_trusted BOOLEAN;
BEGIN
  -- Evaluate each active fraud rule
  FOR rule_record IN 
    SELECT rule_name, rule_type, rule_config, risk_score 
    FROM public.fraud_rules 
    WHERE is_active = true
  LOOP
    -- Velocity check
    IF rule_record.rule_type = 'velocity' AND p_transaction_amount IS NOT NULL THEN
      SELECT COALESCE(SUM(amount), 0) INTO recent_transactions
      FROM public.transactions t
      JOIN public.accounts a ON t.account_id = a.id
      WHERE a.user_id = p_user_id 
        AND t.created_at > now() - INTERVAL '24 hours'
        AND t.transaction_type = 'debit';
      
      IF recent_transactions + p_transaction_amount > (rule_record.rule_config->>'max_amount')::NUMERIC THEN
        total_risk_score := total_risk_score + rule_record.risk_score;
      END IF;
    END IF;
    
    -- Device trust check
    IF rule_record.rule_type = 'behavioral' AND p_device_fingerprint IS NOT NULL THEN
      SELECT trust_level = 'trusted' INTO device_trusted
      FROM public.device_trust
      WHERE user_id = p_user_id AND device_fingerprint = p_device_fingerprint;
      
      IF NOT COALESCE(device_trusted, false) THEN
        total_risk_score := total_risk_score + rule_record.risk_score;
      END IF;
    END IF;
    
    -- Transaction amount check
    IF rule_record.rule_type = 'transaction' AND p_transaction_amount IS NOT NULL THEN
      IF p_transaction_amount > (rule_record.rule_config->>'threshold_amount')::NUMERIC THEN
        total_risk_score := total_risk_score + rule_record.risk_score;
      END IF;
    END IF;
  END LOOP;
  
  RETURN LEAST(total_risk_score, 100);
END;
$$;