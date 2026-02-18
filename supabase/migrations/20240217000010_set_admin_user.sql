-- Set is_admin = true for the platform owner
-- Replace 'marcos@reptrail.com' with your actual email if different
UPDATE profiles SET is_admin = true WHERE email = 'marcos@reptrail.com';

-- Alternatively, you can set by user ID:
-- UPDATE profiles SET is_admin = true WHERE id = 'YOUR_USER_ID_HERE';
