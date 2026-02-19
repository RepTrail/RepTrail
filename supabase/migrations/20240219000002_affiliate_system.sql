-- Migration for Affiliate System

-- 1. Add affiliate fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_affiliate boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS affiliate_token text UNIQUE,
ADD COLUMN IF NOT EXISTS affiliate_balance numeric(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS referred_by_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 2. Create affiliate_clicks table
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    affiliate_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    ip_address text,
    user_agent text,
    referrer_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create affiliate_commissions table
CREATE TABLE IF NOT EXISTS public.affiliate_commissions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    affiliate_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    referred_user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount numeric(10, 2) NOT NULL,
    percentage numeric(5, 2) DEFAULT 10.0,
    status text CHECK (status IN ('pending', 'confirmed', 'cancelled', 'paid')) DEFAULT 'pending',
    description text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create affiliate_payouts table
CREATE TABLE IF NOT EXISTS public.affiliate_payouts (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    affiliate_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount numeric(10, 2) NOT NULL,
    status text CHECK (status IN ('requested', 'processing', 'completed', 'rejected')) DEFAULT 'requested',
    payout_method text,
    payout_details jsonb,
    processed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Enable RLS
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
-- Affiliates can see their own data
CREATE POLICY "Affiliates can view own clicks" ON public.affiliate_clicks 
    FOR SELECT USING (auth.uid() = affiliate_id);

CREATE POLICY "Affiliates can view own commissions" ON public.affiliate_commissions 
    FOR SELECT USING (auth.uid() = affiliate_id);

CREATE POLICY "Affiliates can view own payouts" ON public.affiliate_payouts 
    FOR SELECT USING (auth.uid() = affiliate_id);

-- Anyone can insert a click (it's public)
CREATE POLICY "Anyone can insert clicks" ON public.affiliate_clicks 
    FOR INSERT WITH CHECK (true);

-- 7. Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_affiliate_token ON public.profiles(affiliate_token);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by_id ON public.profiles(referred_by_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_affiliate_id ON public.affiliate_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_affiliate_id ON public.affiliate_commissions(affiliate_id);

-- 8. Function to generate random token
CREATE OR REPLACE FUNCTION generate_random_token(length integer DEFAULT 8)
RETURNS text AS $$
DECLARE
  chars text := 'abcdefghijklmnopqrstuvwxyz0123456789';
  result text := '';
  i integer := 0;
BEGIN
  FOR i IN 1..length LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;
