-- Add anthropometric measurements for precice BF calculation (Navy Seal Method)
ALTER TABLE student_details 
ADD COLUMN IF NOT EXISTS neck_cm numeric(5, 2),
ADD COLUMN IF NOT EXISTS waist_cm numeric(5, 2),
ADD COLUMN IF NOT EXISTS hip_cm numeric(5, 2);
