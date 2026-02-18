-- =============================================================================
-- CONSOLIDADO: Todas as alterações recentes para rodar no Supabase
-- Inclui: app_settings (beta_tester_mode, Gemini, Stripe) + RLS ergogenics aluno
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. APP_SETTINGS: Configurações editáveis pelo BD
--    - beta_tester_mode: quando true, oculta Importar PDF
--    - gemini_api_key, stripe_secret_key: tokens Gemini e Stripe
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS app_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  beta_tester_mode boolean DEFAULT false,
  gemini_api_key text,
  stripe_secret_key text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Garante uma única linha
INSERT INTO app_settings (id, beta_tester_mode, gemini_api_key, stripe_secret_key)
VALUES (1, false, null, null)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage app_settings" ON app_settings;
CREATE POLICY "Admins manage app_settings"
  ON app_settings FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Função para obter beta_tester_mode sem expor as chaves (qualquer autenticado)
CREATE OR REPLACE FUNCTION public.get_beta_tester_mode()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(beta_tester_mode, false) FROM app_settings LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_beta_tester_mode() TO authenticated;

-- -----------------------------------------------------------------------------
-- 2. ERGOGENICS: Alunos podem ver seus próprios protocolos
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Students can view their own ergogenics" ON ergogenics;
CREATE POLICY "Students can view their own ergogenics"
  ON ergogenics FOR SELECT
  USING (student_id = auth.uid());
