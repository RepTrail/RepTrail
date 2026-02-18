-- 1. Fix load_history foreign key to cascade delete
alter table load_history 
drop constraint if exists load_history_workout_log_id_fkey,
add constraint load_history_workout_log_id_fkey 
  foreign key (workout_log_id) 
  references workout_logs(id) 
  on delete cascade;

-- 2. Update workout_logs RLS to allow trainers to manage student logs
drop policy if exists "Trainer views student workout logs" on workout_logs;
create policy "Trainer manages student workout logs" 
on workout_logs for all 
using (is_trainer_of(student_id));

-- 3. Update load_history RLS to allow trainers to manage student loads
drop policy if exists "Trainer views student load history" on load_history;
create policy "Trainer manages student load history" 
on load_history for all 
using (is_trainer_of(student_id));
