-- # REPTRAIL V2 - COMPLETE DATABASE FIX
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. BASE EXTENSIONS (Ensure uuid-ossp is enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CARDIO SYSTEM (Library & Assignments)
CREATE TABLE IF NOT EXISTS cardios (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  trainer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS assigned_cardios (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  cardio_id uuid REFERENCES cardios(id) ON DELETE CASCADE NOT NULL,
  duration_minutes integer NOT NULL,
  suggested_intensity text NOT NULL,
  days_of_week integer[],
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Caso a tabela já exista e falte a coluna nova:
ALTER TABLE assigned_cardios DROP COLUMN IF EXISTS day_of_week;
ALTER TABLE assigned_cardios ADD COLUMN IF NOT EXISTS days_of_week integer[];

CREATE TABLE IF NOT EXISTS cardio_logs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  assigned_cardio_id uuid REFERENCES assigned_cardios(id) ON DELETE CASCADE NOT NULL,
  status text CHECK (status IN ('in_progress', 'completed', 'abandoned')) DEFAULT 'in_progress',
  elapsed_seconds integer DEFAULT 0,
  is_running boolean DEFAULT false,
  started_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at timestamp with time zone,
  last_heartbeat_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  feedback text,
  intensity_used text
);

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

-- 3. STORE & AFFILIATES
CREATE TABLE IF NOT EXISTS store_products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  growth_id text UNIQUE,
  name text NOT NULL,
  description text,
  image_url text,
  official_price numeric(10, 2),
  link_url text NOT NULL,
  category text,
  nutritional_info jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS affiliate_links (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  type text NOT NULL,
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

-- 4. SYSTEM MANAGEMENT
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
  limit_value integer,
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

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE cardios ENABLE ROW LEVEL SECURITY;
ALTER TABLE assigned_cardios ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_click_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES

-- Cardios Library
DROP POLICY IF EXISTS "Trainer manages own cardio library" ON cardios;
CREATE POLICY "Trainer manages own cardio library" ON cardios FOR ALL USING (auth.uid() = trainer_id);

-- Assigned Cardios
DROP POLICY IF EXISTS "Trainer manages cardio assignments" ON assigned_cardios;
CREATE POLICY "Trainer manages cardio assignments" ON assigned_cardios FOR ALL USING (
    EXISTS (SELECT 1 FROM trainer_students WHERE trainer_id = auth.uid() AND student_id = assigned_cardios.student_id)
);

DROP POLICY IF EXISTS "Student views own cardio assignments" ON assigned_cardios;
CREATE POLICY "Student views own cardio assignments" ON assigned_cardios FOR SELECT USING (auth.uid() = student_id);

-- Cardio Sessions & Logs
DROP POLICY IF EXISTS "Students see own cardio sessions" ON cardio_sessions;
CREATE POLICY "Students see own cardio sessions" ON cardio_sessions FOR ALL USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students see own cardio logs" ON cardio_logs;
CREATE POLICY "Students see own cardio logs" ON cardio_logs FOR ALL USING (auth.uid() = student_id);

-- Store Products
DROP POLICY IF EXISTS "Anyone can view active products" ON store_products;
CREATE POLICY "Anyone can view active products" ON store_products FOR SELECT USING (is_active = true);

-- 7. RE-VALIDATION / FIXES
ALTER TABLE load_history 
DROP CONSTRAINT IF EXISTS load_history_workout_log_id_fkey,
ADD CONSTRAINT load_history_workout_log_id_fkey 
FOREIGN KEY (workout_log_id) REFERENCES workout_logs(id) ON DELETE CASCADE;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='workout_logs' AND column_name='perceived_effort') THEN
        ALTER TABLE workout_logs ADD COLUMN perceived_effort integer CHECK (perceived_effort BETWEEN 1 AND 10);
    END IF;
END $$;
