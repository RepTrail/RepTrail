-- Fix: Allow deleting auth users by cascading deletion to profiles (and all dependent tables)
-- The profiles table's FK to auth.users needs ON DELETE CASCADE

-- Step 1: Drop and recreate the FK on profiles with CASCADE
ALTER TABLE public.profiles
    DROP CONSTRAINT IF EXISTS profiles_id_fkey;

ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Step 2: Also ensure student_details cascades from profiles (already done via profiles cascade)
ALTER TABLE public.student_details
    DROP CONSTRAINT IF EXISTS student_details_id_fkey;

ALTER TABLE public.student_details
    ADD CONSTRAINT student_details_id_fkey
    FOREIGN KEY (id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE;
