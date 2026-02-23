-- Ensure auto-training fields exist on profiles table and are consistent

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS auto_training_status TEXT,
  ADD COLUMN IF NOT EXISTS auto_training_trial_end TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS saw_auto_training_onboarding_modal BOOLEAN DEFAULT false;

-- Normalize constraint to avoid conflicts between older migrations
ALTER TABLE public.profiles
  ALTER COLUMN auto_training_status SET DEFAULT 'trial';

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_auto_training_status_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_auto_training_status_check
  CHECK (auto_training_status IN ('none', 'trial', 'active', 'expired', 'disabled'));

-- Default trial end for rows that don't have it yet
UPDATE public.profiles
SET auto_training_trial_end = created_at + interval '7 days'
WHERE role = 'student'
  AND auto_training_trial_end IS NULL;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_profiles_auto_training_trial_end
  ON public.profiles(auto_training_trial_end)
  WHERE auto_training_status = 'trial';

CREATE INDEX IF NOT EXISTS idx_profiles_saw_auto_training_onboarding_modal
  ON public.profiles(saw_auto_training_onboarding_modal)
  WHERE saw_auto_training_onboarding_modal = false;
