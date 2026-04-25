-- Add elite_until and trial_activated_at to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS elite_until TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_activated_at TIMESTAMPTZ;

-- You may need to run this in your Supabase SQL Editor.
