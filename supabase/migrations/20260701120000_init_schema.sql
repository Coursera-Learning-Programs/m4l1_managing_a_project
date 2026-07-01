-- Enums
create type exercise_type as enum ('DYNAMIC', 'STATIC');
create type movement_pattern as enum ('PUSH', 'PULL', 'CORE', 'LEGS');

-- exercises
create table exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) default auth.uid(),
  name text not null,
  type exercise_type not null,
  movement_pattern movement_pattern not null,
  created_at timestamptz not null default now()
);

-- workouts
create table workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) default auth.uid(),
  date timestamptz not null default now(),
  duration_minutes int,
  notes text,
  created_at timestamptz not null default now()
);

-- workout_sets
create table workout_sets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) default auth.uid(),
  workout_id uuid not null references workouts(id) on delete cascade,
  exercise_id uuid not null references exercises(id),
  set_order int not null,
  reps int,
  added_weight_kg numeric(5, 2),
  hold_time_seconds int,
  -- Band resistance / progression variation label (e.g. "Tuck", "Adv. Tuck", "Purple Band").
  -- Free text rather than a lookup table: it's always 1:1 with the set row and the
  -- Skill Progression chart just needs to GROUP BY (exercise_id, variation).
  variation text,
  is_completed boolean not null default false,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_workouts_user_date on workouts (user_id, date desc);
create index idx_workout_sets_workout on workout_sets (workout_id, set_order);
create index idx_workout_sets_exercise on workout_sets (exercise_id);
create index idx_exercises_user on exercises (user_id);

-- Row Level Security: single-user app, but every table is still scoped to
-- auth.uid() so the anon key can never read/write another account's rows.
alter table exercises enable row level security;
alter table workouts enable row level security;
alter table workout_sets enable row level security;

create policy "exercises_owner_all" on exercises
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "workouts_owner_all" on workouts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "workout_sets_owner_all" on workout_sets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
