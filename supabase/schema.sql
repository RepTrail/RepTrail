-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Public user data)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text check (role in ('trainer', 'student')) not null,
  
  trainer_code text unique, -- Unique code for invites (e.g., "TRAINER123")
  stripe_account_id text, -- For Stripe Connect
  bio text,
  whatsapp text, -- WhatsApp number
  plan_tier text check (plan_tier in ('start', 'pro', 'elite')) default 'start',
  specialties text[], -- Array of strings
  rating numeric(3, 2) default 0,
  is_verified boolean default false,
  last_seen_at timestamp with time zone,
  cref text, -- Professional ID
  location text, -- City/State or specific gym

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- STUDENT SENSITIVE DETAILS (Onboarding)
create table student_details (
  id uuid references profiles(id) on delete cascade not null primary key,
  birth_date date,
  height numeric(5, 2), -- cm
  starting_weight numeric(5, 2), -- kg
  body_fat numeric(5, 2), -- %
  activity_level text check (activity_level in ('sedentary', 'light', 'moderate', 'active', 'athlete')),
  goal text, -- hypertrophy, weight_loss, etc.
  steroid_use boolean default false, -- Sensitive!
  observations text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- TRAINER STUDENTS LINK
create table trainer_students (
  id uuid default uuid_generate_v4() primary key,
  trainer_id uuid references profiles(id) on delete cascade not null,
  student_id uuid references profiles(id) on delete cascade not null,
  
  billing_source text check (billing_source in ('marketplace', 'external', 'manual')) not null default 'marketplace',
  monthly_fee numeric(10, 2) default 0,
  payment_day integer check (payment_day >= 1 and payment_day <= 31),
  active boolean default true,
  
  plan_tier text check (plan_tier in ('start', 'pro', 'elite')) default 'start',
  last_payment_date timestamp with time zone,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(trainer_id, student_id)
);

-- INVITES / TRAINER CODES
create table invites (
  id uuid default uuid_generate_v4() primary key,
  trainer_id uuid references profiles(id) on delete cascade not null,
  code text unique not null,
  usage_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PDF ENGINE: UPLOADS
create table pdf_uploads (
  id uuid default uuid_generate_v4() primary key,
  uploader_id uuid references profiles(id) on delete cascade not null, -- Trainer (usually) or Student
  file_url text not null,
  original_filename text,
  status text check (status in ('pending', 'processing', 'completed', 'failed')) default 'pending',
  type text check (type in ('workout', 'diet')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PDF ENGINE: PARSED STRUCTURES (Temp storage before confirmation)
create table parsed_structures (
  id uuid default uuid_generate_v4() primary key,
  pdf_upload_id uuid references pdf_uploads(id) on delete cascade not null,
  json_content jsonb not null, -- The AI output
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- EXERCISES (Library)
create table exercises (
  id uuid default uuid_generate_v4() primary key,
  trainer_id uuid references profiles(id) on delete cascade, -- Nullable if system default
  name text unique not null,
  video_url text,
  muscle_group text,
  description text,
  is_system_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- WORKOUT PLANS
create table workouts (
  id uuid default uuid_generate_v4() primary key,
  trainer_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- WORKOUT EXERCISES
create table workout_exercises (
  id uuid default uuid_generate_v4() primary key,
  workout_id uuid references workouts(id) on delete cascade not null,
  exercise_id uuid references exercises(id) on delete cascade not null,
  order_index integer not null,
  warmup_sets integer default 0,
  warmup_reps text default '12-15',
  warmup_rest_seconds integer default 45,
  feeder_sets integer default 0,
  feeder_reps text default '6-8',
  feeder_rest_seconds integer default 60,
  working_sets integer default 3,
  reps text default '10-12', -- working reps
  rest_seconds integer default 60, -- working rest
  notes text
);

-- ASSIGNED WORKOUTS (Schedule)
create table assigned_workouts (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references profiles(id) on delete cascade not null,
  workout_id uuid references workouts(id) on delete cascade not null,
  day_of_week integer check (day_of_week between 0 and 6),
  active boolean default true
);

-- DIET PLANS
create table diets (
  id uuid default uuid_generate_v4() primary key,
  trainer_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table meals (
  id uuid default uuid_generate_v4() primary key,
  diet_id uuid references diets(id) on delete cascade not null,
  name text not null,
  time_of_day time,
  order_index integer not null,
  notes text
);

create table meal_items (
  id uuid default uuid_generate_v4() primary key,
  meal_id uuid references meals(id) on delete cascade not null,
  food_name text not null,
  quantity text,
  approx_measure text, -- e.g. "2 colheres de sopa"
  protein numeric(6,1) default 0,
  carbs numeric(6,1) default 0,
  fat numeric(6,1) default 0,
  calories integer,
  macros jsonb
);

create table assigned_diets (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references profiles(id) on delete cascade not null,
  diet_id uuid references diets(id) on delete cascade not null,
  active boolean default true
);

-- PROGRESS: WORKOUT LOGS
create table workout_logs (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references profiles(id) on delete cascade not null,
  workout_id uuid references workouts(id) on delete set null,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  status text check (status in ('in_progress', 'completed', 'abandoned')) default 'in_progress'
);

-- PROGRESS: LOAD HISTORY (Manual input per exercise)
create table load_history (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references profiles(id) on delete cascade not null,
  exercise_id uuid references exercises(id) on delete cascade not null,
  workout_log_id uuid references workout_logs(id) on delete set null,
  weight_kg numeric(6, 2) not null,
  reps_performed integer,
  recorded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROGRESS: MEAL LOGS
create table meal_logs (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references profiles(id) on delete cascade not null,
  meal_id uuid references meals(id) on delete cascade not null,
  check_status boolean default true,
  consumed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROGRESS: WEIGHT HISTORY
create table weight_history (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references profiles(id) on delete cascade not null,
  weight_kg numeric(5, 2) not null,
  photo_url text, -- Optional progress photo with weigh-in
  recorded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROGRESS: PHOTOS (Dedicated)
create table progress_photos (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references profiles(id) on delete cascade not null,
  front_url text,
  back_url text,
  side_right_url text,
  side_left_url text,
  is_private boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Simplified for initial dev)
alter table exercises enable row level security;
create policy "Trainers see own exercises" on exercises for select using (auth.uid() = trainer_id or is_system_default = true);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, full_name, avatar_url, whatsapp, plan_tier)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'whatsapp',
    coalesce(new.raw_user_meta_data->>'plan_tier', 'start')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- STORAGE BUCKET (PDFs)
insert into storage.buckets (id, name, public) 
values ('pdfs', 'pdfs', true)
on conflict (id) do nothing;

create policy "Authenticated users can upload pdfs" 
on storage.objects for insert 
to authenticated 
with check (bucket_id = 'pdfs');

create policy "Authenticated users can view pdfs" 
on storage.objects for select
to authenticated 
using (bucket_id = 'pdfs');
