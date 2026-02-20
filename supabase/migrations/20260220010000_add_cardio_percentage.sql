
-- Migration: Add cardio_percentage to daily_tracking
-- Date: 2026-02-20

ALTER TABLE public.daily_tracking
ADD COLUMN IF NOT EXISTS cardio_percentage numeric(5, 2) DEFAULT 0;

-- Update the check constraint for cardio_status if we ever want to use 'partial', 
-- but for now we can stick to existing statuses or add 'partial'.
-- Existing constraint: CHECK (cardio_status IN ('none', 'assigned', 'completed', 'skipped'))

ALTER TABLE public.daily_tracking
DROP CONSTRAINT IF EXISTS daily_tracking_cardio_status_check;

ALTER TABLE public.daily_tracking
ADD CONSTRAINT daily_tracking_cardio_status_check 
CHECK (cardio_status IN ('none', 'assigned', 'completed', 'skipped', 'partial'));
