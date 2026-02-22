
-- Fix RLS error when trainers perform actions that trigger daily_tracking updates
-- (e.g., deleting or modifying diets that have logs)

-- 1. Make the trigger function SECURITY DEFINER to bypass RLS during automated calculations
CREATE OR REPLACE FUNCTION public.update_diet_tracking_trigger()
RETURNS trigger AS $$
DECLARE
    v_date date;
    v_user_id uuid;
    v_percentage numeric;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_date := old.date;
        v_user_id := old.user_id;
    ELSE
        v_date := new.date;
        v_user_id := new.user_id;
    END IF;

    -- Calculate new percentage
    v_percentage := public.calculate_daily_diet_percentage(v_user_id, v_date);

    -- Upsert into daily_tracking
    -- Since this function is now SECURITY DEFINER and runs with system privileges,
    -- it can insert/update rows even if the current user (e.g., a Trainer) doesn't have direct RLS permissions.
    INSERT INTO public.daily_tracking (user_id, date, diet_percentage)
    VALUES (v_user_id, v_date, v_percentage)
    ON CONFLICT (user_id, date) 
    DO UPDATE SET 
        diet_percentage = EXCLUDED.diet_percentage,
        updated_at = now();

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Enhance Daily Tracking RLS policies to allow Trainers to insert/update for their students
-- This is a secondary layer of protection to ensure standard upserts from code also work if needed.

DROP POLICY IF EXISTS "Trainer can manage student tracking" ON public.daily_tracking;
CREATE POLICY "Trainer can manage student tracking" ON public.daily_tracking
    FOR ALL
    USING (check_is_trainer_of_student(user_id))
    WITH CHECK (check_is_trainer_of_student(user_id));

-- Ensure the helper function is properly available (it should be from 20260220101500)
-- But we'll make sure it handles all cases.
