-- Migration to allow multiple diets with day-specific assignments
-- Version: 20260224101000

-- 1. Add days_of_week to assigned_diets
ALTER TABLE public.assigned_diets 
ADD COLUMN IF NOT EXISTS days_of_week integer[] DEFAULT '{0,1,2,3,4,5,6}';

-- 2. Update existing active diets to have all days if they are currently null or empty
UPDATE public.assigned_diets 
SET days_of_week = '{0,1,2,3,4,5,6}' 
WHERE active = true AND (days_of_week IS NULL OR days_of_week = '{}');

-- 3. Update the diet percentage calculation function to be day-aware
CREATE OR REPLACE FUNCTION public.calculate_daily_diet_percentage(p_user_id uuid, p_date date)
RETURNS numeric AS $$
DECLARE
    v_total_items integer;
    v_completed_items integer;
    v_diet_id uuid;
    v_dow integer;
BEGIN
    -- Extract day of week (0-6, Sunday is 0)
    v_dow := extract(dow from p_date);

    -- Get active diet for user on this specific day
    SELECT diet_id INTO v_diet_id
    FROM public.assigned_diets
    WHERE student_id = p_user_id 
    AND active = true 
    AND v_dow = ANY(days_of_week)
    ORDER BY created_at DESC -- Takes the most recently assigned if conflict exists
    LIMIT 1;

    IF v_diet_id IS NULL THEN
        RETURN 0;
    END IF;

    -- Count total items in the diet (sum of items in all meals)
    SELECT count(mi.id) INTO v_total_items
    FROM public.meals m
    JOIN public.meal_items mi ON mi.meal_id = m.id
    WHERE m.diet_id = v_diet_id;

    IF v_total_items = 0 THEN
        RETURN 100;
    END IF;

    -- Count completed items for that date
    SELECT count(*) INTO v_completed_items
    FROM public.meal_item_logs mil
    WHERE mil.user_id = p_user_id 
    AND mil.date = p_date
    AND mil.meal_item_id IN (
        SELECT mi.id 
        FROM public.meals m
        JOIN public.meal_items mi ON mi.meal_id = m.id
        WHERE m.diet_id = v_diet_id
    );

    RETURN ROUND((v_completed_items::numeric / v_total_items::numeric) * 100, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
