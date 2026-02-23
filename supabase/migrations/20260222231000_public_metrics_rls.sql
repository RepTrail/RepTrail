-- ALLOW PUBLIC ACCESS TO METRICS FOR FEED-ENABLED STUDENTS
-- 1. Profile visibility (already true but confirming)
-- SELECT true is already there.

-- 2. BF History
DROP POLICY IF EXISTS "Public can view metrics of public students" ON public.bf_history;
CREATE POLICY "Public can view metrics of public students" ON public.bf_history 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = bf_history.student_id AND p.allow_public_feed = true)
);

-- 3. Weight History
DROP POLICY IF EXISTS "Public can view weight of public students" ON public.weight_history;
CREATE POLICY "Public can view weight of public students" ON public.weight_history 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = weight_history.student_id AND p.allow_public_feed = true)
);

-- 4. Load History
DROP POLICY IF EXISTS "Public can view loads of public students" ON public.load_history;
CREATE POLICY "Public can view loads of public students" ON public.load_history 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = load_history.student_id AND p.allow_public_feed = true)
);

-- 5. Workout Logs (for Frequency)
DROP POLICY IF EXISTS "Public can view logs of public students" ON public.workout_logs;
CREATE POLICY "Public can view logs of public students" ON public.workout_logs 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = workout_logs.student_id AND p.allow_public_feed = true)
);

-- 6. Adherence related tables
-- daily_tracking
DROP POLICY IF EXISTS "Public can view tracking of public students" ON public.daily_tracking;
CREATE POLICY "Public can view tracking of public students" ON public.daily_tracking 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = daily_tracking.user_id AND p.allow_public_feed = true)
);

-- assigned_workouts, assigned_cardios, assigned_diets, assigned_ergogenics
DROP POLICY IF EXISTS "Public can view assignments of public students" ON public.assigned_workouts;
CREATE POLICY "Public can view assignments of public students" ON public.assigned_workouts 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = assigned_workouts.student_id AND p.allow_public_feed = true)
);

DROP POLICY IF EXISTS "Public can view assignments of public students" ON public.assigned_cardios;
CREATE POLICY "Public can view assignments of public students" ON public.assigned_cardios 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = assigned_cardios.student_id AND p.allow_public_feed = true)
);

DROP POLICY IF EXISTS "Public can view assignments of public students" ON public.assigned_diets;
CREATE POLICY "Public can view assignments of public students" ON public.assigned_diets 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = assigned_diets.student_id AND p.allow_public_feed = true)
);

DROP POLICY IF EXISTS "Public can view assignments of public students" ON public.ergogenics;
CREATE POLICY "Public can view assignments of public students" ON public.ergogenics 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = ergogenics.student_id AND p.allow_public_feed = true)
);

-- student_details (for steroid use flag)
DROP POLICY IF EXISTS "Public can view details of public students" ON public.student_details;
CREATE POLICY "Public can view details of public students" ON public.student_details 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = student_details.id AND p.allow_public_feed = true)
);
