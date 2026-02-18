-- Create a function to get trainer ranking stats
-- This function calculates the number of active students for each trainer
-- and returns it along with other profile info for ranking.

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
        p.full_name,
        p.avatar_url,
        p.plan_tier,
        COALESCE(p.average_rating, 0)::NUMERIC AS rating,
        (SELECT COUNT(*) FROM trainer_students ts WHERE ts.trainer_id = p.id AND ts.active = true) AS student_count,
        p.trainer_code
    FROM 
        profiles p
    WHERE 
        p.role = 'trainer';
END;
$$;
