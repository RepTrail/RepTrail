-- RPC for fetching all data for a trainer's public profile in one go, bypassing RLS.
DROP FUNCTION IF EXISTS get_trainer_public_profile(trainer_slug TEXT);
CREATE OR REPLACE FUNCTION get_trainer_public_profile(trainer_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    trainer_row RECORD;
    student_ids UUID[];
    reviews_json JSONB;
    photos_json JSONB;
    final_output JSONB;
BEGIN
    -- 1. Get Trainer Profile
    SELECT * INTO trainer_row
    FROM profiles
    WHERE role = 'trainer' AND (trainer_code = trainer_slug OR trainer_code = UPPER(trainer_slug));

    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    -- 2. Get Reviews
    SELECT jsonb_agg(r) INTO reviews_json
    FROM (
        SELECT 
            tr.id,
            tr.rating,
            tr.comment,
            tr.created_at,
            jsonb_build_object(
                'full_name', sp.full_name,
                'avatar_url', sp.avatar_url
            ) as student
        FROM trainer_reviews tr
        JOIN profiles sp ON sp.id = tr.student_id
        WHERE tr.trainer_id = trainer_row.id
        ORDER BY tr.rating DESC, tr.created_at DESC
        LIMIT 10
    ) r;

    -- 3. Get Student IDs for photos
    SELECT array_agg(student_id) INTO student_ids
    FROM trainer_students
    WHERE trainer_id = trainer_row.id AND (active IS NOT FALSE);

    -- 4. Get Photos (only non-private and authorized)
    -- We filter for students who have at least 2 photos
    SELECT jsonb_agg(ph) INTO photos_json
    FROM (
        SELECT 
            pp.id,
            pp.student_id,
            pp.front_url,
            pp.back_url,
            pp.side_right_url,
            pp.side_left_url,
            pp.created_at,
            sp.full_name as student_name
        FROM progress_photos pp
        JOIN profiles sp ON sp.id = pp.student_id
        WHERE pp.student_id = ANY(student_ids)
          AND pp.is_private = false
          AND (sp.allow_image_disclosure IS NOT FALSE)
        ORDER BY pp.created_at ASC
    ) ph;

    -- 5. Build final object
    final_output := jsonb_build_object(
        'trainer', to_jsonb(trainer_row),
        'reviews', COALESCE(reviews_json, '[]'::jsonb),
        'photos', COALESCE(photos_json, '[]'::jsonb)
    );

    RETURN final_output;
END;
$$;
