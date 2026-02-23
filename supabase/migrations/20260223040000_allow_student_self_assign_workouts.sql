-- Allow students to insert assigned_workouts when they are the trainer (self-managed auto-training)
-- This enables students who import workouts via PDF to see them in their workouts page

-- 1. Enable INSERT for students on assigned_workouts when self-assigning
DROP POLICY IF EXISTS "Students can insert assigned workouts for themselves" ON assigned_workouts;
CREATE POLICY "Students can insert assigned workouts for themselves" ON assigned_workouts
FOR INSERT WITH CHECK (
  student_id = auth.uid()
);

-- 2. Ensure students can SELECT their own assigned workouts (even if self-managed)
DROP POLICY IF EXISTS "Students can view their own assigned workouts" ON assigned_workouts;
CREATE POLICY "Students can view their own assigned workouts" ON assigned_workouts
FOR SELECT USING (
  student_id = auth.uid()
);
