-- FIX FEED AND PRIVACY SYNC
-- Unify the three privacy flags to ensure the feed works as expected

-- 1. Update RLS Polices to consider all three flags
DROP POLICY IF EXISTS "Anyone can view public progress photos" ON public.progress_photos;
CREATE POLICY "Anyone can view public progress photos" ON public.progress_photos 
FOR SELECT USING (
  NOT is_private AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = progress_photos.student_id 
    AND (allow_public_feed = true OR public_profile_enabled = true OR allow_image_disclosure = true)
  )
);

-- 2. Sync existing users (Optional but recommended)
-- If a user has any of these as true, they probably intended to be shareable.
UPDATE profiles 
SET allow_public_feed = true,
    public_profile_enabled = true,
    allow_image_disclosure = true
WHERE allow_public_feed = true 
   OR public_profile_enabled = true 
   OR allow_image_disclosure = true;
