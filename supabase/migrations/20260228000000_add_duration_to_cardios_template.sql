-- Add duration and intensity to cardios template table
ALTER TABLE cardios ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 30;
ALTER TABLE cardios ADD COLUMN IF NOT EXISTS suggested_intensity TEXT DEFAULT 'Moderada';
