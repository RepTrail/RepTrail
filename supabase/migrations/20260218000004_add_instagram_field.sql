
-- Add instagram field to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS instagram text;
