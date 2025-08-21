-- Create NIUM webhook events table
CREATE TABLE IF NOT EXISTS nium_webhook_events (
  id TEXT PRIMARY KEY,
  template TEXT NOT NULL,
  payload JSONB NOT NULL,
  received_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create NIUM payouts audit table
CREATE TABLE IF NOT EXISTS nium_payouts (
  system_ref TEXT PRIMARY KEY,
  customer_hash_id TEXT,
  wallet_hash_id TEXT,
  currency TEXT,
  amount NUMERIC,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_nium_webhook_events_template ON nium_webhook_events(template);
CREATE INDEX IF NOT EXISTS idx_nium_webhook_events_received_at ON nium_webhook_events(received_at);
CREATE INDEX IF NOT EXISTS idx_nium_payouts_status ON nium_payouts(status);
CREATE INDEX IF NOT EXISTS idx_nium_payouts_customer ON nium_payouts(customer_hash_id);