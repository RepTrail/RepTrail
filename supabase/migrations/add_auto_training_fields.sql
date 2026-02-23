-- Migration: Add auto-training fields to profiles table
-- This migration adds fields to support the auto-training trial feature

-- Add columns if they don't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS auto_training_status text DEFAULT 'none' CHECK (auto_training_status IN ('none', 'trial', 'active')),
ADD COLUMN IF NOT EXISTS auto_training_trial_end timestamp with time zone,
ADD COLUMN IF NOT EXISTS saw_auto_training_onboarding_modal boolean DEFAULT false;

-- Create index on auto_training_trial_end for efficient queries
CREATE INDEX IF NOT EXISTS idx_profiles_auto_training_trial_end 
ON profiles(auto_training_trial_end) 
WHERE auto_training_status = 'trial';

-- Create index on saw_auto_training_onboarding_modal for efficient queries
CREATE INDEX IF NOT EXISTS idx_profiles_saw_auto_training_onboarding_modal 
ON profiles(saw_auto_training_onboarding_modal) 
WHERE saw_auto_training_onboarding_modal = false;

-- Add comment for documentation
COMMENT ON COLUMN profiles.auto_training_status IS 'Status of auto-training plan: none, trial (free 7 days), or active (paid)';
COMMENT ON COLUMN profiles.auto_training_trial_end IS 'End date of the free trial period for auto-training';
COMMENT ON COLUMN profiles.saw_auto_training_onboarding_modal IS 'Flag to track if user has seen the auto-training onboarding modal';
