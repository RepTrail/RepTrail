
-- Migration: Allow students to update macros of assigned diet items
-- This enables the "Calcular Macros" button for students without editing rights
-- Version: 20260223064000

-- 1. DIETS (Allow viewing if assigned)
DROP POLICY IF EXISTS "Students can view assigned diets" ON public.diets;
CREATE POLICY "Students can view assigned diets" ON public.diets
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.assigned_diets 
        WHERE assigned_diets.diet_id = diets.id 
        AND assigned_diets.student_id = auth.uid()
        AND assigned_diets.active = true
    )
);

-- 2. MEALS (Allow viewing if part of an assigned diet)
DROP POLICY IF EXISTS "Students can view assigned diet meals" ON public.meals;
CREATE POLICY "Students can view assigned diet meals" ON public.meals
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.assigned_diets 
        WHERE assigned_diets.diet_id = meals.diet_id 
        AND assigned_diets.student_id = auth.uid()
        AND assigned_diets.active = true
    )
);

-- 3. MEAL ITEMS (Allow viewing and updating macros if part of an assigned diet)
DROP POLICY IF EXISTS "Students can view assigned diet items" ON public.meal_items;
CREATE POLICY "Students can view assigned diet items" ON public.meal_items
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.meals
        JOIN public.assigned_diets ON assigned_diets.diet_id = meals.diet_id
        WHERE meals.id = meal_items.meal_id
        AND assigned_diets.student_id = auth.uid()
        AND assigned_diets.active = true
    )
);

DROP POLICY IF EXISTS "Students can update macros of assigned diets" ON public.meal_items;
CREATE POLICY "Students can update macros of assigned diets" ON public.meal_items
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.meals
        JOIN public.assigned_diets ON assigned_diets.diet_id = meals.diet_id
        WHERE meals.id = meal_items.meal_id
        AND assigned_diets.student_id = auth.uid()
        AND assigned_diets.active = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.meals
        JOIN public.assigned_diets ON assigned_diets.diet_id = meals.diet_id
        WHERE meals.id = meal_items.meal_id
        AND assigned_diets.student_id = auth.uid()
        AND assigned_diets.active = true
    )
);
