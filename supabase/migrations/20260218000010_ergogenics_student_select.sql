-- Alunos precisam poder ver seus próprios ergogênicos na tela de protocolo
CREATE POLICY "Students can view their own ergogenics"
ON ergogenics FOR SELECT
USING (student_id = auth.uid());
