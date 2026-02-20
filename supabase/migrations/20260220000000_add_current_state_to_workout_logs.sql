
-- 1. Add last_seen_at to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_seen_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- 2. Update status constraints for workouts and cardios to include 'started'
-- Workout logs: 'pending', 'started', 'completed', 'skipped'
ALTER TABLE public.workout_logs 
DROP CONSTRAINT IF EXISTS workout_logs_status_check;

ALTER TABLE public.workout_logs 
ADD CONSTRAINT workout_logs_status_check 
CHECK (status IN ('pending', 'started', 'completed', 'skipped'));

-- Cardio logs: 'pending', 'started', 'completed', 'skipped'
ALTER TABLE public.cardio_logs 
DROP CONSTRAINT IF EXISTS cardio_logs_status_check;

ALTER TABLE public.cardio_logs 
ADD CONSTRAINT cardio_logs_status_check 
CHECK (status IN ('pending', 'started', 'completed', 'skipped'));

-- 3. Add adherence_status to workout_logs
-- 'success', 'partial', 'fail'
ALTER TABLE public.workout_logs 
ADD COLUMN IF NOT EXISTS adherence_status text CHECK (adherence_status IN ('success', 'partial', 'fail')) DEFAULT 'success';

-- 4. Add started_at column to cardio_logs if not already there (it was in the select, let's ensure)
ALTER TABLE public.cardio_logs
ADD COLUMN IF NOT EXISTS started_at timestamp with time zone;

-- 5. Add notes to workout_logs (for general workout session notes)
ALTER TABLE public.workout_logs
ADD COLUMN IF NOT EXISTS notes text;

-- 6. Ensure load_history has notes (migration says yes, but for safety)
ALTER TABLE public.load_history
ADD COLUMN IF NOT EXISTS notes text;
