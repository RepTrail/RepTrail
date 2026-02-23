
-- Migration: Add fiber column to meal_items
-- Version: 20260223064500

ALTER TABLE public.meal_items 
ADD COLUMN IF NOT EXISTS fiber numeric(10, 2) DEFAULT 0;

-- Update existing items to have 0 fiber instead of NULL
UPDATE public.meal_items SET fiber = 0 WHERE fiber IS NULL;
