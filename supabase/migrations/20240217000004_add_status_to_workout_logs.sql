-- Add status column to workout_logs
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='workout_logs' AND column_name='status') THEN
        ALTER TABLE workout_logs ADD COLUMN status text DEFAULT 'completed';
    END IF;
END $$;
