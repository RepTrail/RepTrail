-- FIX_ON_DEMAND_PLAN.sql
-- Fixes the plan_tier check constraint that was restricted in a previous migration
-- and is now causing registration errors because 'on_demand' is rejected.

BEGIN;

-- 1. Update profiles table
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_plan_tier_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_plan_tier_check 
CHECK (plan_tier IN ('none', 'on_demand', 'start', 'pro', 'elite'));

-- 2. Update trainer_students table
ALTER TABLE public.trainer_students 
DROP CONSTRAINT IF EXISTS trainer_students_plan_tier_check;

ALTER TABLE public.trainer_students 
ADD CONSTRAINT trainer_students_plan_tier_check 
CHECK (plan_tier IN ('none', 'on_demand', 'start', 'pro', 'elite'));

-- 3. Update the trigger (just to be safe, though it seems correct and pointing to 'on_demand')
-- The current trigger in 20260219143500_affiliate_setup_and_trigger.sql already uses 'on_demand'.
-- We just need the constraint to allow it.

COMMIT;
