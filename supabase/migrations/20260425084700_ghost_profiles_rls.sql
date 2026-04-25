-- GHOST PROFILES RLS FIX
-- Permite que Treinadores criem e gerenciem alunos (Ghost Profiles)

-- 1. Permissão de INSERT em profiles
-- Permite que um treinador autenticado crie um novo perfil com role 'student' e is_placeholder true
DROP POLICY IF EXISTS "Trainers can create ghost profiles" ON public.profiles;
CREATE POLICY "Trainers can create ghost profiles" ON public.profiles
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'trainer' AND
  role = 'student' AND
  is_placeholder = true
);

-- 2. Permissão de UPDATE em profiles
-- Permite que o treinador edite os perfis dos alunos que estão vinculados a ele
DROP POLICY IF EXISTS "Trainers can update their students" ON public.profiles;
CREATE POLICY "Trainers can update their students" ON public.profiles
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.trainer_students ts 
    WHERE ts.trainer_id = auth.uid() AND ts.student_id = public.profiles.id
  )
);

-- 3. Permissão de DELETE em profiles
-- Permite que o treinador remova alunos que estão vinculados a ele
DROP POLICY IF EXISTS "Trainers can delete their students" ON public.profiles;
CREATE POLICY "Trainers can delete their students" ON public.profiles
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.trainer_students ts 
    WHERE ts.trainer_id = auth.uid() AND ts.student_id = public.profiles.id
  )
);

-- 4. Garantir que o treinador pode ver todos os perfis (já deve existir, mas reforçando)
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
CREATE POLICY "Anyone can view profiles" ON public.profiles
FOR SELECT USING (true);

-- 5. Trainer Students Table RLS
-- Treinador precisa gerenciar os vínculos
ALTER TABLE public.trainer_students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Trainers can manage their student links" ON public.trainer_students;
CREATE POLICY "Trainers can manage their student links" ON public.trainer_students
FOR ALL USING (trainer_id = auth.uid());

-- 6. Student Details Management
-- Permite que o treinador gerencie as configurações dos seus alunos (ex: ativar protocolo hormonal)
DROP POLICY IF EXISTS "Trainers can manage student details" ON public.student_details;
CREATE POLICY "Trainers can manage student details" ON public.student_details
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.trainer_students ts 
    WHERE ts.trainer_id = auth.uid() AND ts.student_id = public.student_details.id
  )
);

-- 7. Library Management (Workouts/Diets)
-- Garantir que o treinador pode deletar seus próprios templates
DROP POLICY IF EXISTS "Trainers can manage their own library" ON public.diets;
CREATE POLICY "Trainers can manage their own library" ON public.diets
FOR ALL USING (trainer_id = auth.uid());

DROP POLICY IF EXISTS "Trainers can manage their own workouts" ON public.workouts;
CREATE POLICY "Trainers can manage their own workouts" ON public.workouts
FOR ALL USING (trainer_id = auth.uid());
