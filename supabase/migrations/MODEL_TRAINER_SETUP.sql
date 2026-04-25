-- ==========================================================
-- REPTRAIL: COMPLETE MARKETING DEMO DATA (V15 - FINAL CLEANUP)
-- ==========================================================
-- Purpose: Creates a high-performance "Elite Trainer" profile.
-- FIX: Exactly 2 transformations (the real AI ones).
-- ==========================================================

DO $$
DECLARE
    -- Using distinct IDs to avoid collisions
    v_trainer_id  UUID := '00000000-0000-0000-0000-000000001000';
    v_student_id  UUID;
    v_i INTEGER;
    v_fees NUMERIC[] := ARRAY[198.00, 248.00, 285.00, 318.00, 375.00];
    v_fee_val NUMERIC;
    
    v_names TEXT[] := ARRAY[
        'Roberto Camargo', 'Aline Vieira', 'Fernando Diniz', 'Patrícia Machado', 
        'André Guimarães', 'Letícia Soares', 'Ricardo Antunes', 'Camila Pires', 
        'Eduardo Britto', 'Vanessa Lima', 'Sérgio Nogueira', 'Tatiane Rocha', 
        'Marcelo Ramos', 'Daniela Fontes', 'Gustavo Paiva'
    ];
    
    -- Assets
    v_trainer_avatar TEXT := '/demo/trainer.png';
    v_s1_before TEXT := '/demo/s1_before.png';
    v_s1_after  TEXT := '/demo/s1_after.png';
    v_s2_before TEXT := '/demo/s2_before.png';
    v_s2_after  TEXT := '/demo/s2_after.png';

