-- Ensure all anamnesis columns exist in student_details
ALTER TABLE student_details 
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS sex text CHECK (sex IN ('male', 'female', 'other')),
ADD COLUMN IF NOT EXISTS current_weight numeric(5, 2),
ADD COLUMN IF NOT EXISTS neck_cm numeric(5, 2),
ADD COLUMN IF NOT EXISTS waist_cm numeric(5, 2),
ADD COLUMN IF NOT EXISTS hip_cm numeric(5, 2);

-- Update RLS to ensure students can update their own details (safety check)
CREATE POLICY IF NOT EXISTS "Users can update their own details" 
ON student_details FOR UPDATE 
USING (auth.uid() = id);

-- Refresh the schema cache for PostgREST
NOTIFY pgrst, 'reload schema';
