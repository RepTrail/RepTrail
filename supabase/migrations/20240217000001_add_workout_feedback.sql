-- Add feedback columns to workout_logs
ALTER TABLE workout_logs 
ADD COLUMN IF NOT EXISTS feedback text,
ADD COLUMN IF NOT EXISTS perceived_effort integer;

-- Update RLS policies to allow students to update their own logs with feedback
CREATE POLICY "Students can update their own workout logs"
ON workout_logs FOR UPDATE
TO authenticated
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id);
