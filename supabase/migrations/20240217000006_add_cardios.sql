-- ====================================================
-- 9. CARDIO MANAGEMENT
-- ====================================================

-- Cardio Library (Trainer's common cardios)
create table cardios (
  id uuid default uuid_generate_v4() primary key,
  trainer_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Assigned Cardios (Specific to student)
create table assigned_cardios (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references profiles(id) on delete cascade not null,
  cardio_id uuid references cardios(id) on delete cascade not null,
  duration_minutes integer not null,
  suggested_intensity text not null,
  day_of_week integer check (day_of_week between 0 and 6),
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Cardio Logs (History and active session persistence)
create table cardio_logs (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references profiles(id) on delete cascade not null,
  assigned_cardio_id uuid references assigned_cardios(id) on delete cascade not null,
  status text check (status in ('in_progress', 'completed', 'abandoned')) default 'in_progress',
  elapsed_seconds integer default 0,
  is_running boolean default false,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  last_heartbeat_at timestamp with time zone default timezone('utc'::text, now()) not null,
  feedback text,
  intensity_used text
);

-- RLS POLICIES
alter table cardios enable row level security;
alter table assigned_cardios enable row level security;
alter table cardio_logs enable row level security;

-- Cardio Library
create policy "Trainer manages own cardio library" on cardios for all using (auth.uid() = trainer_id);
create policy "Student views cardios in their assignments" on cardios for select using (
  exists (
    select 1 from assigned_cardios
    where assigned_cardios.cardio_id = cardios.id
    and assigned_cardios.student_id = auth.uid()
  )
);

-- Assigned Cardios
create policy "Trainer manages cardio assignments" on assigned_cardios for all using (
    exists (select 1 from trainer_students where trainer_id = auth.uid() and student_id = assigned_cardios.student_id)
);
create policy "Student views own cardio assignments" on assigned_cardios for select using (auth.uid() = student_id);

-- Cardio Logs
create policy "Student manages own cardio logs" on cardio_logs for all using (auth.uid() = student_id);
create policy "Trainer views student cardio logs" on cardio_logs for select using (
    exists (
      select 1 from trainer_students 
      where trainer_id = auth.uid() 
      and student_id = cardio_logs.student_id
    )
);

-- Index for performance
create index idx_cardio_logs_student_status on cardio_logs(student_id, status);
create index idx_assigned_cardios_student on assigned_cardios(student_id);
