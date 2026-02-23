-- RE-FIXING MASTER RLS WITH DIRECT SUBQUERIES (Avoid function overhead/issues)
-- Using direct EXISTS subqueries for all tables

-- 1. Metrics
DROP POLICY IF EXISTS "Public can view metrics" ON public.bf_history;
CREATE POLICY "Public can view metrics" ON public.bf_history 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = bf_history.student_id AND p.allow_public_feed = true)
);

DROP POLICY IF EXISTS "Public can view weight" ON public.weight_history;
CREATE POLICY "Public can view weight" ON public.weight_history 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = weight_history.student_id AND p.allow_public_feed = true)
);

-- 2. Assignments
DROP POLICY IF EXISTS "Public can view assignments" ON public.assigned_workouts;
CREATE POLICY "Public can view assignments" ON public.assigned_workouts 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = assigned_workouts.student_id AND p.allow_public_feed = true)
);

DROP POLICY IF EXISTS "Public can view assignments" ON public.assigned_cardios;
CREATE POLICY "Public can view assignments" ON public.assigned_cardios 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = assigned_cardios.student_id AND p.allow_public_feed = true)
);

DROP POLICY IF EXISTS "Public can view assignments" ON public.assigned_diets;
CREATE POLICY "Public can view assignments" ON public.assigned_diets 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = assigned_diets.student_id AND p.allow_public_feed = true)
);

DROP POLICY IF EXISTS "Public can view assignments" ON public.ergogenics;
CREATE POLICY "Public can view assignments" ON public.ergogenics 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = ergogenics.student_id AND p.allow_public_feed = true)
);

-- 3. Logs
DROP POLICY IF EXISTS "Public can view logs" ON public.workout_logs;
CREATE POLICY "Public can view logs" ON public.workout_logs 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = workout_logs.student_id AND p.allow_public_feed = true)
);

DROP POLICY IF EXISTS "Public can view logs" ON public.cardio_logs;
CREATE POLICY "Public can view logs" ON public.cardio_logs 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = cardio_logs.student_id AND p.allow_public_feed = true)
);

DROP POLICY IF EXISTS "Public can view logs" ON public.ergogenic_logs;
CREATE POLICY "Public can view logs" ON public.ergogenic_logs 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = ergogenic_logs.student_id AND p.allow_public_feed = true)
);

DROP POLICY IF EXISTS "Public can view logs" ON public.meal_item_logs;
CREATE POLICY "Public can view logs" ON public.meal_item_logs 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = meal_item_logs.user_id AND p.allow_public_feed = true)
);

DROP POLICY IF EXISTS "Public can view logs" ON public.daily_tracking;
CREATE POLICY "Public can view logs" ON public.daily_tracking 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = daily_tracking.user_id AND p.allow_public_feed = true)
);

-- 4. Infrastructure
-- These are generic definitions, allow public view since they are shared by system/trainers
DROP POLICY IF EXISTS "Public view generic workouts" ON public.workouts;
CREATE POLICY "Public view generic workouts" ON public.workouts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public view generic exercises" ON public.exercises;
CREATE POLICY "Public view generic exercises" ON public.exercises FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public view generic diets" ON public.diets;
CREATE POLICY "Public view generic diets" ON public.diets FOR SELECT USING (true);
