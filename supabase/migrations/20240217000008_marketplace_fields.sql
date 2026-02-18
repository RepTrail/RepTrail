-- Add marketplace fields to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS specialty text,
ADD COLUMN IF NOT EXISTS region text,
ADD COLUMN IF NOT EXISTS monthly_price numeric(10, 2),
ADD COLUMN IF NOT EXISTS average_rating numeric(3, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_elite boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS retention_rate numeric(5, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews integer DEFAULT 0;

-- Index for searching
CREATE INDEX IF NOT EXISTS idx_profiles_role_specialty ON profiles(role, specialty) WHERE role = 'trainer';
CREATE INDEX IF NOT EXISTS idx_profiles_region ON profiles(region);
