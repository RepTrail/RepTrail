-- Add persistent columns for Bi-sets in load_history
ALTER TABLE load_history ADD COLUMN IF NOT EXISTS sub_index integer;
ALTER TABLE load_history ADD COLUMN IF NOT EXISTS group_id text;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_load_history_group_id ON load_history(group_id);
