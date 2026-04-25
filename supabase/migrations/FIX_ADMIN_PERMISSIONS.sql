DO $$ 
BEGIN
    -- Profiles: Admins can view all profiles
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admins can view all profiles') THEN
        CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
            (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
        );
    END IF;

    -- Trainer Students: Admins can view all connections
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'trainer_students' AND policyname = 'Admins can view all trainer_students') THEN
        CREATE POLICY "Admins can view all trainer_students" ON public.trainer_students FOR SELECT USING (
            (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
        );
    END IF;

    -- Affiliate Clicks/Commissions/Payouts
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'affiliate_clicks' AND policyname = 'Admins can view all clicks') THEN
        CREATE POLICY "Admins can view all clicks" ON public.affiliate_clicks FOR SELECT USING (
            (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
        );
    END IF;

    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'affiliate_commissions' AND policyname = 'Admins can view all commissions') THEN
        CREATE POLICY "Admins can view all commissions" ON public.affiliate_commissions FOR SELECT USING (
            (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
        );
    END IF;

    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'affiliate_payouts' AND policyname = 'Admins can view all payouts') THEN
        CREATE POLICY "Admins can view all payouts" ON public.affiliate_payouts FOR ALL USING (
            (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
        );
    END IF;

END $$;
