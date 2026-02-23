
-- COMPREHENSIVE RLS FOR AUTO-TRAINING STUDENTS
-- This ensures students can full manage their own training content (workouts, diets, cardios, ergogenics)
-- when they are acting as their own trainers.

-- 1. DIETS
DROP POLICY IF EXISTS "Students can manage their own diets" ON diets;
CREATE POLICY "Students can manage their own diets" ON diets
FOR ALL USING (trainer_id = auth.uid());

-- 2. MEALS (Inherits from diet ownership)
DROP POLICY IF EXISTS "Students can manage their own meals" ON meals;
CREATE POLICY "Students can manage their own meals" ON meals
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM diets 
        WHERE diets.id = meals.diet_id 
        AND diets.trainer_id = auth.uid()
    )
);

-- 3. MEAL ITEMS (Inherits from meal ownership)
DROP POLICY IF EXISTS "Students can manage their own meal items" ON meal_items;
CREATE POLICY "Students can manage their own meal items" ON meal_items
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM meals 
        JOIN diets ON diets.id = meals.diet_id
        WHERE meals.id = meal_items.meal_id 
        AND diets.trainer_id = auth.uid()
    )
);

-- 4. ASSIGNED DIETS (Self-assignment)
DROP POLICY IF EXISTS "Students can self-assign diets" ON assigned_diets;
CREATE POLICY "Students can self-assign diets" ON assigned_diets
FOR ALL USING (student_id = auth.uid());

-- 5. WORKOUTS
DROP POLICY IF EXISTS "Students can manage their own workouts" ON workouts;
CREATE POLICY "Students can manage their own workouts" ON workouts
FOR ALL USING (trainer_id = auth.uid());

-- 6. WORKOUT EXERCISES
DROP POLICY IF EXISTS "Students can manage their own workout exercises" ON workout_exercises;
CREATE POLICY "Students can manage their own workout exercises" ON workout_exercises
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM workouts 
        WHERE workouts.id = workout_exercises.workout_id 
        AND workouts.trainer_id = auth.uid()
    )
);

-- 7. ASSIGNED WORKOUTS
DROP POLICY IF EXISTS "Students can self-assign workouts" ON assigned_workouts;
CREATE POLICY "Students can self-assign workouts" ON assigned_workouts
FOR ALL USING (student_id = auth.uid());

-- 8. CARDIOS
DROP POLICY IF EXISTS "Students can manage their own cardios" ON cardios;
CREATE POLICY "Students can manage their own cardios" ON cardios
FOR ALL USING (trainer_id = auth.uid());

-- 9. ASSIGNED CARDIOS
DROP POLICY IF EXISTS "Students can self-assign cardios" ON assigned_cardios;
CREATE POLICY "Students can self-assign cardios" ON assigned_cardios
FOR ALL USING (student_id = auth.uid());

-- 10. EXERCISES (Allow students to create own exercises for their workouts)
-- Exercises table might already allow this if trainer_id = auth.uid() works for students.
DROP POLICY IF EXISTS "Students can manage own exercises" ON exercises;
CREATE POLICY "Students can manage own exercises" ON exercises
FOR ALL USING (trainer_id = auth.uid());
