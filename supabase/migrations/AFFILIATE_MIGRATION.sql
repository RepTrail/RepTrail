-- ============================================================
-- RepTrail Affiliate System — Run this in Supabase SQL Editor
-- ============================================================

-- 1. Add affiliate fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_affiliate boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS affiliate_token text UNIQUE,
ADD COLUMN IF NOT EXISTS affiliate_balance numeric(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS referred_by_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 2. Table for tracking link clicks
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    affiliate_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    ip_address text,
    user_agent text,
    referrer_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table for tracking commissions (10% of each plan payment)
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

-- 4. Table for payout requests
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
DROP POLICY IF EXISTS "Affiliates can view own clicks" ON public.affiliate_clicks;
DROP POLICY IF EXISTS "Affiliates can view own commissions" ON public.affiliate_commissions;
DROP POLICY IF EXISTS "Affiliates can view own payouts" ON public.affiliate_payouts;
DROP POLICY IF EXISTS "Anyone can insert clicks" ON public.affiliate_clicks;

CREATE POLICY "Affiliates can view own clicks" ON public.affiliate_clicks 
    FOR SELECT USING (auth.uid() = affiliate_id);

CREATE POLICY "Affiliates can view own commissions" ON public.affiliate_commissions 
    FOR SELECT USING (auth.uid() = affiliate_id);

CREATE POLICY "Affiliates can view own payouts" ON public.affiliate_payouts 
    FOR SELECT USING (auth.uid() = affiliate_id);

CREATE POLICY "Anyone can insert clicks" ON public.affiliate_clicks 
    FOR INSERT WITH CHECK (true);

-- Affiliates can request their own payouts
CREATE POLICY "Affiliates can insert own payouts" ON public.affiliate_payouts
    FOR INSERT WITH CHECK (auth.uid() = affiliate_id);

-- 7. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_affiliate_token ON public.profiles(affiliate_token);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by_id ON public.profiles(referred_by_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_affiliate_id ON public.affiliate_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_created_at ON public.affiliate_clicks(created_at);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_affiliate_id ON public.affiliate_commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_affiliate_id ON public.affiliate_payouts(affiliate_id);

-- 8. Helper function to generate random tokens
CREATE OR REPLACE FUNCTION generate_random_token(length integer DEFAULT 10)
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

-- 9. Update handle_new_user trigger to support affiliate token and referral tracking
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    is_trainer BOOLEAN;
    generated_code TEXT;
    v_referred_by_id UUID;
    v_is_affiliate BOOLEAN;
    v_affiliate_token TEXT;
BEGIN
    is_trainer := (COALESCE(new.raw_user_meta_data->>'role', 'student') = 'trainer');
    v_referred_by_id := NULL;
    
    -- Parse referred_by_id if provided
    IF new.raw_user_meta_data->>'referred_by_id' IS NOT NULL THEN
        BEGIN
            v_referred_by_id := (new.raw_user_meta_data->>'referred_by_id')::UUID;
        EXCEPTION WHEN others THEN
            v_referred_by_id := NULL;
        END;
    END IF;

    v_is_affiliate := COALESCE((new.raw_user_meta_data->>'is_affiliate')::BOOLEAN, false);
    
    -- Generate trainer code for trainers
    IF is_trainer THEN
        generated_code := generate_random_trainer_code();
    ELSE
        generated_code := NULL;
    END IF;

    -- Generate affiliate token if registering as affiliate
    IF v_is_affiliate THEN
        v_affiliate_token := generate_random_token();
    ELSE
        v_affiliate_token := NULL;
    END IF;

    INSERT INTO public.profiles (
        id, 
        email, 
        role, 
        full_name, 
        avatar_url, 
        whatsapp, 
        plan_tier, 
        trainer_code, 
        referred_by_id,
        is_affiliate,
        affiliate_token
    )
    VALUES (
        new.id, 
        new.email, 
        COALESCE(new.raw_user_meta_data->>'role', 'student'),
        new.raw_user_meta_data->>'full_name', 
        new.raw_user_meta_data->>'avatar_url',
        new.raw_user_meta_data->>'whatsapp',
        CASE 
          WHEN (new.raw_user_meta_data->>'role') = 'trainer' THEN 'on_demand'
          ELSE 'start' 
        END,
        generated_code,
        v_referred_by_id,
        v_is_affiliate,
        v_affiliate_token
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
