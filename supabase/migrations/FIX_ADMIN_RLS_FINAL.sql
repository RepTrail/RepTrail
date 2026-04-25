-- FIX_ADMIN_RLS_FINAL.sql

-- 1. Create a secure function to check admin status
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update Policies in a transaction
BEGIN;

-- Profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
    public.check_is_admin()
);

-- Trainer Students
DROP POLICY IF EXISTS "Admins can view all trainer_students" ON public.trainer_students;
CREATE POLICY "Admins can view all trainer_students" ON public.trainer_students FOR SELECT USING (
    public.check_is_admin()
);

-- Affiliate Clicks
DROP POLICY IF EXISTS "Admins can view all clicks" ON public.affiliate_clicks;
CREATE POLICY "Admins can view all clicks" ON public.affiliate_clicks FOR SELECT USING (
    public.check_is_admin()
);

-- Affiliate Commissions
DROP POLICY IF EXISTS "Admins can view all commissions" ON public.affiliate_commissions;
CREATE POLICY "Admins can view all commissions" ON public.affiliate_commissions FOR SELECT USING (
    public.check_is_admin()
);

-- Affiliate Payouts
DROP POLICY IF EXISTS "Admins can view all payouts" ON public.affiliate_payouts;
CREATE POLICY "Admins can view all payouts" ON public.affiliate_payouts FOR ALL USING (
    public.check_is_admin()
);

-- Product Clicks
DROP POLICY IF EXISTS "Admins can view clicks" ON public.product_clicks;
CREATE POLICY "Admins can view clicks" ON public.product_clicks FOR SELECT USING (
    public.check_is_admin()
);

COMMIT;
