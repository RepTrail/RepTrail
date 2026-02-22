
-- Update workout_logs status constraint to include 'in_progress'
ALTER TABLE public.workout_logs 
DROP CONSTRAINT IF EXISTS workout_logs_status_check;

ALTER TABLE public.workout_logs 
ADD CONSTRAINT workout_logs_status_check 
CHECK (status IN ('pending', 'started', 'in_progress', 'completed', 'skipped'));

-- Update cardio_logs status constraint to include 'in_progress'
ALTER TABLE public.cardio_logs 
DROP CONSTRAINT IF EXISTS cardio_logs_status_check;

ALTER TABLE public.cardio_logs 
ADD CONSTRAINT cardio_logs_status_check 
CHECK (status IN ('pending', 'started', 'in_progress', 'completed', 'skipped'));
