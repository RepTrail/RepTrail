-- Add is_admin field to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Assign admin role to a specific email for testing if needed
-- UPDATE profiles SET is_admin = true WHERE email = 'admin@reptrail.com';
