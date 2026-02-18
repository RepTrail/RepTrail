-- BF HISTORY
create table if not exists bf_history (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references profiles(id) on delete cascade not null,
  bf_percentage numeric(5, 2) not null,
  recorded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table bf_history enable row level security;

-- Deletar políticas se existirem para evitar erro 42710
drop policy if exists "Users can view their own bf history." on bf_history;
drop policy if exists "Trainers can view their students' bf history." on bf_history;
drop policy if exists "Trainers can insert bf history for their students." on bf_history;

-- Recriar as políticas para BF
create policy "Users can view their own bf history." on bf_history for select using (auth.uid() = student_id);
create policy "Trainers can view their students' bf history." on bf_history for select using (is_trainer_of(student_id));
create policy "Trainers can insert bf history for their students." on bf_history for insert with check (is_trainer_of(student_id));

-- ADICIONAR PERMISSÃO DE INSERT PARA O TRAINER NO PESO (faltava isso!)
drop policy if exists "Trainer can insert student weight history" on weight_history;
create policy "Trainer can insert student weight history" on weight_history for insert with check (is_trainer_of(student_id));
