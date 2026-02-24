
-- Migration: Add substitution support to meal items and logs
-- Version: 20260224163000

-- 1. Add predefined substitution columns to meal_items
ALTER TABLE public.meal_items 
ADD COLUMN IF NOT EXISTS has_substitute boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS sub_food_name text,
ADD COLUMN IF NOT EXISTS sub_quantity text,
ADD COLUMN IF NOT EXISTS sub_protein numeric(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS sub_carbs numeric(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS sub_fat numeric(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS sub_fiber numeric(10, 2) DEFAULT 0;

-- 2. Add macro tracking for substitutions in meal_item_logs
-- This ensures daily progress and total calculations account for substitution macros
ALTER TABLE public.meal_item_logs
ADD COLUMN IF NOT EXISTS substituted_protein numeric(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS substituted_carbs numeric(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS substituted_fat numeric(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS substituted_fiber numeric(10, 2) DEFAULT 0;
