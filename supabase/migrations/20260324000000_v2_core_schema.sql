-- RepTrail V2: Core Schema Migration
-- Consolidates Workout, Diet, and Progression structures

-- 1. PROFILES (Public User Data)
-- Extends/Standardizes the existing profiles table for V2
CREATE TABLE IF NOT EXISTS v2_profiles (
    id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    full_name text NOT NULL,
    email text UNIQUE NOT NULL,
    role text CHECK (role IN ('trainer', 'student')) NOT NULL DEFAULT 'student',
    avatar_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. WORKOUTS
CREATE TABLE IF NOT EXISTS v2_workouts (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES v2_profiles(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. EXERCISE BLOCKS (Exercises within a workout)
CREATE TABLE IF NOT EXISTS v2_exercise_blocks (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    workout_id uuid REFERENCES v2_workouts(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL, -- Name of the exercise (e.g., "Leg Press")
    order_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SERIES (Sets within an exercise block)
CREATE TABLE IF NOT EXISTS v2_exercise_series (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    exercise_block_id uuid REFERENCES v2_exercise_blocks(id) ON DELETE CASCADE NOT NULL,
    type text CHECK (type IN ('fixed', 'amrap', 'dropset')) NOT NULL DEFAULT 'fixed',
    reps integer NOT NULL DEFAULT 10,
    weight numeric(6, 2),
    order_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. USER STATS (Body tracking)
CREATE TABLE IF NOT EXISTS v2_user_stats (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES v2_profiles(id) ON DELETE CASCADE NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    weight numeric(5, 2),
    body_fat numeric(5, 2),
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. PERSONAL RECORDS (PRS)
CREATE TABLE IF NOT EXISTS v2_personal_records (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES v2_profiles(id) ON DELETE CASCADE NOT NULL,
    exercise_name text NOT NULL, -- Indexable for lookup
    series_id uuid REFERENCES v2_exercise_series(id) ON DELETE SET NULL,
    max_weight numeric(6, 2) NOT NULL,
    estimated_1rm numeric(6, 2),
    date_achieved timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, exercise_name)
);

-- 7. DIET PLANS
CREATE TABLE IF NOT EXISTS v2_diet_plans (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    trainer_id uuid REFERENCES v2_profiles(id) ON DELETE SET NULL, -- Null if student created
    user_id uuid REFERENCES v2_profiles(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. MEALS
CREATE TABLE IF NOT EXISTS v2_meals (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    diet_plan_id uuid REFERENCES v2_diet_plans(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    order_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. MEAL ITEMS (Foods)
CREATE TABLE IF NOT EXISTS v2_meal_items (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    meal_id uuid REFERENCES v2_meals(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    calories integer DEFAULT 0,
    protein numeric(6, 2) DEFAULT 0,
    carbs numeric(6, 2) DEFAULT 0,
    fats numeric(6, 2) DEFAULT 0,
    order_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS POLICIES
ALTER TABLE v2_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2_exercise_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2_exercise_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2_user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2_personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2_diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2_meal_items ENABLE ROW LEVEL SECURITY;

-- Simple RLS: Owners can manage their own data
CREATE POLICY "Users can manage their own V2 profile" ON v2_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage their own V2 workouts" ON v2_workouts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own V2 stats" ON v2_user_stats FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own PRs" ON v2_personal_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own V2 diet plans" ON v2_diet_plans FOR ALL USING (auth.uid() = user_id);

-- Blocks/Series/Meals/Items follow parent table permissions via subqueries or simpler:
CREATE POLICY "Workout owners can manage blocks" ON v2_exercise_blocks FOR ALL 
USING (EXISTS (SELECT 1 FROM v2_workouts w WHERE w.id = workout_id AND w.user_id = auth.uid()));

CREATE POLICY "Workout owners can manage series" ON v2_exercise_series FOR ALL 
USING (EXISTS (
    SELECT 1 FROM v2_exercise_blocks eb 
    JOIN v2_workouts w ON eb.workout_id = w.id 
    WHERE eb.id = exercise_block_id AND w.user_id = auth.uid()
));

CREATE POLICY "Diet owners can manage meals" ON v2_meals FOR ALL 
USING (EXISTS (SELECT 1 FROM v2_diet_plans d WHERE d.id = diet_plan_id AND d.user_id = auth.uid()));

CREATE POLICY "Diet owners can manage meal items" ON v2_meal_items FOR ALL 
USING (EXISTS (
    SELECT 1 FROM v2_meals m 
    JOIN v2_diet_plans d ON m.diet_plan_id = d.id 
    WHERE m.id = meal_id AND d.user_id = auth.uid()
));
