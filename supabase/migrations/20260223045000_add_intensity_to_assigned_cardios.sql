-- Add intensity column to assigned_cardios table
ALTER TABLE assigned_cardios 
ADD COLUMN intensity TEXT DEFAULT 'Moderada';
