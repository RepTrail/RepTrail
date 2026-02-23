
-- 1. UNIFY RLS FOR PHYSICAL METRICS (Weight & BF)
-- Ensuring both students and their linked trainers can manage these records.

-- BF HISTORY
ALTER TABLE public.bf_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own bf history." ON public.bf_history;
DROP POLICY IF EXISTS "Users can manage own bf history" ON public.bf_history;
CREATE POLICY "Student manages own bf history" ON public.bf_history
FOR ALL TO authenticated
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Trainers can view their students' bf history." ON public.bf_history;
DROP POLICY IF EXISTS "Trainers can insert bf history for their students." ON public.bf_history;
DROP POLICY IF EXISTS "Trainers can manage student bf history" ON public.bf_history;
CREATE POLICY "Trainer manages student bf history" ON public.bf_history
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM trainer_students ts
    WHERE ts.trainer_id = auth.uid() 
    AND ts.student_id = bf_history.student_id
    AND ts.active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM trainer_students ts
    WHERE ts.trainer_id = auth.uid() 
    AND ts.student_id = bf_history.student_id
    AND ts.active = true
  )
);

-- WEIGHT HISTORY
ALTER TABLE public.weight_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Student manages own weight history" ON public.weight_history;
CREATE POLICY "Student manages own weight history" ON public.weight_history
FOR ALL TO authenticated
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Trainer can insert student weight history" ON public.weight_history;
DROP POLICY IF EXISTS "Trainer views student weight history" ON public.weight_history;
CREATE POLICY "Trainer manages student weight history" ON public.weight_history
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM trainer_students ts
    WHERE ts.trainer_id = auth.uid() 
    AND ts.student_id = weight_history.student_id
    AND ts.active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM trainer_students ts
    WHERE ts.trainer_id = auth.uid() 
    AND ts.student_id = weight_history.student_id
    AND ts.active = true
  )
);

-- 2. ENSURE PUBLIC ACCESS FOR FEED-ENABLED STUDENTS (Consistency with public_metrics migration)
DROP POLICY IF EXISTS "Public can view metrics of public students" ON public.bf_history;
CREATE POLICY "Public can view metrics of public students" ON public.bf_history 
FOR SELECT TO anon, authenticated
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = bf_history.student_id AND p.allow_public_feed = true)
);

DROP POLICY IF EXISTS "Public can view weight of public students" ON public.weight_history;
CREATE POLICY "Public can view weight of public students" ON public.weight_history 
FOR SELECT TO anon, authenticated
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = weight_history.student_id AND p.allow_public_feed = true)
);

-- 3. BACKFILL MISSING HISTORY FROM SNAPSHOTS
-- If a student has a body_fat set in student_details but NO history entries, create one.
-- This fixes the "vanished line" for students who only had data in their profiles.
INSERT INTO public.bf_history (student_id, bf_percentage, recorded_at)
SELECT id, body_fat, COALESCE(updated_at, now())
FROM public.student_details
WHERE body_fat IS NOT NULL
  AND id NOT IN (SELECT DISTINCT student_id FROM public.bf_history);

-- Same for weight history (starting_weight)
INSERT INTO public.weight_history (student_id, weight_kg, recorded_at)
SELECT id, starting_weight, now()
FROM public.student_details
WHERE starting_weight IS NOT NULL
  AND id NOT IN (SELECT DISTINCT student_id FROM public.weight_history);

-- 4. ADD INDICES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_bf_history_student ON public.bf_history(student_id);
CREATE INDEX IF NOT EXISTS idx_weight_history_student ON public.weight_history(student_id);
