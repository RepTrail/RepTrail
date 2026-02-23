-- Allow public access to workout logs for public profiles
-- Anyone can read workout logs, but only the student can manage their own

-- Drop existing policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Anyone can read workout logs" ON workout_logs;

-- Allow anyone to read workout logs
CREATE POLICY "Anyone can read workout logs" ON workout_logs
FOR SELECT USING (true);

-- Allow students to manage their own workout logs
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'workout_logs' 
        AND policyname = 'Students can manage own workout logs'
    ) THEN
        CREATE POLICY "Students can manage own workout logs" ON workout_logs
        FOR ALL USING (
            auth.uid() = student_id
        );
    END IF;
END $$;
