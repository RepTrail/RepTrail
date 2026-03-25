-- RepTrail: Complete Database Baseline Schema
-- This file represents the final, synchronized state of the database.

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Core: Profiles (Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    email text UNIQUE NOT NULL,
    full_name text,
    avatar_url text,
    role text CHECK (role IN ('trainer', 'student')) DEFAULT 'student',
    
    -- Trainer specific fields
    trainer_code text UNIQUE,
    specialty text,
    region text,
    instagram text,
    whatsapp text,
    cref text,
    location text,
    bio text,
    specialties text[], -- Array of specialties
    
    -- Stats & Rankings
    rating numeric(3, 2) DEFAULT 0,
    average_rating numeric(3, 2) DEFAULT 0, -- Kept for compatibility with legacy triggers
    total_reviews integer DEFAULT 0,
    num_active_students integer DEFAULT 0,
    
    -- Status & Subscriptions
    is_admin boolean DEFAULT false,
    is_elite boolean DEFAULT false,
    elite_until timestamp with time zone,
    trial_activated_at timestamp with time zone,
    auto_training_status text DEFAULT 'inactive',
    is_verified boolean DEFAULT false,
    is_billing_exempt boolean DEFAULT false,
    
    -- Affiliate System
    is_affiliate boolean DEFAULT false,
    affiliate_token text UNIQUE,
    affiliate_balance numeric(10, 2) DEFAULT 0,
    
    -- Asaas Integration
    asaas_customer_id text,
    asaas_subscription_id text,
    asaas_billing_type text,
    cpf_cnpj text,
    
    -- Photo Tracking
    monthly_photo_count integer DEFAULT 0,
    last_photo_reset timestamp with time zone DEFAULT now(),
    
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_seen_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_trainer_code ON profiles(trainer_code);
CREATE INDEX IF NOT EXISTS idx_profiles_asaas_customer_id ON profiles(asaas_customer_id);

-- 3. App Configuration
CREATE TABLE IF NOT EXISTS public.app_settings (
    id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    beta_tester_mode boolean DEFAULT false,
    gemini_api_key text,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Admin & Logging
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    admin_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    action text NOT NULL,
    target_id uuid,
    details jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.plan_features (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    plan_tier text NOT NULL,
    feature_key text NOT NULL,
    is_enabled boolean DEFAULT true,
    limit_value integer,
    UNIQUE(plan_tier, feature_key)
);

-- 5. Affiliate System
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

CREATE TABLE IF NOT EXISTS public.affiliate_payouts (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    affiliate_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount numeric(10, 2) NOT NULL,
    status text CHECK (status IN ('pending', 'paid', 'cancelled')) DEFAULT 'pending',
    pix_key text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    affiliate_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    ip_address text,
    user_agent text,
    referrer text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Store
CREATE TABLE IF NOT EXISTS public.store_products (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    category text,
    sub_category text,
    image_url text,
    link_url text,
    official_price numeric(10, 2),
    is_active boolean DEFAULT true,
    rating numeric(3, 2) DEFAULT 0,
    reviews_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.product_clicks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id uuid REFERENCES public.store_products(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    clicked_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Training: Definitions
CREATE TABLE IF NOT EXISTS public.exercises (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    trainer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    video_url text,
    muscle_group text,
    is_system_default boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.workouts (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    trainer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.workout_exercises (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    workout_id uuid REFERENCES public.workouts(id) ON DELETE CASCADE,
    exercise_id uuid REFERENCES public.exercises(id) ON DELETE CASCADE,
    order_index integer NOT NULL,
    working_sets integer DEFAULT 3,
    reps text,
    warmup_reps text,
    feeder_reps text,
    rest_seconds integer DEFAULT 60,
    rpe integer,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Training: Assignments
CREATE TABLE IF NOT EXISTS public.trainer_students (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    trainer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    monthly_fee numeric(10, 2) DEFAULT 0,
    active boolean DEFAULT true,
    billing_source text CHECK (billing_source IN ('marketplace', 'external', 'manual')) DEFAULT 'manual',
    plan_tier text DEFAULT 'on_demand',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(trainer_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.assigned_workouts (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    trainer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    workout_id uuid REFERENCES public.workouts(id) ON DELETE CASCADE,
    day_of_week integer CHECK (day_of_week BETWEEN 0 AND 6),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Tracking: Logs
CREATE TABLE IF NOT EXISTS public.workout_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    workout_id uuid REFERENCES public.workouts(id) ON DELETE SET NULL,
    status text DEFAULT 'completed',
    notes text,
    perceived_effort integer CHECK (perceived_effort BETWEEN 1 AND 10),
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone DEFAULT now() NOT NULL,
    current_state jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Biometrics & Tracking
CREATE TABLE IF NOT EXISTS public.student_details (
    id uuid REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    birth_date date,
    age integer,
    sex text,
    height numeric(5, 2),
    starting_weight numeric(5, 2),
    body_fat numeric(5, 2),
    activity_level text,
    goal text,
    steroid_use boolean DEFAULT false,
    observations text,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.bf_history (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    bf_percentage numeric(5, 2) NOT NULL,
    recorded_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.weight_history (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    weight numeric(5, 2) NOT NULL,
    recorded_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.progress_photos (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    front_url text,
    back_url text,
    side_left_url text,
    side_right_url text,
    weight numeric(5, 2),
    recorded_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.daily_tracking (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    date date DEFAULT CURRENT_DATE NOT NULL,
    workout_status text DEFAULT 'none',
    cardio_status text DEFAULT 'none',
    diet_percentage numeric(5, 2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Community & Reviews
CREATE TABLE IF NOT EXISTS public.trainer_reviews (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    trainer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, trainer_id)
);

-- 12. Systems
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT unique_user_subscription UNIQUE (user_id)
);

-- 13. Functions & Triggers

-- Update Trainer Student Count
CREATE OR REPLACE FUNCTION update_trainer_student_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        UPDATE profiles 
        SET num_active_students = (
            SELECT count(*) FROM trainer_students 
            WHERE trainer_id = NEW.trainer_id AND active = true
        )
        WHERE id = NEW.trainer_id;
    END IF;
    IF (TG_OP = 'DELETE' OR TG_OP = 'UPDATE') THEN
        UPDATE profiles 
        SET num_active_students = (
            SELECT count(*) FROM trainer_students 
            WHERE trainer_id = OLD.trainer_id AND active = true
        )
        WHERE id = OLD.trainer_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_update_trainer_student_count ON trainer_students;
CREATE TRIGGER tr_update_trainer_student_count
AFTER INSERT OR UPDATE OR DELETE ON trainer_students
FOR EACH ROW EXECUTE FUNCTION update_trainer_student_count();

-- Update Trainer Review Stats
CREATE OR REPLACE FUNCTION update_trainer_stats() 
RETURNS trigger AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        UPDATE profiles 
        SET 
            average_rating = (SELECT COALESCE(AVG(rating)::numeric(3,2), 0) FROM trainer_reviews WHERE trainer_id = OLD.trainer_id),
            rating = (SELECT COALESCE(AVG(rating)::numeric(3,2), 0) FROM trainer_reviews WHERE trainer_id = OLD.trainer_id),
            total_reviews = (SELECT COUNT(*) FROM trainer_reviews WHERE trainer_id = OLD.trainer_id)
        WHERE id = OLD.trainer_id;
        RETURN OLD;
    ELSE
        UPDATE profiles 
        SET 
            average_rating = (SELECT COALESCE(AVG(rating)::numeric(3,2), 0) FROM trainer_reviews WHERE trainer_id = NEW.trainer_id),
            rating = (SELECT COALESCE(AVG(rating)::numeric(3,2), 0) FROM trainer_reviews WHERE trainer_id = NEW.trainer_id),
            total_reviews = (SELECT COUNT(*) FROM trainer_reviews WHERE trainer_id = NEW.trainer_id)
        WHERE id = NEW.trainer_id;
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_update_trainer_stats ON trainer_reviews;
CREATE TRIGGER tr_update_trainer_stats
AFTER INSERT OR UPDATE OR DELETE ON trainer_reviews
FOR EACH ROW EXECUTE FUNCTION update_trainer_stats();

-- Ranking RPC
DROP FUNCTION IF EXISTS get_trainer_ranking_stats() CASCADE;
CREATE OR REPLACE FUNCTION get_trainer_ranking_stats()
RETURNS TABLE (
    trainer_id UUID,
    full_name TEXT,
    avatar_url TEXT,
    plan_tier TEXT,
    rating NUMERIC,
    student_count BIGINT,
    trainer_code TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id AS trainer_id,
        TRIM(p.full_name) as full_name,
        p.avatar_url,
        p.plan_tier,
        COALESCE(p.rating, 0)::NUMERIC AS rating,
        COALESCE(p.num_active_students, 0)::BIGINT AS student_count,
        p.trainer_code
    FROM 
        profiles p
    WHERE 
        p.role = 'trainer';
END;
$$;

GRANT EXECUTE ON FUNCTION get_trainer_ranking_stats() TO anon, authenticated;
