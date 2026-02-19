-- Fix plan_tier check constraint to include 'on_demand' and 'none'
-- This is critical: without this, trainer registration fails silently
-- because the trigger tries to insert plan_tier='on_demand' but the constraint rejects it.

-- 1. Fix profiles table constraint
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_plan_tier_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_plan_tier_check 
CHECK (plan_tier IN ('none', 'on_demand', 'start', 'pro', 'elite'));

-- 2. Fix trainer_students table constraint
ALTER TABLE public.trainer_students 
DROP CONSTRAINT IF EXISTS trainer_students_plan_tier_check;

ALTER TABLE public.trainer_students 
ADD CONSTRAINT trainer_students_plan_tier_check 
CHECK (plan_tier IN ('none', 'on_demand', 'start', 'pro', 'elite'));
