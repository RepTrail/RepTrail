-- RepTrail: Final Database Cleanup Migration
-- Drops unused V2 experiment tables, legacy PDF engine tables, and redundant Stripe columns.

-- 1. Drop Unused V2 Tables
DROP TABLE IF EXISTS v2_meal_items CASCADE;
DROP TABLE IF EXISTS v2_meals CASCADE;
DROP TABLE IF EXISTS v2_diet_plans CASCADE;
DROP TABLE IF EXISTS v2_personal_records CASCADE;
DROP TABLE IF EXISTS v2_user_stats CASCADE;
DROP TABLE IF EXISTS v2_exercise_series CASCADE;
DROP TABLE IF EXISTS v2_exercise_blocks CASCADE;
DROP TABLE IF EXISTS v2_workouts CASCADE;
DROP TABLE IF EXISTS v2_profiles CASCADE;

-- Unused Tables (0 references in code)
DROP TABLE IF EXISTS affiliate_links CASCADE;
DROP TABLE IF EXISTS cardio_sessions CASCADE;
DROP TABLE IF EXISTS invites CASCADE;
DROP TABLE IF EXISTS product_click_logs CASCADE;
DROP TABLE IF EXISTS search_logs CASCADE;

-- 2. Drop Legacy PDF Engine Tables
DROP TABLE IF EXISTS parsed_structures CASCADE;
DROP TABLE IF EXISTS pdf_uploads CASCADE;

-- 3. Remove Redundant Stripe Columns from profiles
ALTER TABLE profiles 
DROP COLUMN IF EXISTS stripe_account_id,
DROP COLUMN IF EXISTS stripe_customer_id,
DROP COLUMN IF EXISTS stripe_subscription_id,
DROP COLUMN IF EXISTS stripe_cancel_at_period_end,
DROP COLUMN IF EXISTS stripe_current_period_end;

-- 4. Remove Redundant Stripe Column from app_settings
ALTER TABLE app_settings 
DROP COLUMN IF EXISTS stripe_secret_key;

-- 5. Add/Sincronize missing columns and tables to ensure schema consistency
-- Ensure is_admin exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Ensure Asaas columns exist (if not already there)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS asaas_customer_id text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS asaas_subscription_id text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS asaas_billing_type text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cpf_cnpj text;

-- Create missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_asaas_customer_id ON profiles(asaas_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
-- Ensure profiles has num_active_students and rating (required for ranking)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS num_active_students integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rating numeric(3, 2) DEFAULT 0;

-- 5. Fix/Recreate Ranking RPC (Removing legacy V2 dependencies)
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
