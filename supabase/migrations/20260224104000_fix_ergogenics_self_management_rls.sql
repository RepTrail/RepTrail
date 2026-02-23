
-- 11. ERGOGENICS (Complete comprehensive self-management)
-- Alunos podem gerenciar seus próprios protocolos farmacológicos/suplementação
DROP POLICY IF EXISTS "Students can view their own ergogenics" ON ergogenics;
DROP POLICY IF EXISTS "Students can manage their own ergogenics" ON ergogenics;
DROP POLICY IF EXISTS "Students can manage their own ergogenics_v2" ON ergogenics;

CREATE POLICY "Students can manage their own ergogenics"
ON ergogenics FOR ALL
TO authenticated
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());
