-- Migration to fix exercise name collision between different trainers
-- The current unique constraint on 'name' is global, preventing two trainers 
-- from having their own exercises with the same name.

-- 1. Remove the global unique constraint
ALTER TABLE exercises DROP CONSTRAINT IF EXISTS exercises_name_key;

-- 2. Add a composite unique constraint for (trainer_id, name)
-- This allows different trainers to have their own "Supino"
ALTER TABLE exercises ADD CONSTRAINT exercises_trainer_name_unique UNIQUE (trainer_id, name);

-- 3. Handle system defaults (where trainer_id is NULL)
-- Postgres UNIQUE constraints allow multiple NULLs by default.
-- We want only one system default per name.
CREATE UNIQUE INDEX IF NOT EXISTS exercises_system_default_name_idx ON exercises (name) WHERE is_system_default = true;

-- 4. Update RLS to be more helpful during imports
-- Trainers should be able to see exercises with the same name they are trying to create
-- to avoid race conditions, but for now, the composite unique constraint above 
-- solves the primary issue of not being able to CREATE them.
