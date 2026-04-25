-- RODE ESTE SCRIPT NO SQL EDITOR DO SUPABASE PARA CORRIGIR O ERRO DE COLUNA
-- Isso vai converter o sistema de dias de uma coluna simples para um array de dias

-- 1. Se a coluna antiga 'day_of_week' existe, remova ela (ou renomeie se quiser manter dados, mas como estamos refatorando, é melhor limpar)
ALTER TABLE assigned_cardios DROP COLUMN IF EXISTS day_of_week;

-- 2. Adicione a nova coluna 'days_of_week' como array de inteiros
ALTER TABLE assigned_cardios ADD COLUMN IF NOT EXISTS days_of_week integer[];

-- Tip: Se o erro persistir, pode ser necessário recarregar o cache do PostgREST.
-- Geralmente o Supabase faz isso sozinho ao rodar comandos DDL, 
-- mas se não fizer, você pode rodar:
-- NOTIFY pgrst, 'reload schema';