BEGIN
    -- 1. AGGRESSIVE CLEANUP
    DELETE FROM public.trainer_reviews WHERE trainer_id IN (SELECT id FROM public.profiles WHERE trainer_code = 'BRUNO10');
    DELETE FROM public.assigned_workouts WHERE student_id IN (SELECT id FROM public.profiles WHERE email LIKE '%@reptrail.com');
    DELETE FROM public.assigned_diets WHERE student_id IN (SELECT id FROM public.profiles WHERE email LIKE '%@reptrail.com');
    DELETE FROM public.progress_photos WHERE student_id IN (SELECT id FROM public.profiles WHERE email LIKE '%@reptrail.com');
    DELETE FROM public.student_details WHERE id IN (SELECT id FROM public.profiles WHERE email LIKE '%@reptrail.com');
    DELETE FROM public.trainer_students WHERE trainer_id IN (SELECT id FROM public.profiles WHERE trainer_code = 'BRUNO10');
    DELETE FROM public.workouts WHERE trainer_id IN (SELECT id FROM public.profiles WHERE trainer_code = 'BRUNO10');
    DELETE FROM public.diets WHERE trainer_id IN (SELECT id FROM public.profiles WHERE trainer_code = 'BRUNO10');
    
    DELETE FROM public.profiles WHERE trainer_code = 'BRUNO10' OR email LIKE '%@reptrail.com';
    DELETE FROM auth.users WHERE email = 'coach_bruno@reptrail.com' OR email LIKE 'student_%@reptrail.com';

    -- 2. CREATE COACH IN AUTH
    INSERT INTO auth.users (id, email, aud, role, email_confirmed_at, encrypted_password, raw_app_meta_data, raw_user_meta_data)
    VALUES (
        v_trainer_id, 
        'coach_bruno@reptrail.com', 
        'authenticated', 
        'authenticated', 
        NOW(), 
        crypt('password123', gen_salt('bf')),
        '{"provider": "email", "providers": ["email"]}', 
        '{"full_name": "Coach Bruno Santos", "role": "trainer"}'
    ) ON CONFLICT (id) DO NOTHING;

    -- 3. CREATE COACH IN PROFILE
    INSERT INTO public.profiles (
        id, email, full_name, role, trainer_code, plan_tier, specialties, 
        is_verified, rating, bio, avatar_url, location, cref, instagram
    )
    VALUES (
        v_trainer_id, 
        'coach_bruno@reptrail.com', 
        'Coach Bruno Santos (Elite)', 
        'trainer', 
        'BRUNO10', 
        'elite', 
        ARRAY['Performance Masculina', 'Redução de Gordura', 'Treino de Força'], 
        true, 
        4.98, 
        'Especialista em transformação física acelerada com metodologia baseada em ciência e acompanhamento diário.',
        v_trainer_avatar,
        'Alphaville, SP',
        '987654-G/SP',
        'coach_bruno_elite'
    ) ON CONFLICT (id) DO UPDATE SET
        trainer_code = 'BRUNO10',
        full_name = EXCLUDED.full_name,
        role = 'trainer',
        plan_tier = 'elite',
        bio = EXCLUDED.bio,
        avatar_url = EXCLUDED.avatar_url;

    -- 4. CREATE 15 STUDENTS
    FOR v_i IN 1..15 LOOP
        v_student_id := ('00000000-0000-0000-0000-000000002' || LPAD(v_i::text, 3, '0'))::UUID;
        
        INSERT INTO auth.users (id, email, aud, role, email_confirmed_at, encrypted_password, raw_app_meta_data, raw_user_meta_data)
        VALUES (
            v_student_id, 
            'student_' || v_i || '@reptrail.com', 
            'authenticated', 
            'authenticated', 
            NOW(), 
            crypt('password123', gen_salt('bf')),
            '{"provider": "email", "providers": ["email"]}', 
            jsonb_build_object('full_name', v_names[v_i], 'role', 'student')
        ) ON CONFLICT (id) DO NOTHING;

        INSERT INTO public.profiles (id, email, full_name, role, created_at, avatar_url)
        VALUES (
            v_student_id, 
            'student_' || v_i || '@reptrail.com', 
            v_names[v_i], 
            'student',
            NOW() - (v_i || ' months')::interval,
            'https://i.pravatar.cc/150?u=' || v_student_id
        ) ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            role = 'student';

        -- Details
        INSERT INTO public.student_details (id, goal, activity_level)
        VALUES (v_student_id, 'Body Transformation', 'active') ON CONFLICT (id) DO NOTHING;

        -- Link
        v_fee_val := v_fees[(v_i % 5) + 1];
        INSERT INTO public.trainer_students (trainer_id, student_id, monthly_fee, payment_day, active, billing_source, created_at)
        VALUES (v_trainer_id, v_student_id, v_fee_val, (v_i % 28) + 1, true, 'marketplace', NOW() - (v_i || ' months')::interval)
        ON CONFLICT (trainer_id, student_id) DO UPDATE SET monthly_fee = EXCLUDED.monthly_fee;

        -- 5. REVIEWS
        IF v_i <= 5 THEN
            INSERT INTO public.trainer_reviews (student_id, trainer_id, rating, comment, created_at)
            VALUES (
                v_student_id, 
                v_trainer_id, 
                5, 
                CASE 
                    WHEN v_i = 1 THEN 'O Bruno mudou meu jogo. O acompanhamento dele pelo app é surreal, parece que ele tá do lado no treino.'
                    WHEN v_i = 2 THEN 'Melhor personal que já tive. Super técnico e a plataforma que ele usa facilita demais seguir a dieta.'
                    WHEN v_i = 3 THEN 'A atenção aos detalhes do Bruno é o diferencial. Consigo reportar minhas cargas e ele ajusta tudo na hora.'
                    WHEN v_i = 4 THEN 'Resultados que nunca tive sozinho. O Bruno simplifica a rotina e o suporte dele não tem igual.'
                    ELSE 'Treinador de elite! A praticidade de ter o protocolo dele na palma da mão me fez não errar mais.'
                END,
                NOW() - (v_i || ' days')::interval
            ) ON CONFLICT (student_id, trainer_id) DO UPDATE SET comment = EXCLUDED.comment;
        END IF;

        -- 6. TRANSFORMATIONS (Exactly 2 pairs - Roberto and Aline)
        IF v_i = 1 THEN
            INSERT INTO public.progress_photos (student_id, front_url, created_at, is_private)
            VALUES (v_student_id, v_s1_before, NOW() - '5 months'::interval, false);
            INSERT INTO public.progress_photos (student_id, front_url, created_at, is_private)
            VALUES (v_student_id, v_s1_after, NOW() - '1 day'::interval, false);
        ELSIF v_i = 2 THEN
            INSERT INTO public.progress_photos (student_id, front_url, created_at, is_private)
            VALUES (v_student_id, v_s2_before, NOW() - '4 months'::interval, false);
            INSERT INTO public.progress_photos (student_id, front_url, created_at, is_private)
            VALUES (v_student_id, v_s2_after, NOW() - '1 day'::interval, false);
        END IF;
    END LOOP;

    -- 7. CONTENT
    INSERT INTO public.workouts (id, trainer_id, name, description)
    VALUES ('00000000-0000-0000-0000-00000000000C', v_trainer_id, 'Protocolo Alpha A1', 'Foco em força bruta.')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.assigned_workouts (student_id, workout_id, day_of_week)
    SELECT id, '00000000-0000-0000-0000-00000000000C', 1 FROM public.profiles WHERE email LIKE 'student_%@reptrail.com'
    ON CONFLICT DO NOTHING;

    INSERT INTO public.diets (id, trainer_id, name)
    VALUES ('00000000-0000-0000-0000-00000000000D', v_trainer_id, 'Plano Alimentar Elite')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.assigned_diets (student_id, diet_id)
    SELECT id, '00000000-0000-0000-0000-00000000000D' FROM public.profiles WHERE email LIKE 'student_%@reptrail.com'
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'SUCCESS: V15 Final Cleanup - 2 Transformations only!';
END $$;
