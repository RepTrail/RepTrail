-- Add missing commission_rate column to profiles for affiliate management
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS commission_rate numeric(5, 2) DEFAULT 10.0;
