-- FIX_ALL.sql - Consolidated Updates for RepTrail
-- Includes: Store System, Product Clicks, Detailed Adherence Tracking, and Fixes

BEGIN;

-- ==========================================
-- 1. STORE & MARKETPLACE (New Features)
-- ==========================================

-- Store Products Table
CREATE TABLE IF NOT EXISTS public.store_products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text CHECK (category IN ('supplement', 'accessory', 'clothing', 'equipment')),
  image_url text,
  link_url text,
  official_price numeric(10, 2),
  rating numeric(3, 2),
  reviews_count integer,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Click Tracking Table
CREATE TABLE IF NOT EXISTS public.product_clicks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.store_products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  clicked_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_clicks ENABLE ROW LEVEL SECURITY;

-- Policies (Safe Create)
DO $$ 
BEGIN
    -- Store Policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'store_products' AND policyname = 'Products are viewable by everyone') THEN
        CREATE POLICY "Products are viewable by everyone" ON public.store_products FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'store_products' AND policyname = 'Admins can manage products') THEN
        CREATE POLICY "Admins can manage products" ON public.store_products FOR ALL USING (
            exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
        );
    END IF;

    -- Clicks Policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'product_clicks' AND policyname = 'Admins can view clicks') THEN
        CREATE POLICY "Admins can view clicks" ON public.product_clicks FOR SELECT USING (
            exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
        );
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'product_clicks' AND policyname = 'Authenticated users can track clicks') THEN
        CREATE POLICY "Authenticated users can track clicks" ON public.product_clicks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;
END $$;


-- ==========================================
-- 2. DETAILED ADHERENCE TRACKING (Diet & Workouts)
-- ==========================================

-- Table for logging individual meal items (Checkboxes)
CREATE TABLE IF NOT EXISTS public.meal_item_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    meal_item_id uuid REFERENCES public.meal_items(id) ON DELETE CASCADE,
    consumed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    UNIQUE(user_id, meal_item_id, date)
);

-- Unified Daily Tracking Table (Summarized Stats)
CREATE TABLE IF NOT EXISTS public.daily_tracking (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    date date DEFAULT CURRENT_DATE NOT NULL,
    
    workout_status text CHECK (workout_status IN ('none', 'assigned', 'completed', 'skipped')) DEFAULT 'none',
    cardio_status text CHECK (cardio_status IN ('none', 'assigned', 'completed', 'skipped')) DEFAULT 'none',
    ergogenics_status text CHECK (ergogenics_status IN ('none', 'assigned', 'completed', 'skipped')) DEFAULT 'none',
    
    diet_percentage numeric(5, 2) DEFAULT 0,
    execution_score numeric(5, 2) DEFAULT 0,
    
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.meal_item_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tracking ENABLE ROW LEVEL SECURITY;

-- Policies (Safe Create)
DO $$ 
BEGIN
    -- Daily Tracking Policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'daily_tracking' AND policyname = 'Users can view own tracking') THEN
        CREATE POLICY "Users can view own tracking" ON public.daily_tracking FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'daily_tracking' AND policyname = 'Users can update own tracking') THEN
        CREATE POLICY "Users can update own tracking" ON public.daily_tracking FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- Meal Item Logs Policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'meal_item_logs' AND policyname = 'Users can manage own meal item logs') THEN
        CREATE POLICY "Users can manage own meal item logs" ON public.meal_item_logs FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;

-- Function to Calculate Diet Percentage dynamically
CREATE OR REPLACE FUNCTION public.calculate_daily_diet_percentage(p_user_id uuid, p_date date)
RETURNS numeric AS $$
DECLARE
    v_total_items integer;
    v_completed_items integer;
    v_diet_id uuid;
BEGIN
    -- Get active diet for user
    SELECT diet_id INTO v_diet_id FROM public.assigned_diets WHERE student_id = p_user_id AND active = true LIMIT 1;
    
    IF v_diet_id IS NULL THEN RETURN 0; END IF;

    -- Count total items in the diet
    SELECT count(mi.id) INTO v_total_items
    FROM public.meals m
    JOIN public.meal_items mi ON mi.meal_id = m.id
    WHERE m.diet_id = v_diet_id;

    IF v_total_items = 0 THEN RETURN 100; END IF;

    -- Count completed items for that date
    SELECT count(*) INTO v_completed_items
    FROM public.meal_item_logs mil
    WHERE mil.user_id = p_user_id AND mil.date = p_date
    AND mil.meal_item_id IN (
        SELECT mi.id FROM public.meals m
        JOIN public.meal_items mi ON mi.meal_id = m.id
        WHERE m.diet_id = v_diet_id
    );

    RETURN ROUND((v_completed_items::numeric / v_total_items::numeric) * 100, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Trigger to update daily_tracking automatically when a meal item is checked
CREATE OR REPLACE FUNCTION public.update_diet_tracking_trigger()
RETURNS trigger AS $$
DECLARE
    v_date date;
    v_user_id uuid;
    v_percentage numeric;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_date := old.date;
        v_user_id := old.user_id;
    ELSE
        v_date := new.date;
        v_user_id := new.user_id;
    END IF;

    -- Calculate new percentage
    v_percentage := public.calculate_daily_diet_percentage(v_user_id, v_date);

    -- Upsert into daily_tracking
    INSERT INTO public.daily_tracking (user_id, date, diet_percentage)
    VALUES (v_user_id, v_date, v_percentage)
    ON CONFLICT (user_id, date) 
    DO UPDATE SET 
        diet_percentage = EXCLUDED.diet_percentage,
        updated_at = now();

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply Trigger
DROP TRIGGER IF EXISTS update_diet_tracking ON public.meal_item_logs;
CREATE TRIGGER update_diet_tracking
AFTER INSERT OR DELETE ON public.meal_item_logs
FOR EACH ROW EXECUTE FUNCTION public.update_diet_tracking_trigger();

COMMIT;
