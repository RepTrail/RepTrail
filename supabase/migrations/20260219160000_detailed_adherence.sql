
-- Migration for Detailed Adherence Tracking (Diet Items & Daily Stats)
-- Version: 20260219160000

-- 1. Table for individual meal item logs (Checkboxes per item)
CREATE TABLE IF NOT EXISTS public.meal_item_logs (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    meal_item_id uuid REFERENCES public.meal_items(id) ON DELETE CASCADE,
    consumed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_meal_item_logs_user_date ON public.meal_item_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_meal_item_logs_item ON public.meal_item_logs(meal_item_id);

-- Ensure unique log per item per day
ALTER TABLE public.meal_item_logs 
DROP CONSTRAINT IF EXISTS unique_item_log_per_day;

ALTER TABLE public.meal_item_logs 
ADD CONSTRAINT unique_item_log_per_day UNIQUE (user_id, meal_item_id, date);


-- 2. Unified Daily Tracking Table
CREATE TABLE IF NOT EXISTS public.daily_tracking (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    date date DEFAULT CURRENT_DATE NOT NULL,
    
    -- Status Columns
    workout_status text CHECK (workout_status IN ('none', 'assigned', 'completed', 'skipped')) DEFAULT 'none',
    cardio_status text CHECK (cardio_status IN ('none', 'assigned', 'completed', 'skipped')) DEFAULT 'none',
    ergogenics_status text CHECK (ergogenics_status IN ('none', 'assigned', 'completed', 'skipped')) DEFAULT 'none',
    
    diet_percentage numeric(5, 2) DEFAULT 0, -- Calculated from meal_item_logs
    
    execution_score numeric(5, 2) DEFAULT 0, -- Overall daily score
    
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    UNIQUE(user_id, date)
);

-- RLS Policies

ALTER TABLE public.meal_item_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tracking ENABLE ROW LEVEL SECURITY;

-- Meal Item Logs Policies
DROP POLICY IF EXISTS "Users can manage own meal item logs" ON public.meal_item_logs;
CREATE POLICY "Users can manage own meal item logs" ON public.meal_item_logs
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Daily Tracking Policies
DROP POLICY IF EXISTS "Users can view own tracking" ON public.daily_tracking;
CREATE POLICY "Users can view own tracking" ON public.daily_tracking
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own tracking" ON public.daily_tracking;
CREATE POLICY "Users can update own tracking" ON public.daily_tracking
    FOR UPDATE USING (auth.uid() = user_id);
    
DROP POLICY IF EXISTS "Users can insert own tracking" ON public.daily_tracking;
CREATE POLICY "Users can insert own tracking" ON public.daily_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 3. Function to Calculate Diet Percentage for a User/Date
CREATE OR REPLACE FUNCTION public.calculate_daily_diet_percentage(p_user_id uuid, p_date date)
RETURNS numeric AS $$
DECLARE
    v_total_items integer;
    v_completed_items integer;
    v_diet_id uuid;
BEGIN
    -- Get active diet for user
    SELECT diet_id INTO v_diet_id
    FROM public.assigned_diets
    WHERE student_id = p_user_id AND active = true
    LIMIT 1;

    IF v_diet_id IS NULL THEN
        RETURN 0;
    END IF;

    -- Count total items in the diet (sum of items in all meals)
    SELECT count(mi.id) INTO v_total_items
    FROM public.meals m
    JOIN public.meal_items mi ON mi.meal_id = m.id
    WHERE m.diet_id = v_diet_id;

    IF v_total_items = 0 THEN
        RETURN 100; -- Empty diet considered done? Or 0? Let's say 100 to not penalize.
    END IF;

    -- Count completed items for that date
    SELECT count(*) INTO v_completed_items
    FROM public.meal_item_logs mil
    WHERE mil.user_id = p_user_id 
    AND mil.date = p_date
    AND mil.meal_item_id IN (
        SELECT mi.id 
        FROM public.meals m
        JOIN public.meal_items mi ON mi.meal_id = m.id
        WHERE m.diet_id = v_diet_id
    );

    RETURN ROUND((v_completed_items::numeric / v_total_items::numeric) * 100, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. Trigger to update daily_tracking when a meal item is logged
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

DROP TRIGGER IF EXISTS update_diet_tracking ON public.meal_item_logs;
CREATE TRIGGER update_diet_tracking
AFTER INSERT OR DELETE ON public.meal_item_logs
FOR EACH ROW EXECUTE FUNCTION public.update_diet_tracking_trigger();

