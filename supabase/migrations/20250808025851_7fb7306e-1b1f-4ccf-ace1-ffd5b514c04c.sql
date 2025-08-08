-- Create physical_card_orders table to track physical card orders
CREATE TABLE public.physical_card_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  virtual_card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  delivery_option TEXT NOT NULL CHECK (delivery_option IN ('standard', 'express')),
  delivery_price DECIMAL(10,2) NOT NULL,
  card_issuance_price DECIMAL(10,2) NOT NULL DEFAULT 15.00,
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'failed')),
  tracking_number TEXT,
  estimated_delivery DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.physical_card_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for users to view their own orders
CREATE POLICY "select_own_orders" ON public.physical_card_orders
  FOR SELECT
  USING (user_id = auth.uid());

-- Create policies for edge functions to insert and update orders
CREATE POLICY "insert_order" ON public.physical_card_orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "update_order" ON public.physical_card_orders
  FOR UPDATE
  USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_physical_card_orders_updated_at
  BEFORE UPDATE ON public.physical_card_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();