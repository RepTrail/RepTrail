-- Terms acceptance and image disclosure consent
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS terms_accepted_at timestamptz,
ADD COLUMN IF NOT EXISTS allow_image_disclosure boolean DEFAULT true;

UPDATE profiles SET allow_image_disclosure = true WHERE allow_image_disclosure IS NULL;

-- Allow public (including anon) to view progress_photos when is_private = false
DROP POLICY IF EXISTS "Public can view non-private progress photos" ON progress_photos;
CREATE POLICY "Public can view non-private progress photos" ON progress_photos
FOR SELECT USING (is_private = false);
