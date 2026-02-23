-- Create workout_logs table for tracking completed workouts
CREATE TABLE IF NOT EXISTS workout_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    workout_id UUID REFERENCES workouts(id) ON DELETE SET NULL,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'completed',
    notes TEXT,
    current_state JSONB,
    
    -- Performance metrics
    total_volume DECIMAL,
    estimated_calories INTEGER,
    
    -- Time tracking
    duration_minutes INTEGER,
    
    -- Auto-generated timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_workout_logs_student_id ON workout_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_completed_at ON workout_logs(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_workout_logs_status ON workout_logs(status);

-- Add RLS policies
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Students can read own workout logs
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'workout_logs' 
        AND policyname = 'Students can read own workout logs'
    ) THEN
        CREATE POLICY "Students can read own workout logs" ON workout_logs
        FOR SELECT USING (auth.uid() = student_id);
    END IF;
END $$;

-- Policy: Students can insert own workout logs
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'workout_logs' 
        AND policyname = 'Students can insert own workout logs'
    ) THEN
        CREATE POLICY "Students can insert own workout logs" ON workout_logs
        FOR INSERT WITH CHECK (auth.uid() = student_id);
    END IF;
END $$;

-- Policy: Students can update own workout logs
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'workout_logs' 
        AND policyname = 'Students can update own workout logs'
    ) THEN
        CREATE POLICY "Students can update own workout logs" ON workout_logs
        FOR UPDATE USING (auth.uid() = student_id);
    END IF;
END $$;

-- Policy: Students can delete own workout logs
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'workout_logs' 
        AND policyname = 'Students can delete own workout logs'
    ) THEN
        CREATE POLICY "Students can delete own workout logs" ON workout_logs
        FOR DELETE USING (auth.uid() = student_id);
    END IF;
END $$;
