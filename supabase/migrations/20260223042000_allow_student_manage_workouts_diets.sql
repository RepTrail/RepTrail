-- Allow auto-training students to UPDATE and DELETE their own workouts and diets
-- This enables students to edit and delete content they created (trainer_id = user.id)

-- === WORKOUTS ===
-- Enable UPDATE for students on their own workouts
DROP POLICY IF EXISTS "Students can update their own workouts" ON workouts;
CREATE POLICY "Students can update their own workouts" ON workouts
FOR UPDATE USING (
    trainer_id = auth.uid()
);

-- Enable DELETE for students on their own workouts
DROP POLICY IF EXISTS "Students can delete their own workouts" ON workouts;
CREATE POLICY "Students can delete their own workouts" ON workouts
FOR DELETE USING (
    trainer_id = auth.uid()
);

-- === DIETS ===
-- Enable UPDATE for students on their own diets
DROP POLICY IF EXISTS "Students can update their own diets" ON diets;
CREATE POLICY "Students can update their own diets" ON diets
FOR UPDATE USING (
    trainer_id = auth.uid()
);

-- Enable DELETE for students on their own diets
DROP POLICY IF EXISTS "Students can delete their own diets" ON diets;
CREATE POLICY "Students can delete their own diets" ON diets
FOR DELETE USING (
    trainer_id = auth.uid()
);

-- === CARDIOS ===
-- Enable UPDATE for students on their own cardios
DROP POLICY IF EXISTS "Students can update their own cardios" ON cardios;
CREATE POLICY "Students can update their own cardios" ON cardios
FOR UPDATE USING (
    trainer_id = auth.uid()
);

-- Enable DELETE for students on their own cardios
DROP POLICY IF EXISTS "Students can delete their own cardios" ON cardios;
CREATE POLICY "Students can delete their own cardios" ON cardios
FOR DELETE USING (
    trainer_id = auth.uid()
);

-- === ERGOGENICS ===
-- Enable UPDATE for students on their own ergogenics
DROP POLICY IF EXISTS "Students can update their own ergogenics" ON ergogenics;
CREATE POLICY "Students can update their own ergogenics" ON ergogenics
FOR UPDATE USING (
    trainer_id = auth.uid() AND student_id = auth.uid()
);

-- Enable DELETE for students on their own ergogenics
DROP POLICY IF EXISTS "Students can delete their own ergogenics" ON ergogenics;
CREATE POLICY "Students can delete their own ergogenics" ON ergogenics
FOR DELETE USING (
    trainer_id = auth.uid() AND student_id = auth.uid()
);
