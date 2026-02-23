
-- 1. FIX SCHEMA: Add missing created_at to assignment tables
ALTER TABLE public.assigned_workouts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.assigned_diets ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 2. ENSURE days_of_week IS PRESENT (Backup)
ALTER TABLE public.assigned_diets ADD COLUMN IF NOT EXISTS days_of_week integer[] DEFAULT '{0,1,2,3,4,5,6}';

-- 3. RE-SYNC EXISTING DATA
UPDATE public.assigned_diets SET days_of_week = '{0,1,2,3,4,5,6}' WHERE days_of_week IS NULL;

-- 4. ROBUST RLS FOR assigned_diets
-- First, drop all existing policies to avoid conflicts or duplicates
DROP POLICY IF EXISTS "Students can self-assign diets" ON public.assigned_diets;
DROP POLICY IF EXISTS "Trainer manages diet assignments" ON public.assigned_diets;
DROP POLICY IF EXISTS "Public can view assignments of public students" ON public.assigned_diets;
DROP POLICY IF EXISTS "Trainer view assigned diets" ON public.assigned_diets;
DROP POLICY IF EXISTS "Students can view their own assigned diets" ON public.assigned_diets;
DROP POLICY IF EXISTS "Students can insert assigned diets for themselves" ON public.assigned_diets;

-- Student/Trainer Policy: Full Access (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Manage assignments for assigned_diets" ON public.assigned_diets
FOR ALL TO authenticated
USING (
  student_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM trainer_students ts
    WHERE ts.trainer_id = auth.uid() 
    AND ts.student_id = assigned_diets.student_id
    AND ts.active = true
  )
)
WITH CHECK (
  student_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM trainer_students ts
    WHERE ts.trainer_id = auth.uid() 
    AND ts.student_id = assigned_diets.student_id
    AND ts.active = true
  )
);

-- Public Policy: View only
CREATE POLICY "Public view assigned_diets" ON public.assigned_diets
FOR SELECT TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = assigned_diets.student_id
    AND p.allow_public_feed = true
  )
);

-- 5. RE-VALIDATE FUNCTION calculate_daily_diet_percentage
-- Ensuring it works now that created_at exists
CREATE OR REPLACE FUNCTION public.calculate_daily_diet_percentage(target_student_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    today_dow INTEGER;
    current_diet_id UUID;
    total_items INTEGER;
    logged_items INTEGER;
    today_str DATE;
BEGIN
    -- 1. Get today's day of week in Brazil (0-6)
    today_dow := EXTRACT(DOW FROM (timezone('America/Sao_Paulo', now())))::INTEGER;
    today_str := (timezone('America/Sao_Paulo', now()))::DATE;

    -- 2. Find THE active diet assignment for today
    SELECT diet_id INTO current_diet_id
    FROM public.assigned_diets
    WHERE student_id = target_student_id
      AND active = true
      AND (days_of_week @> ARRAY[today_dow]::integer[] OR days_of_week IS NULL)
    ORDER BY created_at DESC
    LIMIT 1;

    IF current_diet_id IS NULL THEN
        RETURN 0;
    END IF;

    -- 3. Calculate total meal items in this diet
    SELECT COUNT(*) INTO total_items
    FROM public.meal_items mi
    JOIN public.meals m ON m.id = mi.meal_id
    WHERE m.diet_id = current_diet_id;

    IF total_items = 0 THEN
        RETURN 0;
    END IF;

    -- 4. Calculate logged items for today
    SELECT COUNT(*) INTO logged_items
    FROM public.meal_logs
    WHERE student_id = target_student_id
      AND meal_id IN (SELECT id FROM public.meals WHERE diet_id = current_diet_id)
      AND consumed_at::DATE = today_str;

    -- 5. Return percentage
    RETURN ROUND((logged_items::NUMERIC / total_items::NUMERIC) * 100, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
