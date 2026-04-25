
-- ═══════════════════════════════════════════════════════════════
-- DEAD CODE & COLUMN PURGE
-- ═══════════════════════════════════════════════════════════════
-- This script removes tables and columns identified as dead or legacy.
-- Run this in the Supabase SQL Editor.

-- 1. Drop the legacy placeholder table (Replaced by Ghost Profiles in 'profiles' table)
DROP TABLE IF EXISTS public.pending_student_links CASCADE;

-- 2. Remove dead/legacy columns from profiles
ALTER TABLE public.profiles 
  DROP COLUMN IF EXISTS retention_rate,
  DROP COLUMN IF EXISTS stripe_cancel_at_period_end,
  DROP COLUMN IF EXISTS stripe_current_period_end;

-- 3. Optimization (Optional but recommended after major deletions)
-- VACUUM ANALYZE public.profiles;

-- ═══════════════════════════════════════════════════════════════
-- END OF PURGE
-- ═══════════════════════════════════════════════════════════════
