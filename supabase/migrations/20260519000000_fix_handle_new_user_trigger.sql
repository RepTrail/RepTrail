-- Fix handle_new_user: ensure trigger and function are correctly set up
-- This migration ensures the trigger fires on auth.users INSERT and
-- correctly seeds the profiles table with all required data.

-- 0. Ensure required columns exist BEFORE recreating the function
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan_tier text DEFAULT 'on_demand';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by_id uuid;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_affiliate boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS affiliate_token text UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trainer_code text UNIQUE;

-- 1. Recreate the function — inline code generation, no external function dependency
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    v_role TEXT;
    v_is_trainer BOOLEAN;
    v_trainer_code TEXT;
    v_referred_by_id UUID;
    v_is_affiliate BOOLEAN;
BEGIN
    -- Wrap everything so the trigger NEVER blocks user creation
    BEGIN
        v_role := COALESCE(new.raw_user_meta_data->>'role', 'student');
        v_is_trainer := (v_role = 'trainer');
        v_is_affiliate := COALESCE((new.raw_user_meta_data->>'is_affiliate')::BOOLEAN, false);
        v_referred_by_id := NULL;

        -- Parse referred_by_id safely
        IF new.raw_user_meta_data->>'referred_by_id' IS NOT NULL THEN
            BEGIN
                v_referred_by_id := (new.raw_user_meta_data->>'referred_by_id')::UUID;
            EXCEPTION WHEN others THEN
                v_referred_by_id := NULL;
            END;
        END IF;

        -- Generate unique trainer code inline
        IF v_is_trainer THEN
            LOOP
                v_trainer_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 6));
                EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE trainer_code = v_trainer_code);
            END LOOP;
        ELSE
            v_trainer_code := NULL;
        END IF;

        INSERT INTO public.profiles (
            id,
            email,
            role,
            full_name,
            avatar_url,
            whatsapp,
            plan_tier,
            trainer_code,
            referred_by_id,
            is_affiliate
        )
        VALUES (
            new.id,
            new.email,
            v_role,
            new.raw_user_meta_data->>'full_name',
            new.raw_user_meta_data->>'avatar_url',
            new.raw_user_meta_data->>'whatsapp',
            'on_demand',
            v_trainer_code,
            v_referred_by_id,
            v_is_affiliate
        )
        ON CONFLICT (id) DO UPDATE SET
            email        = COALESCE(EXCLUDED.email, profiles.email),
            full_name    = COALESCE(EXCLUDED.full_name, profiles.full_name),
            role         = COALESCE(EXCLUDED.role, profiles.role),
            whatsapp     = COALESCE(EXCLUDED.whatsapp, profiles.whatsapp),
            plan_tier    = COALESCE(profiles.plan_tier, EXCLUDED.plan_tier),
            trainer_code = COALESCE(profiles.trainer_code, EXCLUDED.trainer_code);

    EXCEPTION WHEN OTHERS THEN
        -- Log the error but NEVER block user creation
        RAISE WARNING 'handle_new_user failed for %: %', new.id, SQLERRM;
    END;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Grant necessary permissions
GRANT INSERT, UPDATE ON public.profiles TO postgres, anon, authenticated, service_role;


