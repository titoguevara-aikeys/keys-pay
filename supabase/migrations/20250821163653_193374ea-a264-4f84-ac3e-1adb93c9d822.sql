-- Fix RLS policies for NIUM tables

-- Enable RLS on NIUM tables
ALTER TABLE nium_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE nium_payouts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for nium_webhook_events
-- System can manage webhook events (for processing webhooks)
CREATE POLICY "System can manage webhook events" 
ON nium_webhook_events 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Admins can view webhook events
CREATE POLICY "Admins can view webhook events"
ON nium_webhook_events
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

-- Create RLS policies for nium_payouts  
-- System can manage payouts (for webhook updates)
CREATE POLICY "System can manage payouts"
ON nium_payouts
FOR ALL
USING (true)
WITH CHECK (true);

-- Admins can view payouts
CREATE POLICY "Admins can view payouts"
ON nium_payouts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);