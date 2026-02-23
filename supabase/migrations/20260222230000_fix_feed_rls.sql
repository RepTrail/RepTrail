-- FIX FEED VISIBILITY
-- 1. Ensure students can see public photos from other students
DROP POLICY IF EXISTS "Public can view non-private progress photos" ON progress_photos;
CREATE POLICY "Students can view public feed photos" 
ON progress_photos FOR SELECT 
USING (
  is_private = false 
  OR auth.uid() = student_id 
  OR EXISTS (
    SELECT 1 FROM trainer_students 
    WHERE student_id = progress_photos.student_id AND trainer_id = auth.uid()
  )
);

-- 2. Bulk enable existing students for testing (Optional but good for the user's current state)
-- Set allow_public_feed to true for those who accepted image disclosure previously
UPDATE public.profiles
SET allow_public_feed = true
WHERE role = 'student' 
AND (allow_public_feed IS FALSE OR allow_public_feed IS NULL);

-- 3. Ensure profiles are visible (already exists, but reinforcing)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);
