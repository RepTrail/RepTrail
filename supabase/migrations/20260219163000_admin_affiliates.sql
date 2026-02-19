
-- Migration for Admin Affiliate Management features
-- Version: 20260219163000

-- 1. Add custom commission rate to profiles (affiliates)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS commission_rate numeric(5, 2) DEFAULT 10.0;

-- 2. Ensure RLS allows admins to update this (Already covered by "Admins can update everything" policy usually, or check specifically)
-- If not, ensure policy:
-- CREATE POLICY "Admins can update profiles" ON public.profiles FOR UPDATE USING ( auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin') );

-- 3. We might want to track commission rate history, but for now simple overwrite is enough.

-- 4. Updates to commissions table calculation happen in application logic (using profile.commission_rate instead of hardcoded 10).
