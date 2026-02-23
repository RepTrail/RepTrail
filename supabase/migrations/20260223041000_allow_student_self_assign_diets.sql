-- Allow students to insert assigned_diets when they are the trainer (self-managed auto-training)
-- This enables students who import diets via PDF to see them in their diet page

-- 1. Enable INSERT for students on assigned_diets when self-assigning
DROP POLICY IF EXISTS "Students can insert assigned diets for themselves" ON assigned_diets;
CREATE POLICY "Students can insert assigned diets for themselves" ON assigned_diets
FOR INSERT WITH CHECK (
  student_id = auth.uid()
);

-- 2. Ensure students can SELECT their own assigned diets (even if self-managed)
DROP POLICY IF EXISTS "Students can view their own assigned diets" ON assigned_diets;
CREATE POLICY "Students can view their own assigned diets" ON assigned_diets
FOR SELECT USING (
  student_id = auth.uid()
);
