-- RODE ESTE SCRIPT NO SQL EDITOR DO SUPABASE PARA CORRIGIR O WHATSAPP
-- 1. Garante que a coluna 'whatsapp' existe na tabela 'profiles'
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='whatsapp') THEN
        ALTER TABLE profiles ADD COLUMN whatsapp text;
    END IF;
END $$;

-- 2. Atualiza a função de gatilho para mapear corretamente os metadados do Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name, avatar_url, whatsapp, plan_tier)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'whatsapp',
    COALESCE(new.raw_user_meta_data->>'plan_tier', 'start')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Garante que as políticas de RLS permitem atualização para o próprio usuário
-- (Se já existirem, elas permanecem as mesmas, mas é bom garantir)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Users can update own profile.'
    ) THEN
        CREATE POLICY "Users can update own profile." ON profiles 
        FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;

-- 4. Notifica o PostgREST para recarregar o esquema (opcional mas recomendado)
NOTIFY pgrst, 'reload schema';
