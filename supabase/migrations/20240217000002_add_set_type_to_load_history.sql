-- Add set_type to load_history
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='load_history' AND column_name='set_type') THEN
        ALTER TABLE load_history ADD COLUMN set_type text DEFAULT 'WORKING';
    END IF;
END $$;
