-- MASTER ACCESSIBILITY FOR PUBLIC PROFILES (FINAL VERSION)
-- This migration ensures that ALL tables involved in calculating adherence and metrics
-- are accessible to anonymous guests IF the student has opted in via allow_public_feed.

-- Ensure RLS is enabled on all tables
ALTER TABLE public.assigned_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assigned_cardios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assigned_diets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bf_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cardio_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tracking ENABLE ROW LEVEL SECURITY;

-- 1. Profiles (Metadata baseline)
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);

-- 2. Student Details
DROP POLICY IF EXISTS "Anyone can view public student details" ON public.student_details;
CREATE POLICY "Anyone can view public student details" ON public.student_details 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = student_details.id AND (allow_public_feed = true OR public_profile_enabled = true))
);

-- 3. Assignments
DROP POLICY IF EXISTS "Anyone can view public student workouts" ON public.assigned_workouts;
CREATE POLICY "Anyone can view public student workouts" ON public.assigned_workouts 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = assigned_workouts.student_id AND (allow_public_feed = true OR public_profile_enabled = true))
);

DROP POLICY IF EXISTS "Anyone can view public student cardios" ON public.assigned_cardios;
CREATE POLICY "Anyone can view public student cardios" ON public.assigned_cardios 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = assigned_cardios.student_id AND (allow_public_feed = true OR public_profile_enabled = true))
);

DROP POLICY IF EXISTS "Anyone can view public student diets" ON public.assigned_diets;
CREATE POLICY "Anyone can view public student diets" ON public.assigned_diets 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = assigned_diets.student_id AND (allow_public_feed = true OR public_profile_enabled = true))
);

-- 4. History (Weight/BF Graph)
DROP POLICY IF EXISTS "Public can view weight of public students" ON public.weight_history;
CREATE POLICY "Public can view weight of public students" ON public.weight_history 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = weight_history.student_id AND (allow_public_feed = true OR public_profile_enabled = true))
);

DROP POLICY IF EXISTS "Public can view metrics of public students" ON public.bf_history;
CREATE POLICY "Public can view metrics of public students" ON public.bf_history 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = bf_history.student_id AND (allow_public_feed = true OR public_profile_enabled = true))
);

-- 5. Logs & Tracking
DROP POLICY IF EXISTS "Public can view tracking of public students" ON public.daily_tracking;
CREATE POLICY "Public can view tracking of public students" ON public.daily_tracking 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = daily_tracking.user_id AND (allow_public_feed = true OR public_profile_enabled = true))
);

DROP POLICY IF EXISTS "Public can view logs of public students" ON public.workout_logs;
CREATE POLICY "Public can view logs of public students" ON public.workout_logs 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = workout_logs.student_id AND (allow_public_feed = true OR public_profile_enabled = true))
);

DROP POLICY IF EXISTS "Public can view logs of public students" ON public.cardio_logs;
CREATE POLICY "Public can view logs of public students" ON public.cardio_logs 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = cardio_logs.student_id AND (allow_public_feed = true OR public_profile_enabled = true))
);

-- 6. Photos (Gallery)
DROP POLICY IF EXISTS "Anyone can view public progress photos" ON public.progress_photos;
CREATE POLICY "Anyone can view public progress photos" ON public.progress_photos 
FOR SELECT USING (
  NOT is_private AND EXISTS (SELECT 1 FROM profiles WHERE id = progress_photos.student_id AND (allow_public_feed = true OR public_profile_enabled = true))
);
