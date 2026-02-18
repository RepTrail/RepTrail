
-- 1. Enable RLS on profiles if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

-- 3. Create robust policies
-- SELECT: Everyone can view profiles (needed for student/trainer relationships and dashboard)
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

-- UPDATE: Users can update their own profiles
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- UPDATE: Admins can update any profile (Crucial for plan management)
CREATE POLICY "Admins can update any profile" 
ON profiles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- 4. Ensure plan_tier default is correct
ALTER TABLE profiles ALTER COLUMN plan_tier SET DEFAULT 'none';

-- 5. Fix any existing trainers with null plan_tier
UPDATE profiles SET plan_tier = 'none' WHERE role = 'trainer' AND plan_tier IS NULL;
