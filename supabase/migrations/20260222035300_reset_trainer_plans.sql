-- Reset all trainers' plans so they must subscribe to the new On-Demand plan
UPDATE public.profiles
SET plan_tier = 'none'
WHERE role = 'trainer';
