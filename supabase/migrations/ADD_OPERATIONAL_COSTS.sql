-- Create operational_costs table
CREATE TABLE IF NOT EXISTS public.operational_costs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    description text NOT NULL,
    amount numeric(10, 2) NOT NULL,
    type text CHECK (type IN ('fixed', 'variable')) NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    admin_id uuid REFERENCES public.profiles(id)
);

-- Enable RLS
ALTER TABLE public.operational_costs ENABLE ROW LEVEL SECURITY;

-- Policy for Admins (using the secure function we created earlier)
DROP POLICY IF EXISTS "Admins can manage costs" ON public.operational_costs;
CREATE POLICY "Admins can manage costs" ON public.operational_costs FOR ALL USING (
    public.check_is_admin()
);
