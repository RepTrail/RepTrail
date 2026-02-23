-- COMPREHENSIVE PUBLIC RLS
-- This migration ensures ALL necessary data for the public student profile is accessible to guests
-- ONLY for students who have allow_public_feed = true.

-- 1. Profiles (Ensure visibility)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

-- 2. Student Details
DROP POLICY IF EXISTS "Public view student details" ON public.student_details;
DROP POLICY IF EXISTS "Public can view details of public students" ON public.student_details;
DROP POLICY IF EXISTS "Anyone can view public student details" ON public.student_details;
CREATE POLICY "Anyone can view public student details" ON public.student_details 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = student_details.id AND allow_public_feed = true)
);

-- 3. Trainer Students (Trainer context)
DROP POLICY IF EXISTS "Public can view trainer links" ON public.trainer_students;
DROP POLICY IF EXISTS "Anyone can view public trainer student links" ON public.trainer_students;
CREATE POLICY "Anyone can view public trainer student links" ON public.trainer_students 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = trainer_students.student_id AND allow_public_feed = true)
);

-- 4. Assignments (Workout/Cardio lines in Adherence Chart)
DROP POLICY IF EXISTS "Public view assigned workouts" ON public.assigned_workouts;
DROP POLICY IF EXISTS "Public can view assignments of public students" ON public.assigned_workouts;
DROP POLICY IF EXISTS "Anyone can view public student workouts" ON public.assigned_workouts;
CREATE POLICY "Anyone can view public student workouts" ON public.assigned_workouts 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = assigned_workouts.student_id AND allow_public_feed = true)
);

DROP POLICY IF EXISTS "Public view assigned cardios" ON public.assigned_cardios;
DROP POLICY IF EXISTS "Public can view assignments of public students" ON public.assigned_cardios;
DROP POLICY IF EXISTS "Anyone can view public student cardios" ON public.assigned_cardios;
CREATE POLICY "Anyone can view public student cardios" ON public.assigned_cardios 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = assigned_cardios.student_id AND allow_public_feed = true)
);

-- 5. Logs (Frequency and Adherence points)
DROP POLICY IF EXISTS "Public view tracking" ON public.daily_tracking;
DROP POLICY IF EXISTS "Public can view tracking of public students" ON public.daily_tracking;
CREATE POLICY "Public can view tracking of public students" ON public.daily_tracking 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = daily_tracking.user_id AND allow_public_feed = true)
);

DROP POLICY IF EXISTS "Public view workout logs" ON public.workout_logs;
DROP POLICY IF EXISTS "Public can view logs of public students" ON public.workout_logs;
CREATE POLICY "Public can view logs of public students" ON public.workout_logs 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = workout_logs.student_id AND allow_public_feed = true)
);

DROP POLICY IF EXISTS "Public view cardio logs" ON public.cardio_logs;
DROP POLICY IF EXISTS "Public can view logs of public students" ON public.cardio_logs;
CREATE POLICY "Public can view logs of public students" ON public.cardio_logs 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = cardio_logs.student_id AND allow_public_feed = true)
);

-- 6. Metrics (Graph lines)
DROP POLICY IF EXISTS "Public view weight history" ON public.weight_history;
DROP POLICY IF EXISTS "Public can view weight of public students" ON public.weight_history;
CREATE POLICY "Public can view weight of public students" ON public.weight_history 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = weight_history.student_id AND allow_public_feed = true)
);

DROP POLICY IF EXISTS "Public view bf history" ON public.bf_history;
DROP POLICY IF EXISTS "Public can view metrics of public students" ON public.bf_history;
CREATE POLICY "Public can view metrics of public students" ON public.bf_history 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = bf_history.student_id AND allow_public_feed = true)
);
