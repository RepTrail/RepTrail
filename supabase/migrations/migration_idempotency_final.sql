-- RepTrail: Idempotency & Strong Consistency Migration
-- Phase 5: Server Idempotency

-- Add columns and constraints to workouts
ALTER TABLE public.workouts ADD COLUMN IF NOT EXISTS client_mutation_id TEXT;
ALTER TABLE public.workouts ADD COLUMN IF NOT EXISTS client_id UUID;
ALTER TABLE public.workouts DROP CONSTRAINT IF EXISTS workouts_client_mutation_id_unique;
ALTER TABLE public.workouts ADD CONSTRAINT workouts_client_mutation_id_unique UNIQUE (client_mutation_id);

-- Add columns and constraints to workout_exercises
ALTER TABLE public.workout_exercises ADD COLUMN IF NOT EXISTS client_mutation_id TEXT;
ALTER TABLE public.workout_exercises ADD COLUMN IF NOT EXISTS client_id UUID;
ALTER TABLE public.workout_exercises DROP CONSTRAINT IF EXISTS workout_exercises_client_mutation_id_unique;
ALTER TABLE public.workout_exercises ADD CONSTRAINT workout_exercises_client_mutation_id_unique UNIQUE (client_mutation_id);

-- Add columns and constraints to exercises
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS client_mutation_id TEXT;
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS client_id UUID;
ALTER TABLE public.exercises DROP CONSTRAINT IF EXISTS exercises_client_mutation_id_unique;
ALTER TABLE public.exercises ADD CONSTRAINT exercises_client_mutation_id_unique UNIQUE (client_mutation_id);

-- Add columns and constraints to student_details
ALTER TABLE public.student_details ADD COLUMN IF NOT EXISTS client_mutation_id TEXT;
ALTER TABLE public.student_details ADD COLUMN IF NOT EXISTS client_id UUID;
ALTER TABLE public.student_details DROP CONSTRAINT IF EXISTS student_details_client_mutation_id_unique;
ALTER TABLE public.student_details ADD CONSTRAINT student_details_client_mutation_id_unique UNIQUE (client_mutation_id);

-- Add columns and constraints to workout_logs
ALTER TABLE public.workout_logs ADD COLUMN IF NOT EXISTS client_mutation_id TEXT;
ALTER TABLE public.workout_logs ADD COLUMN IF NOT EXISTS client_id UUID;
ALTER TABLE public.workout_logs DROP CONSTRAINT IF EXISTS workout_logs_client_mutation_id_unique;
ALTER TABLE public.workout_logs ADD CONSTRAINT workout_logs_client_mutation_id_unique UNIQUE (client_mutation_id);

-- Add columns and constraints to progress_photos
ALTER TABLE public.progress_photos ADD COLUMN IF NOT EXISTS client_mutation_id TEXT;
ALTER TABLE public.progress_photos ADD COLUMN IF NOT EXISTS client_id UUID;
ALTER TABLE public.progress_photos DROP CONSTRAINT IF EXISTS progress_photos_client_mutation_id_unique;
ALTER TABLE public.progress_photos ADD CONSTRAINT progress_photos_client_mutation_id_unique UNIQUE (client_mutation_id);

-- Add columns and constraints to daily_tracking
ALTER TABLE public.daily_tracking ADD COLUMN IF NOT EXISTS client_mutation_id TEXT;
ALTER TABLE public.daily_tracking ADD COLUMN IF NOT EXISTS client_id UUID;
ALTER TABLE public.daily_tracking DROP CONSTRAINT IF EXISTS daily_tracking_client_mutation_id_unique;
ALTER TABLE public.daily_tracking ADD CONSTRAINT daily_tracking_client_mutation_id_unique UNIQUE (client_mutation_id);
