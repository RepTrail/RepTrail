-- SQL Fix para colunas faltantes e erros de sincronização no workout_logs
-- Execute este script no editor SQL do Supabase

-- 1. Garante que a coluna adherence_status existe
ALTER TABLE public.workout_logs 
ADD COLUMN IF NOT EXISTS adherence_status text CHECK (adherence_status IN ('success', 'partial', 'fail')) DEFAULT 'success';

-- 2. Garante que a coluna feedback existe
ALTER TABLE public.workout_logs 
ADD COLUMN IF NOT EXISTS feedback text;

-- 3. Garante que a coluna perceived_effort existe
ALTER TABLE public.workout_logs 
ADD COLUMN IF NOT EXISTS perceived_effort integer CHECK (perceived_effort BETWEEN 1 AND 10);

-- 4. Corrige a restrição de status para aceitar 'in_progress'
-- Primeiro removemos a antiga se existir
ALTER TABLE public.workout_logs 
DROP CONSTRAINT IF EXISTS workout_logs_status_check;

-- Adicionamos a nova permitindo in_progress
ALTER TABLE public.workout_logs 
ADD CONSTRAINT workout_logs_status_check 
CHECK (status IN ('in_progress', 'completed', 'skipped', 'pending', 'started'));

-- 5. Se houver logs antigos com status 'in_progress' mas que deveriam ser 'completed' 
-- (para limpar a dash se ficou travado)
-- UPDATE public.workout_logs SET status = 'completed' WHERE status = 'in_progress' AND completed_at IS NOT NULL;
