-- ADD AUTO TRAINING FIELDS TO PROFILES
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS auto_training_status TEXT CHECK (auto_training_status IN ('trial', 'active', 'expired', 'disabled')) DEFAULT 'trial',
  ADD COLUMN IF NOT EXISTS auto_training_trial_end TIMESTAMPTZ DEFAULT (timezone('utc'::text, now()) + interval '7 days'),
  ADD COLUMN IF NOT EXISTS public_profile_enabled BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS keep_auto_training_with_personal BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS allow_public_feed BOOLEAN DEFAULT false;

-- ALREADY COMPATIBLE NATIVELY:
-- "workouts" and "diets" tables currently use:
-- trainer_id uuid references profiles(id) not null
-- Since both trainer and student live in "profiles", a student CAN use their own auth.uid() as trainer_id.
-- This intrinsically solves the "isolate data" constraint, as a trainer only sees items where trainer_id = their_own_id.

-- Update existing students to 'expired' if they are older than 7 days and don't have personal.
-- We won't forcefully expire them yet, the middleware handles the check, but we can set them up.
UPDATE public.profiles
SET auto_training_trial_end = created_at + interval '7 days'
WHERE role = 'student' AND auto_training_trial_end IS NULL;

-- Enable indexing for performance on Feed
CREATE INDEX IF NOT EXISTS idx_progress_photos_created_at ON public.progress_photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_public_feed ON public.profiles(allow_public_feed, role) WHERE allow_public_feed = true;
