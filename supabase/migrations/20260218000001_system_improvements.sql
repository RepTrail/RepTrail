-- Migration to add image authorization and ergogenics module

-- 1. Add image_publication_authorized to student_details
ALTER TABLE student_details 
ADD COLUMN IF NOT EXISTS image_publication_authorized boolean DEFAULT false;

-- 2. Create ergogenics table
CREATE TABLE IF NOT EXISTS ergogenics (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    trainer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    dosage text,
    weekly_dosage numeric(10, 2),
    unit text CHECK (unit IN ('ml', 'mg')),
    application_days integer[],
    frequency text,
    notes text,
    start_date date NOT NULL,
    end_date date,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure columns exist
ALTER TABLE ergogenics ADD COLUMN IF NOT EXISTS trainer_id uuid REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE ergogenics ADD COLUMN IF NOT EXISTS weekly_dosage numeric(10, 2);
ALTER TABLE ergogenics ADD COLUMN IF NOT EXISTS unit text CHECK (unit IN ('ml', 'mg'));
ALTER TABLE ergogenics ADD COLUMN IF NOT EXISTS application_days integer[];

ALTER TABLE ergogenics ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Trainers can manage ergogenics for their students" ON ergogenics;
    CREATE POLICY "Trainers can manage ergogenics for their students" 
    ON ergogenics FOR ALL 
    USING (auth.uid() = trainer_id);
EXCEPTION WHEN others THEN NULL;
END $$;

-- 3. Create ergogenic_logs table
CREATE TABLE IF NOT EXISTS ergogenic_logs (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    ergogenic_id uuid REFERENCES ergogenics(id) ON DELETE CASCADE NOT NULL,
    student_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE ergogenic_logs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Students can manage their own logs" ON ergogenic_logs;
    CREATE POLICY "Students can manage their own logs" 
    ON ergogenic_logs FOR ALL 
    USING (auth.uid() = student_id);

    DROP POLICY IF EXISTS "Trainers can view their students logs" ON ergogenic_logs;
    CREATE POLICY "Trainers can view their students logs" 
    ON ergogenic_logs FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM ergogenics e 
        WHERE e.id = ergogenic_id AND e.trainer_id = auth.uid()
    ));
EXCEPTION WHEN others THEN NULL;
END $$;

-- RLS Policies are already defined inside DO blocks above for robustness

-- 7. Update profiles table for Trainer Paywall
-- Add 'none' to plan_tier check constraint
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_plan_tier_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_plan_tier_check 
CHECK (plan_tier IN ('none', 'start', 'pro', 'elite'));

-- Set default plan_tier to 'none'
ALTER TABLE profiles 
ALTER COLUMN plan_tier SET DEFAULT 'none';

-- 8. Update trainer_students table to allow 'none' if needed (though usually they have a plan to have students)
ALTER TABLE trainer_students 
DROP CONSTRAINT IF EXISTS trainer_students_plan_tier_check;

ALTER TABLE trainer_students 
ADD CONSTRAINT trainer_students_plan_tier_check 
CHECK (plan_tier IN ('none', 'start', 'pro', 'elite'));

ALTER TABLE trainer_students 
ALTER COLUMN plan_tier SET DEFAULT 'none';

-- 9. Update handle_new_user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name, avatar_url, whatsapp, plan_tier)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'whatsapp',
    CASE 
      WHEN (new.raw_user_meta_data->>'role') = 'trainer' THEN 'none'
      ELSE 'start' -- Students usually don't have plans, but 'start' is their baseline
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
