
-- 1. Helper function (SECURITY DEFINER to bypass RLS on trainer_students table lookup)
CREATE OR REPLACE FUNCTION check_is_trainer_of_student(lookup_student_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM trainer_students
    WHERE trainer_id = auth.uid()
    AND student_id = lookup_student_id
    AND active = true
  );
END;
$$;

-- 2. Daily Tracking
DROP POLICY IF EXISTS "Trainer view student tracking" ON daily_tracking;
CREATE POLICY "Trainer view student tracking" ON daily_tracking
FOR SELECT USING (
  user_id = auth.uid() OR check_is_trainer_of_student(user_id)
);

-- 3. Assignments (Crucial for adherence calculation)
DROP POLICY IF EXISTS "Trainer view assigned workouts" ON assigned_workouts;
CREATE POLICY "Trainer view assigned workouts" ON assigned_workouts
FOR SELECT USING (
  student_id = auth.uid() OR check_is_trainer_of_student(student_id)
);

DROP POLICY IF EXISTS "Trainer view assigned diets" ON assigned_diets;
CREATE POLICY "Trainer view assigned diets" ON assigned_diets
FOR SELECT USING (
  student_id = auth.uid() OR check_is_trainer_of_student(student_id)
);

DROP POLICY IF EXISTS "Trainer view assigned cardios" ON assigned_cardios;
CREATE POLICY "Trainer view assigned cardios" ON assigned_cardios
FOR SELECT USING (
  student_id = auth.uid() OR check_is_trainer_of_student(student_id)
);

-- Removed assigned_ergogenics policies as table might not exist

-- 4. Metrics & Logs
DROP POLICY IF EXISTS "Trainer view weight history" ON weight_history;
CREATE POLICY "Trainer view weight history" ON weight_history
FOR SELECT USING (
  student_id = auth.uid() OR check_is_trainer_of_student(student_id)
);

DROP POLICY IF EXISTS "Trainer view bf history" ON bf_history;
CREATE POLICY "Trainer view bf history" ON bf_history
FOR SELECT USING (
  student_id = auth.uid() OR check_is_trainer_of_student(student_id)
);

DROP POLICY IF EXISTS "Trainer view workout logs" ON workout_logs;
CREATE POLICY "Trainer view workout logs" ON workout_logs
FOR SELECT USING (
  student_id = auth.uid() OR check_is_trainer_of_student(student_id)
);

DROP POLICY IF EXISTS "Trainer view cardio logs" ON cardio_logs;
CREATE POLICY "Trainer view cardio logs" ON cardio_logs
FOR SELECT USING (
  student_id = auth.uid() OR check_is_trainer_of_student(student_id)
);

DROP POLICY IF EXISTS "Trainer view load history" ON load_history;
CREATE POLICY "Trainer view load history" ON load_history
FOR SELECT USING (
  student_id = auth.uid() OR check_is_trainer_of_student(student_id)
);

DROP POLICY IF EXISTS "Trainer view meal logs" ON meal_item_logs;
CREATE POLICY "Trainer view meal logs" ON meal_item_logs
FOR SELECT USING (
  user_id = auth.uid() OR check_is_trainer_of_student(user_id)
);

DROP POLICY IF EXISTS "Trainer view student details" ON student_details;
CREATE POLICY "Trainer view student details" ON student_details
FOR SELECT USING (
  id = auth.uid() OR check_is_trainer_of_student(id)
);
