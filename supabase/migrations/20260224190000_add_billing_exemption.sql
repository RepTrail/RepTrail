-- Add billing exemption flag to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_billing_exempt boolean DEFAULT false;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_billing_exempt ON profiles(is_billing_exempt);
