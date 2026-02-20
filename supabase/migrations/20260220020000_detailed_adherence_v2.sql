
-- Migration: Add workout_percentage and partial status to daily_tracking
-- Date: 2026-02-20

ALTER TABLE public.daily_tracking
ADD COLUMN IF NOT EXISTS workout_percentage numeric(5, 2) DEFAULT 0;

ALTER TABLE public.daily_tracking
ADD COLUMN IF NOT EXISTS ergogenics_percentage numeric(5, 2) DEFAULT 0;

-- Update the check constraint for workout_status
ALTER TABLE public.daily_tracking
DROP CONSTRAINT IF EXISTS daily_tracking_workout_status_check;

ALTER TABLE public.daily_tracking
ADD CONSTRAINT daily_tracking_workout_status_check 
CHECK (workout_status IN ('none', 'assigned', 'completed', 'skipped', 'partial'));

-- Ensure trainers can also view/update tracking for their students
DROP POLICY IF EXISTS "Trainers can view their students tracking" ON public.daily_tracking;
CREATE POLICY "Trainers can view their students tracking" ON public.daily_tracking
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.trainer_students
            WHERE trainer_id = auth.uid() AND student_id = daily_tracking.user_id
        )
    );
