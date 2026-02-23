-- Fix suggested_intensity column constraint
-- Allow NULL values or set default for existing records

-- First, make the column nullable to fix existing records
ALTER TABLE assigned_cardios 
ALTER COLUMN suggested_intensity DROP NOT NULL;

-- Update any NULL records to have a default value
UPDATE assigned_cardios 
SET suggested_intensity = 'Moderada' 
WHERE suggested_intensity IS NULL;

-- Optionally, set back to NOT NULL if desired
-- ALTER TABLE assigned_cardios 
-- ALTER COLUMN suggested_intensity SET NOT NULL;
