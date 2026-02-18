-- RepTrail 2.0 Migration
-- 1. Fix load_history relationship to cascade on log deletion
ALTER TABLE load_history 
DROP CONSTRAINT IF EXISTS load_history_workout_log_id_fkey,
ADD CONSTRAINT load_history_workout_log_id_fkey 
FOREIGN KEY (workout_log_id) REFERENCES workout_logs(id) ON DELETE CASCADE;

-- 2. New Cardio Session Structure (For interactive sessions)
CREATE TABLE IF NOT EXISTS cardio_sessions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  assigned_cardio_id uuid REFERENCES assigned_cardios(id) ON DELETE SET NULL,
  name text NOT NULL,
  target_duration_seconds integer,
  
  status text CHECK (status IN ('in_progress', 'completed', 'paused', 'abandoned')) DEFAULT 'in_progress',
  elapsed_seconds integer DEFAULT 0,
  calories_burned numeric(6, 1),
  intensity_feedback text,
  
  started_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at timestamp with time zone,
  last_heartbeat_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Internal Store (Growth)
CREATE TABLE IF NOT EXISTS store_products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  growth_id text UNIQUE, -- ID from Growth site if available
  name text NOT NULL,
  description text,
  image_url text,
  official_price numeric(10, 2),
  link_url text NOT NULL,
  category text, -- supplement, accessory, etc.
  nutritional_info jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS affiliate_links (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  type text NOT NULL, -- 'growth', 'generic'
  code text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS product_click_logs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  product_id uuid REFERENCES store_products(id) ON DELETE CASCADE,
  clicked_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Admin and System Logging
CREATE TABLE IF NOT EXISTS admin_logs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id uuid REFERENCES profiles(id),
  action text NOT NULL,
  target_id uuid,
  details jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS plan_features (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  plan_tier text CHECK (plan_tier IN ('start', 'pro', 'elite')) NOT NULL,
  feature_key text NOT NULL,
  is_enabled boolean DEFAULT true,
  limit_value integer, -- e.g. student limit
  UNIQUE(plan_tier, feature_key)
);

CREATE TABLE IF NOT EXISTS search_logs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  query text NOT NULL,
  filters jsonb,
  results_count integer,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. RLS Policies for new tables
ALTER TABLE cardio_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_click_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

-- Select policies
CREATE POLICY "Anyone can view active products" ON store_products FOR SELECT USING (is_active = true);
CREATE POLICY "Students see own cardio sessions" ON cardio_sessions FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Admins see everything" ON admin_logs FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'trainer') -- Temporary simplicity: assuming trainers are admins for now, or add an 'admin' role
);

-- 6. Add perceived_effort to workout_logs if not exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='workout_logs' AND column_name='perceived_effort') THEN
        ALTER TABLE workout_logs ADD COLUMN perceived_effort integer CHECK (perceived_effort BETWEEN 1 AND 10);
    END IF;
END $$;
