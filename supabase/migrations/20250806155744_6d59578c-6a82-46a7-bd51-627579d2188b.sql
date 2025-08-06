-- Create crypto assets table
CREATE TABLE public.crypto_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  icon_url TEXT,
  current_price NUMERIC(20, 8) NOT NULL DEFAULT 0,
  price_change_24h NUMERIC(10, 4) DEFAULT 0,
  market_cap NUMERIC(20, 2),
  volume_24h NUMERIC(20, 2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crypto wallets table
CREATE TABLE public.crypto_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  asset_id UUID NOT NULL REFERENCES public.crypto_assets(id),
  balance NUMERIC(20, 8) NOT NULL DEFAULT 0,
  wallet_address TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, asset_id)
);

-- Create crypto transactions table
CREATE TABLE public.crypto_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  wallet_id UUID NOT NULL REFERENCES public.crypto_wallets(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('buy', 'sell', 'deposit', 'withdraw', 'swap', 'convert')),
  amount NUMERIC(20, 8) NOT NULL,
  usd_value NUMERIC(20, 2),
  fee NUMERIC(20, 8) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  transaction_hash TEXT,
  from_address TEXT,
  to_address TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.crypto_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for crypto_assets (public read access)
CREATE POLICY "Anyone can view crypto assets" 
ON public.crypto_assets 
FOR SELECT 
USING (true);

-- Create RLS policies for crypto_wallets
CREATE POLICY "Users can view their own crypto wallets" 
ON public.crypto_wallets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own crypto wallets" 
ON public.crypto_wallets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own crypto wallets" 
ON public.crypto_wallets 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for crypto_transactions
CREATE POLICY "Users can view their own crypto transactions" 
ON public.crypto_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own crypto transactions" 
ON public.crypto_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create triggers for timestamp updates
CREATE TRIGGER update_crypto_assets_updated_at
BEFORE UPDATE ON public.crypto_assets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crypto_wallets_updated_at
BEFORE UPDATE ON public.crypto_wallets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample crypto assets
INSERT INTO public.crypto_assets (symbol, name, icon_url, current_price, price_change_24h) VALUES
('BTC', 'Bitcoin', 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', 45000.00, 2.5),
('ETH', 'Ethereum', 'https://cryptologos.cc/logos/ethereum-eth-logo.png', 3200.00, -1.2),
('SOL', 'Solana', 'https://cryptologos.cc/logos/solana-sol-logo.png', 95.50, 5.8),
('USDC', 'USD Coin', 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', 1.00, 0.0),
('USDT', 'Tether', 'https://cryptologos.cc/logos/tether-usdt-logo.png', 1.00, 0.1);