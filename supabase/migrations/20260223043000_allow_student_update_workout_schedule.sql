-- Allow auto-training students to update their own workout schedule (assigned_workouts.day_of_week)

DROP POLICY IF EXISTS "Students can update their own assigned workouts" ON assigned_workouts;
CREATE POLICY "Students can update their own assigned workouts" ON assigned_workouts
FOR UPDATE USING (
  student_id = auth.uid()
)
WITH CHECK (
  student_id = auth.uid()
);
