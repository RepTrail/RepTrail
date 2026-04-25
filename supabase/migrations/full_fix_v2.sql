-- # REPTRAIL V2.1 - CRITICAL PERMISSION & LOGIC FIX
-- Run this in your Supabase SQL Editor

-- 0. SCHEMA UPDATES (Missing columns check)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS elite_until TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_activated_at TIMESTAMPTZ;

-- 1. Ensure RLS Policies for Profiles
-- If RLS is enabled but no policy exists, authenticated users can't see their own data.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles 
FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles 
FOR UPDATE USING (auth.uid() = id);

-- Public profiles (for trainer profiles)
DROP POLICY IF EXISTS "Trainer profiles are publicly viewable" ON profiles;
CREATE POLICY "Trainer profiles are publicly viewable" ON profiles 
FOR SELECT USING (role = 'trainer');

-- 2. Ensure RLS for student_details
ALTER TABLE student_details ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Students can manage their own details" ON student_details;
CREATE POLICY "Students can manage their own details" ON student_details 
FOR ALL USING (auth.uid() = id);

-- 3. Re-create Ranking RPC with explicit type casting and better error handling
DROP FUNCTION IF EXISTS get_trainer_ranking_stats();

CREATE OR REPLACE FUNCTION get_trainer_ranking_stats()
RETURNS TABLE (
    trainer_id UUID,
    full_name TEXT,
    avatar_url TEXT,
    plan_tier TEXT,
    rating NUMERIC,
    student_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public -- Secure the path
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id AS trainer_id,
        p.full_name,
        p.avatar_url,
        p.plan_tier,
        COALESCE(p.average_rating, 0)::NUMERIC AS rating,
        (SELECT COUNT(*) FROM trainer_students ts WHERE ts.trainer_id = p.id AND ts.active = true) AS student_count
    FROM 
        profiles p
    WHERE 
        p.role = 'trainer';
END;
$$;
