-- Create Storage Buckets for Avatars and Progress Photos

-- 1. Create avatars bucket (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'avatars') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'avatars',
            'avatars',
            true,
            5242880, -- 5MB limit
            ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        );
    END IF;
END $$;

-- 2. Create progress-photos bucket (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'progress-photos') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'progress-photos',
            'progress-photos',
            true,
            10485760, -- 10MB limit
            ARRAY['image/jpeg', 'image/png', 'image/webp']
        );
    END IF;
END $$;

-- 3. Storage Policies for avatars bucket
-- Anyone can view avatars (public bucket)
DROP POLICY IF EXISTS "Public Avatar Access" ON storage.objects;
CREATE POLICY "Public Avatar Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Authenticated users can upload avatars
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
);

-- Users can update their own avatar
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
);

-- Users can delete their own avatar
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
);

-- 4. Storage Policies for progress-photos bucket
-- Anyone can view progress photos (public bucket)
DROP POLICY IF EXISTS "Public Progress Photos Access" ON storage.objects;
CREATE POLICY "Public Progress Photos Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'progress-photos');

-- Authenticated users can upload progress photos
DROP POLICY IF EXISTS "Students can upload own progress photos" ON storage.objects;
CREATE POLICY "Students can upload own progress photos"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'progress-photos' AND
    auth.role() = 'authenticated'
);

-- Users can update their own progress photos
DROP POLICY IF EXISTS "Students can update own progress photos" ON storage.objects;
CREATE POLICY "Students can update own progress photos"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'progress-photos' AND
    auth.role() = 'authenticated'
);

-- Users can delete their own progress photos
DROP POLICY IF EXISTS "Students can delete own progress photos" ON storage.objects;
CREATE POLICY "Students can delete own progress photos"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'progress-photos' AND
    auth.role() = 'authenticated'
);
