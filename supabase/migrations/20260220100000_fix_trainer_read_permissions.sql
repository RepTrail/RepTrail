
-- Permitir que treinadores leiam dados dos seus alunos ativos

-- Helper function to check relationship
-- (Note: Repeated calls in policies can be expensive, but typical for RLS)

-- 1. daily_tracking
DROP POLICY IF EXISTS "Trainers can view their students tracking" ON daily_tracking;
CREATE POLICY "Trainers can view their students tracking"
ON daily_tracking
FOR SELECT
USING (
  user_id IN (
    SELECT student_id FROM trainer_students 
    WHERE trainer_id = auth.uid() 
    AND active = true
  )
);

-- 2. weight_history
DROP POLICY IF EXISTS "Trainers can view their students weight history" ON weight_history;
CREATE POLICY "Trainers can view their students weight history"
ON weight_history
FOR SELECT
USING (
  student_id IN (
    SELECT student_id FROM trainer_students 
    WHERE trainer_id = auth.uid() 
    AND active = true
  )
);

-- 3. bf_history
DROP POLICY IF EXISTS "Trainers can view their students bf history" ON bf_history;
CREATE POLICY "Trainers can view their students bf history"
ON bf_history
FOR SELECT
USING (
  student_id IN (
    SELECT student_id FROM trainer_students 
    WHERE trainer_id = auth.uid() 
    AND active = true
  )
);

-- 4. workout_logs
DROP POLICY IF EXISTS "Trainers can view their students workout logs" ON workout_logs;
CREATE POLICY "Trainers can view their students workout logs"
ON workout_logs
FOR SELECT
USING (
  student_id IN (
    SELECT student_id FROM trainer_students 
    WHERE trainer_id = auth.uid() 
    AND active = true
  )
);

-- 5. cardio_logs
DROP POLICY IF EXISTS "Trainers can view their students cardio logs" ON cardio_logs;
CREATE POLICY "Trainers can view their students cardio logs"
ON cardio_logs
FOR SELECT
USING (
  student_id IN (
    SELECT student_id FROM trainer_students 
    WHERE trainer_id = auth.uid() 
    AND active = true
  )
);

-- 6. ergogenic_logs
DROP POLICY IF EXISTS "Trainers can view their students ergogenic logs" ON ergogenic_logs;
CREATE POLICY "Trainers can view their students ergogenic logs"
ON ergogenic_logs
FOR SELECT
USING (
  student_id IN (
    SELECT student_id FROM trainer_students 
    WHERE trainer_id = auth.uid() 
    AND active = true
  )
);

-- 7. load_history
DROP POLICY IF EXISTS "Trainers can view their students load history" ON load_history;
CREATE POLICY "Trainers can view their students load history"
ON load_history
FOR SELECT
USING (
  student_id IN (
    SELECT student_id FROM trainer_students 
    WHERE trainer_id = auth.uid() 
    AND active = true
  )
);

-- 8. meal_item_logs (Used in detailed adherence if trainer inspects detail)
DROP POLICY IF EXISTS "Trainers can view their students meal logs" ON meal_item_logs;
CREATE POLICY "Trainers can view their students meal logs"
ON meal_item_logs
FOR SELECT
USING (
  user_id IN (
    SELECT student_id FROM trainer_students 
    WHERE trainer_id = auth.uid() 
    AND active = true
  )
);

-- 9. assigned_* tables usually have policies linking to trainer_id directly if they created it, 
-- but let's ensure they can read via student link too (in case student was transferred or valid logic)
-- Actually assigned_* tables usually have 'trainer_id' column? 
-- Let's check table structure. Assuming they rely on student linkage primarily for some queries.

