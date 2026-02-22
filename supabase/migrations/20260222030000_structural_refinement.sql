-- Migration to fix user deletion and clean up plan-related fields

-- 1. Fix Foreign Key Constraints for User Deletion
ALTER TABLE admin_logs 
DROP CONSTRAINT IF EXISTS admin_logs_admin_id_fkey,
ADD CONSTRAINT admin_logs_admin_id_fkey 
FOREIGN KEY (admin_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE search_logs 
DROP CONSTRAINT IF EXISTS search_logs_user_id_fkey,
ADD CONSTRAINT search_logs_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 2. Clean up Plan related fields/constraints if needed
-- The user wants to remove plans. We'll simplify the plan_tier but keep the column for now to avoid breaking too much.
-- We'll just remove the restrictive check constraint.

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_plan_tier_check;
ALTER TABLE trainer_students DROP CONSTRAINT IF EXISTS trainer_students_plan_tier_check;

-- 3. Add monthly_photo_count and last_photo_reset to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS monthly_photo_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_photo_reset timestamp with time zone DEFAULT now();

-- 4. Anamnesis / Initial Profile Data (Issue 8)
-- Already have student_details, let's ensure it has all fields
ALTER TABLE student_details 
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS sex text CHECK (sex IN ('male', 'female', 'other')),
ADD COLUMN IF NOT EXISTS height numeric(5, 2); -- cm (added in schema but good to ensure)

-- 5. Store / Categories (Issue 10)
ALTER TABLE store_products 
ADD COLUMN IF NOT EXISTS sub_category text;

-- 6. Add num_active_students to profiles for fast sorting
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS num_active_students integer DEFAULT 0;

-- 7. Trigger to update num_active_students
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

-- 8. Initialize counts for existing trainers
UPDATE profiles p
SET num_active_students = (
    SELECT count(*) 
    FROM trainer_students ts 
    WHERE ts.trainer_id = p.id AND ts.active = true
)
WHERE p.role = 'trainer';

-- 9. Update Ranking RPC to remove plan bias
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
        COALESCE(p.average_rating, 0)::NUMERIC AS rating,
        p.num_active_students::BIGINT AS student_count,
        p.trainer_code
    FROM 
        profiles p
    WHERE 
        p.role = 'trainer';
END;
$$;

-- 10. BF History Table
CREATE TABLE IF NOT EXISTS bf_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    bf_percentage NUMERIC(5, 2) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Ensure bf column exists on student_details
ALTER TABLE student_details 
ADD COLUMN IF NOT EXISTS body_fat numeric(5, 2);
