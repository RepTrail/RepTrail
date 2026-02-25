-- Allow students to read cardios that have been assigned to them
-- This is necessary for the joined query in getStudentCardioAssignments to return the cardio template details
DROP POLICY IF EXISTS "Students can view assigned cardios" ON cardios;
CREATE POLICY "Students can view assigned cardios" ON cardios
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM assigned_cardios
        WHERE assigned_cardios.cardio_id = cardios.id
        AND assigned_cardios.student_id = auth.uid()
    )
    OR
    EXISTS (
        SELECT 1 FROM trainer_students
        WHERE trainer_students.trainer_id = cardios.trainer_id
        AND trainer_students.student_id = auth.uid()
        AND trainer_students.active = true
    )
);
