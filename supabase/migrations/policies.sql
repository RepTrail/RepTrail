
-- HELPER FUNCTION: Check if user is the trainer of a specific student
create or replace function is_trainer_of(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from trainer_students
    where trainer_id = auth.uid()
    and student_id = user_id
  );
end;
$$ language plpgsql security definer;

-- ====================================================
-- 1. STUDENT DETAILS
-- ====================================================
alter table student_details enable row level security;

create policy "Student can view/edit own details"
on student_details for all
using (auth.uid() = id);

create policy "Trainer can manage linked student details"
on student_details for all
using (is_trainer_of(id));

-- ====================================================
-- 2. TRAINER STUDENTS (The Link)
-- ====================================================
alter table trainer_students enable row level security;

create policy "Trainer has full access to their student links"
on trainer_students for all
using (auth.uid() = trainer_id);

create policy "Student can view their own link"
on trainer_students for select
using (auth.uid() = student_id);

create policy "Student can link themselves to trainer"
on trainer_students for insert
with check (auth.uid() = student_id);

create policy "Public can view student links"
on trainer_students for select
using (true);

-- ====================================================
-- 3. INVITES
-- ====================================================
alter table invites enable row level security;

create policy "Trainer can manage own invites"
on invites for all
using (auth.uid() = trainer_id);

create policy "Public can view invites by code (for signup)"
on invites for select
using (true);

-- ====================================================
-- 4. PDF ENGINE & PARSING
-- ====================================================
alter table pdf_uploads enable row level security;
alter table parsed_structures enable row level security;

create policy "Users manage their own uploads"
on pdf_uploads for all
using (auth.uid() = uploader_id);

create policy "Users manage own parsed structures"
on parsed_structures for all
using (
  exists (
    select 1 from pdf_uploads
    where pdf_uploads.id = parsed_structures.pdf_upload_id
    and pdf_uploads.uploader_id = auth.uid()
  )
);

-- ====================================================
-- 5. WORKOUT LIBRARY & EXERCISES
-- ====================================================
alter table workouts enable row level security;
alter table workout_exercises enable row level security;
-- Exercises already enabled in schema.sql, adding policies for workouts

-- FIX: Add missing modification policies for exercises
create policy "Trainer can insert own exercises"
on exercises for insert
with check (auth.uid() = trainer_id);

create policy "Trainer can update own exercises"
on exercises for update
using (auth.uid() = trainer_id);

create policy "Trainer can delete own exercises"
on exercises for delete
using (auth.uid() = trainer_id);

create policy "Trainer manages own workouts"
on workouts for all
using (auth.uid() = trainer_id);

create policy "Trainer manages own workout exercises"
on workout_exercises for all
using (
  exists (
    select 1 from workouts
    where workouts.id = workout_exercises.workout_id
    and workouts.trainer_id = auth.uid()
  )
);

create policy "Students can view assigned workouts"
on workouts for select
using (
  exists (
    select 1 from assigned_workouts
    where assigned_workouts.workout_id = workouts.id
    and assigned_workouts.student_id = auth.uid()
  )
);

create policy "Students can view assigned workout exercises"
on workout_exercises for select
using (
  exists (
    select 1 from workouts
    join assigned_workouts on assigned_workouts.workout_id = workouts.id
    where workouts.id = workout_exercises.workout_id
    and assigned_workouts.student_id = auth.uid()
  )
);

-- ====================================================
-- 6. DIET LIBRARY
-- ====================================================
alter table diets enable row level security;
alter table meals enable row level security;
alter table meal_items enable row level security;

create policy "Trainer manages own diets" on diets for all using (auth.uid() = trainer_id);
create policy "Trainer manages own meals" on meals for all using (exists (select 1 from diets where diets.id = meals.diet_id and diets.trainer_id = auth.uid()));
create policy "Trainer manages own meal items" on meal_items for all using (
    exists (
        select 1 from meals 
        join diets on diets.id = meals.diet_id
        where meals.id = meal_items.meal_id 
        and diets.trainer_id = auth.uid()
    )
);

create policy "Student views assigned diets" on diets for select using (
    exists (select 1 from assigned_diets where assigned_diets.diet_id = diets.id and assigned_diets.student_id = auth.uid())
);

create policy "Student views assigned meals" on meals for select using (
    exists (
        select 1 from diets 
        join assigned_diets on assigned_diets.diet_id = diets.id
        where diets.id = meals.diet_id 
        and assigned_diets.student_id = auth.uid()
    )
);

create policy "Student views assigned meal items" on meal_items for select using (
    exists (
        select 1 from meals 
        join diets on diets.id = meals.diet_id
        join assigned_diets on assigned_diets.diet_id = diets.id
        where meals.id = meal_items.meal_id 
        and assigned_diets.student_id = auth.uid()
    )
);

-- ====================================================
-- 7. ASSIGNMENTS
-- ====================================================
alter table assigned_workouts enable row level security;
alter table assigned_diets enable row level security;

create policy "Trainer manages assignments" on assigned_workouts for all using (
    exists (select 1 from trainer_students where trainer_id = auth.uid() and student_id = assigned_workouts.student_id)
);
create policy "Student views assignments" on assigned_workouts for select using (auth.uid() = student_id);

create policy "Trainer manages diet assignments" on assigned_diets for all using (
    exists (select 1 from trainer_students where trainer_id = auth.uid() and student_id = assigned_diets.student_id)
);
create policy "Student views diet assignments" on assigned_diets for select using (auth.uid() = student_id);

-- ====================================================
-- 8. STUDENT PROGRESS (LOGS)
-- ====================================================
alter table workout_logs enable row level security;
alter table load_history enable row level security;
alter table weight_history enable row level security;
alter table progress_photos enable row level security;
alter table meal_logs enable row level security;

-- General Rule: Student (Owner) = Full Access. Trainer = Read Access.

create policy "Student manages own workout logs" on workout_logs for all using (auth.uid() = student_id);
create policy "Trainer views student workout logs" on workout_logs for select using (is_trainer_of(student_id));

create policy "Student manages own load history" on load_history for all using (auth.uid() = student_id);
create policy "Trainer views student load history" on load_history for select using (is_trainer_of(student_id));

create policy "Student manages own weight history" on weight_history for all using (auth.uid() = student_id);
create policy "Trainer views student weight history" on weight_history for select using (is_trainer_of(student_id));

create policy "Student manages own photos" on progress_photos for all using (auth.uid() = student_id);
create policy "Trainer views student photos" on progress_photos for select using (is_trainer_of(student_id));
create policy "Public can view non-private progress photos" on progress_photos for select using (is_private = false);

create policy "Student manages own meal logs" on meal_logs for all using (auth.uid() = student_id);
create policy "Trainer views student meal logs" on meal_logs for select using (is_trainer_of(student_id));
