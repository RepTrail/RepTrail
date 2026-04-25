-- GHOST_PROFILES_MIGRATION.sql
-- Phase 1: Unify Placeholders into Profiles

BEGIN;

-- 1. Remove hard foreign key from profiles to auth.users
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. Add auth_user_id column to profiles (optional link to real auth)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS auth_user_id uuid REFERENCES auth.users(id) UNIQUE;
UPDATE public.profiles SET auth_user_id = id;

-- 3. Update all Foreign Keys to profiles(id) to support ON UPDATE CASCADE
-- This allows us to rename a profile ID and have all data follow.

-- assigned_workouts
ALTER TABLE public.assigned_workouts DROP CONSTRAINT IF EXISTS assigned_workouts_student_id_fkey;
ALTER TABLE public.assigned_workouts ADD CONSTRAINT assigned_workouts_student_id_fkey 
    FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- assigned_diets
ALTER TABLE public.assigned_diets DROP CONSTRAINT IF EXISTS assigned_diets_student_id_fkey;
ALTER TABLE public.assigned_diets ADD CONSTRAINT assigned_diets_student_id_fkey 
    FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- trainer_students
ALTER TABLE public.trainer_students DROP CONSTRAINT IF EXISTS trainer_students_student_id_fkey;
ALTER TABLE public.trainer_students ADD CONSTRAINT trainer_students_student_id_fkey 
    FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- workout_logs
ALTER TABLE public.workout_logs DROP CONSTRAINT IF EXISTS workout_logs_student_id_fkey;
ALTER TABLE public.workout_logs ADD CONSTRAINT workout_logs_student_id_fkey 
    FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- student_details
ALTER TABLE public.student_details DROP CONSTRAINT IF EXISTS student_details_id_fkey;
ALTER TABLE public.student_details ADD CONSTRAINT student_details_id_fkey 
    FOREIGN KEY (id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- progress_photos
ALTER TABLE public.progress_photos DROP CONSTRAINT IF EXISTS progress_photos_student_id_fkey;
ALTER TABLE public.progress_photos ADD CONSTRAINT progress_photos_student_id_fkey 
    FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- weight_history
ALTER TABLE public.weight_history DROP CONSTRAINT IF EXISTS weight_history_student_id_fkey;
ALTER TABLE public.weight_history ADD CONSTRAINT weight_history_student_id_fkey 
    FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- bf_history
ALTER TABLE public.bf_history DROP CONSTRAINT IF EXISTS bf_history_student_id_fkey;
ALTER TABLE public.bf_history ADD CONSTRAINT bf_history_student_id_fkey 
    FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- daily_tracking
ALTER TABLE public.daily_tracking DROP CONSTRAINT IF EXISTS daily_tracking_user_id_fkey;
ALTER TABLE public.daily_tracking ADD CONSTRAINT daily_tracking_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- assigned_cardios (if exists)
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'assigned_cardios') THEN
        ALTER TABLE public.assigned_cardios DROP CONSTRAINT IF EXISTS assigned_cardios_student_id_fkey;
        ALTER TABLE public.assigned_cardios ADD CONSTRAINT assigned_cardios_student_id_fkey 
            FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;

-- cardio_logs (if exists)
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'cardio_logs') THEN
        ALTER TABLE public.cardio_logs DROP CONSTRAINT IF EXISTS cardio_logs_student_id_fkey;
        ALTER TABLE public.cardio_logs ADD CONSTRAINT cardio_logs_student_id_fkey 
            FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;

-- 4. Add flag to identify placeholders
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_placeholder boolean DEFAULT false;

-- 5. Create Merge Function for new Signups
CREATE OR REPLACE FUNCTION public.handle_new_user_merge()
RETURNS trigger AS $$
DECLARE
    v_placeholder_id UUID;
BEGIN
    -- Check if a placeholder with this email exists
    SELECT id INTO v_placeholder_id 
    FROM public.profiles 
    WHERE email = NEW.email AND is_placeholder = true
    LIMIT 1;

    IF v_placeholder_id IS NOT NULL THEN
        -- THE MAGIC: Update the placeholder ID to match the new Auth ID
        -- This will CASCADE to all linked tables!
        UPDATE public.profiles 
        SET id = NEW.id, 
            auth_user_id = NEW.id,
            is_placeholder = false,
            updated_at = NOW()
        WHERE id = v_placeholder_id;
        
        RETURN NEW;
    END IF;

    -- If no placeholder, just create a normal profile via existing trigger or manually
    -- (Assuming there is an existing handle_new_user trigger, this one should run BEFORE it)
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Attach Trigger
DROP TRIGGER IF EXISTS tr_merge_on_signup ON auth.users;
CREATE TRIGGER tr_merge_on_signup
    BEFORE INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_merge();

COMMIT;
