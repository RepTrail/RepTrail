-- Update the function to be more inclusive of student status and trim names
DROP FUNCTION IF EXISTS get_trainer_ranking_stats();
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
SECURITY DEFINER -- Runs with elevated privileges to bypass RLS for public ranking
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id AS trainer_id,
        TRIM(p.full_name) as full_name,
        p.avatar_url,
        p.plan_tier,
        COALESCE(p.average_rating, 0)::NUMERIC AS rating,
        (SELECT COUNT(*) FROM trainer_students ts WHERE ts.trainer_id = p.id AND (ts.active IS NOT FALSE)) AS student_count,
        p.trainer_code
    FROM 
        profiles p
    WHERE 
        p.role = 'trainer';
END;
$$;
