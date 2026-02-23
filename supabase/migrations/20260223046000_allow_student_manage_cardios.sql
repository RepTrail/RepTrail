-- Allow auto-training students to manage their own cardios
-- Students can create, read, update, delete cardios where trainer_id = user.id

-- Create policy for students to manage their own cardios
CREATE POLICY "Students can manage own cardios" ON cardios
FOR ALL USING (
    auth.uid() = trainer_id 
    AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND auto_training_status IN ('active', 'trial')
    )
);

-- Allow students to read their own cardio assignments
CREATE POLICY "Students can read own cardio assignments" ON assigned_cardios
FOR SELECT USING (
    student_id = auth.uid()
);

-- Allow students to insert their own cardio assignments
CREATE POLICY "Students can insert own cardio assignments" ON assigned_cardios
FOR INSERT WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND auto_training_status IN ('active', 'trial')
    )
);

-- Allow students to update their own cardio assignments
CREATE POLICY "Students can update own cardio assignments" ON assigned_cardios
FOR UPDATE USING (
    student_id = auth.uid()
);

-- Allow students to delete their own cardio assignments
CREATE POLICY "Students can delete own cardio assignments" ON assigned_cardios
FOR DELETE USING (
    student_id = auth.uid()
);
