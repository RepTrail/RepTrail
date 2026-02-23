ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS auto_training_trial_used BOOLEAN DEFAULT false;

UPDATE public.profiles
SET auto_training_trial_used = true
WHERE auto_training_trial_used = false
  AND (
    auto_training_trial_end IS NOT NULL
    OR auto_training_status IN ('trial', 'active', 'expired')
  );

CREATE INDEX IF NOT EXISTS idx_profiles_auto_training_trial_used
  ON public.profiles(auto_training_trial_used)
  WHERE auto_training_trial_used = true;
