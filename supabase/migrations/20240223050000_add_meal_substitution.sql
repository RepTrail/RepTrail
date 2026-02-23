
-- Add substitution support to meal item logs
ALTER TABLE public.meal_item_logs ADD COLUMN IF NOT EXISTS is_substituted boolean DEFAULT false;
ALTER TABLE public.meal_item_logs ADD COLUMN IF NOT EXISTS substituted_food_name text;
ALTER TABLE public.meal_item_logs ADD COLUMN IF NOT EXISTS substituted_quantity text;
