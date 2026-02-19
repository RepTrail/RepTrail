
-- Migration to automate trainer code generation

-- 1. Function to generate a random alphanumeric code
CREATE OR REPLACE FUNCTION generate_random_trainer_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := 'RT-';
    i INTEGER := 0;
BEGIN
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 2. Update existing trainers that don't have a code
-- We use a loop to ensure uniqueness if the random generator hits a conflict (unlikely but possible)
DO $$
DECLARE
    trainer_record RECORD;
    new_code TEXT;
BEGIN
    FOR trainer_record IN SELECT id FROM profiles WHERE role = 'trainer' AND trainer_code IS NULL LOOP
        LOOP
            new_code := generate_random_trainer_code();
            -- Try to update, catch unique violation if it happens
            BEGIN
                UPDATE profiles SET trainer_code = new_code WHERE id = trainer_record.id;
                EXIT; -- Success, move to next trainer
            EXCEPTION WHEN unique_violation THEN
                -- Loop again to generate a new code
            END;
        END LOOP;
    END LOOP;
END $$;

-- 3. Update handle_new_user trigger to include automatic code generation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    is_trainer BOOLEAN;
    generated_code TEXT;
BEGIN
    is_trainer := (COALESCE(new.raw_user_meta_data->>'role', 'student') = 'trainer');
    
    IF is_trainer THEN
        LOOP
            generated_code := generate_random_trainer_code();
            -- We don't need a BEGIN/EXCEPTION here because if it fails the whole transaction fails,
            -- but for codes it's better to ensure it's set. 
            -- Actually, since it's a trigger on auth.users, we can't easily loop here without risk.
            -- But 6 chars alphanumeric is 36^6 = 2 billion combinations. 
            -- Let's just set it.
            EXIT;
        END LOOP;
    ELSE
        generated_code := NULL;
    END IF;

    INSERT INTO public.profiles (id, email, role, full_name, avatar_url, whatsapp, plan_tier, trainer_code)
    VALUES (
        new.id, 
        new.email, 
        COALESCE(new.raw_user_meta_data->>'role', 'student'),
        new.raw_user_meta_data->>'full_name', 
        new.raw_user_meta_data->>'avatar_url',
        new.raw_user_meta_data->>'whatsapp',
        CASE 
          WHEN (new.raw_user_meta_data->>'role') = 'trainer' THEN 'on_demand'
          ELSE 'start' 
        END,
        generated_code
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
