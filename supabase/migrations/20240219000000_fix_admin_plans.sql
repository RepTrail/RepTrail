
-- Fix for Admin Plan Pricing and Policies

-- 0. Update plan_tier constraints
ALTER TABLE plan_features DROP CONSTRAINT IF EXISTS plan_features_plan_tier_check;
ALTER TABLE plan_features ADD CONSTRAINT plan_features_plan_tier_check CHECK (plan_tier IN ('on_demand', 'start', 'pro', 'elite'));

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_plan_tier_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_plan_tier_check CHECK (plan_tier IN ('none', 'on_demand', 'start', 'pro', 'elite'));
ALTER TABLE profiles ALTER COLUMN plan_tier SET DEFAULT 'on_demand';

-- 1. Ensure plan_features table exists and has correct structure
CREATE TABLE IF NOT EXISTS plan_features (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  plan_tier text NOT NULL, -- Constraint handled above
  feature_key text NOT NULL,
  is_enabled boolean DEFAULT true,
  limit_value integer,
  UNIQUE(plan_tier, feature_key)
);

-- 2. Enable RLS
ALTER TABLE plan_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;

-- 3. DROP old policies to avoid conflicts
DROP POLICY IF EXISTS "Admins manage plan_features" ON plan_features;
DROP POLICY IF EXISTS "Anyone can view plan features" ON plan_features;
DROP POLICY IF EXISTS "Admins see everything" ON admin_logs;
DROP POLICY IF EXISTS "Admins manage everything" ON admin_logs;
DROP POLICY IF EXISTS "Admins manage products" ON store_products;

-- 4. CREATE new admin-focused policies
-- Plan Features
CREATE POLICY "Admins manage plan_features"
ON plan_features FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Anyone can read plan features (needed for frontend prices)
CREATE POLICY "Anyone can view plan features"
ON plan_features FOR SELECT
TO authenticated, anon
USING (true);

-- Admin Logs
CREATE POLICY "Admins manage everything"
ON admin_logs FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Store Products (Management)
CREATE POLICY "Admins manage products"
ON store_products FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Ensure public select for products still exists
DROP POLICY IF EXISTS "Anyone can view active products" ON store_products;
CREATE POLICY "Anyone can view active products" 
ON store_products FOR SELECT 
USING (is_active = true OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- 5. Seed initial plan pricing if empty
INSERT INTO plan_features (plan_tier, feature_key, limit_value)
VALUES 
  ('on_demand', 'monthly_price_cents', 0),
  ('on_demand', 'price_per_student_cents', 2000),
  ('on_demand', 'free_students_limit', 5),
  ('on_demand', 'pro_features_threshold', 8),
  ('on_demand', 'student_limit', 9999), 
  ('on_demand', 'photo_updates_limit', 2),

  ('start', 'monthly_price_cents', 4990),
  ('start', 'quarterly_discount_pct', 15),
  ('start', 'annual_discount_pct', 20),
  ('start', 'student_limit', 10),
  ('start', 'photo_updates_limit', 2),

  ('pro', 'monthly_price_cents', 14990),
  ('pro', 'quarterly_discount_pct', 15),
  ('pro', 'annual_discount_pct', 20),
  ('pro', 'student_limit', 50),
  ('pro', 'photo_updates_limit', 4),

  ('elite', 'monthly_price_cents', 29990),
  ('elite', 'quarterly_discount_pct', 15),
  ('elite', 'annual_discount_pct', 20),
  ('elite', 'student_limit', 120),
  ('elite', 'photo_updates_limit', 9999)
ON CONFLICT (plan_tier, feature_key) DO NOTHING;
