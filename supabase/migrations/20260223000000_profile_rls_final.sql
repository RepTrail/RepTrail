-- MASTER PUBLIC RLS FOR STUDENT PROFILES
-- Ensure any guest can view data for students who have allow_public_feed = true

-- Helper function to check if a student has public feed enabled (more efficient for multiple policies)
CREATE OR REPLACE FUNCTION public.is_public_student(target_student_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = target_student_id AND allow_public_feed = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Metrics
DROP POLICY IF EXISTS "Public can view metrics" ON public.bf_history;
CREATE POLICY "Public can view metrics" ON public.bf_history FOR SELECT USING (public.is_public_student(student_id));

DROP POLICY IF EXISTS "Public can view weight" ON public.weight_history;
CREATE POLICY "Public can view weight" ON public.weight_history FOR SELECT USING (public.is_public_student(student_id));

-- 2. Assignments
DROP POLICY IF EXISTS "Public can view assignments" ON public.assigned_workouts;
CREATE POLICY "Public can view assignments" ON public.assigned_workouts FOR SELECT USING (public.is_public_student(student_id));

DROP POLICY IF EXISTS "Public can view assignments" ON public.assigned_cardios;
CREATE POLICY "Public can view assignments" ON public.assigned_cardios FOR SELECT USING (public.is_public_student(student_id));

DROP POLICY IF EXISTS "Public can view assignments" ON public.assigned_diets;
CREATE POLICY "Public can view assignments" ON public.assigned_diets FOR SELECT USING (public.is_public_student(student_id));

DROP POLICY IF EXISTS "Public can view assignments" ON public.ergogenics;
CREATE POLICY "Public can view assignments" ON public.ergogenics FOR SELECT USING (public.is_public_student(student_id));

-- 3. Logs
DROP POLICY IF EXISTS "Public can view logs" ON public.workout_logs;
CREATE POLICY "Public can view logs" ON public.workout_logs FOR SELECT USING (public.is_public_student(student_id));

DROP POLICY IF EXISTS "Public can view logs" ON public.cardio_logs;
CREATE POLICY "Public can view logs" ON public.cardio_logs FOR SELECT USING (public.is_public_student(student_id));

DROP POLICY IF EXISTS "Public can view logs" ON public.ergogenic_logs;
CREATE POLICY "Public can view logs" ON public.ergogenic_logs FOR SELECT USING (public.is_public_student(student_id));

DROP POLICY IF EXISTS "Public can view logs" ON public.meal_item_logs;
CREATE POLICY "Public can view logs" ON public.meal_item_logs FOR SELECT USING (public.is_public_student(user_id));

DROP POLICY IF EXISTS "Public can view logs" ON public.daily_tracking;
CREATE POLICY "Public can view logs" ON public.daily_tracking FOR SELECT USING (public.is_public_student(user_id));

-- 4. Infrastructure (Workouts descriptions, exercise names etc)
-- Since these tables are generic library tables, we can allow public select to everyone
-- Usually they have policies already, but making sure they don't block.
DROP POLICY IF EXISTS "Public can view workout definitions" ON public.workouts;
CREATE POLICY "Public can view workout definitions" ON public.workouts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view exercise definitions" ON public.exercises;
CREATE POLICY "Public can view exercise definitions" ON public.exercises FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view diet definitions" ON public.diets;
CREATE POLICY "Public can view diet definitions" ON public.diets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view student details" ON public.student_details;
CREATE POLICY "Public can view student details" ON public.student_details FOR SELECT USING (true);
