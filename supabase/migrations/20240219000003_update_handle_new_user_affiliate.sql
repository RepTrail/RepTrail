-- Update handle_new_user to include referral tracking

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    is_trainer BOOLEAN;
    generated_code TEXT;
    v_referred_by_id UUID;
    v_is_affiliate BOOLEAN;
    v_affiliate_token TEXT;
BEGIN
    is_trainer := (COALESCE(new.raw_user_meta_data->>'role', 'student') = 'trainer');
    v_referred_by_id := NULL;
    
    -- Try to parse referred_by_id if provided
    IF new.raw_user_meta_data->>'referred_by_id' IS NOT NULL THEN
        BEGIN
            v_referred_by_id := (new.raw_user_meta_data->>'referred_by_id')::UUID;
        EXCEPTION WHEN others THEN
            v_referred_by_id := NULL;
        END;
    END IF;

    v_is_affiliate := COALESCE((new.raw_user_meta_data->>'is_affiliate')::BOOLEAN, false);
    
    IF is_trainer THEN
        generated_code := generate_random_trainer_code();
    ELSE
        generated_code := NULL;
    END IF;

    -- If the user is registering as an affiliate, generate a token
    IF v_is_affiliate THEN
        v_affiliate_token := generate_random_token();
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
        is_affiliate,
        affiliate_token
    )
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
        generated_code,
        v_referred_by_id,
        v_is_affiliate,
        v_affiliate_token
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
