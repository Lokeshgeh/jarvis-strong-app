create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid references auth.users primary key,
  username text default 'Jarvis Strong',
  bio text default 'Diamond II • Discipline-first builder',
  avatar_color text default '#00BFFF',
  level integer default 27,
  xp integer default 410,
  streak integer default 46,
  units text default 'kg',
  notification_time text default '04:00',
  is_public boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.workouts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  routine_name text,
  duration_seconds integer,
  volume_kg numeric,
  sets_completed integer,
  records_broken integer default 0,
  notes text,
  completed_at timestamptz default now()
);

create table if not exists public.workout_sets (
  id uuid default gen_random_uuid() primary key,
  workout_id uuid references public.workouts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  exercise_name text not null,
  muscle_group text default 'General',
  set_number integer default 1,
  weight_kg numeric default 0,
  reps integer default 0,
  completed_at timestamptz default now()
);

create table if not exists public.routines (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists public.routine_exercises (
  id uuid default gen_random_uuid() primary key,
  routine_id uuid references public.routines(id) on delete cascade,
  exercise_name text not null,
  muscle_group text default 'General',
  sets integer default 3,
  kg numeric default 0,
  reps integer default 8,
  sort_order integer default 0
);

create table if not exists public.nutrition_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  log_date date default current_date,
  meal_type text check (meal_type in ('breakfast','lunch','dinner','snacks')),
  food_name text not null,
  quantity text,
  calories integer,
  protein_g numeric default 0,
  carbs_g numeric default 0,
  fat_g numeric default 0,
  fiber_g numeric default 0
);

create table if not exists public.bodyweight_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  weight_kg numeric not null,
  logged_at date default current_date
);

create table if not exists public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  goal_type text,
  target_value text,
  current_value text,
  target_date date,
  created_at timestamptz default now()
);

create table if not exists public.schedule_completions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  block_id integer not null,
  completed_date date default current_date,
  created_at timestamptz default now(),
  unique (user_id, block_id, completed_date)
);

create table if not exists public.friends (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  friend_id uuid references public.profiles(id) on delete cascade,
  status text default 'accepted',
  created_at timestamptz default now(),
  unique (user_id, friend_id)
);

create table if not exists public.achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  slug text not null,
  name text not null,
  description text,
  unlock_rule text,
  unlocked boolean default false,
  progress integer default 0,
  created_at timestamptz default now(),
  unique (user_id, slug)
);

create table if not exists public.meal_plan_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  day_key text check (day_key in ('mon','tue','wed','thu','fri','sat','sun')),
  meal_type text check (meal_type in ('breakfast','lunch','dinner','snacks')),
  meal_text text not null,
  created_at timestamptz default now(),
  unique (user_id, day_key, meal_type)
);

create table if not exists public.exercise_rank_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  exercise_name text not null,
  category text,
  tier text,
  lp integer default 0,
  weight_kg numeric default 0,
  reps integer default 0,
  created_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.refresh_achievement_progress(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_workouts integer;
  v_streak integer;
  v_bench_hit boolean;
  v_meal_types integer;
begin
  select count(*) into v_workouts from public.workouts where user_id = p_user_id;
  select coalesce(streak, 0) into v_streak from public.profiles where id = p_user_id;
  select exists (
    select 1 from public.workout_sets where user_id = p_user_id and exercise_name = 'Bench Press' and weight_kg >= 100
  ) into v_bench_hit;
  select count(distinct meal_type) into v_meal_types from public.nutrition_log where user_id = p_user_id and log_date = current_date;

  update public.achievements
    set unlocked = v_workouts >= 1,
        progress = case when v_workouts >= 1 then 100 else 0 end
  where user_id = p_user_id and slug = 'first-workout';

  update public.achievements
    set unlocked = v_streak >= 10,
        progress = least(100, v_streak * 10)
  where user_id = p_user_id and slug = '10-day-streak';

  update public.achievements
    set unlocked = v_streak >= 30,
        progress = least(100, round((v_streak::numeric / 30) * 100))
  where user_id = p_user_id and slug = '30-day-discipline';

  update public.achievements
    set unlocked = v_bench_hit,
        progress = case when v_bench_hit then 100 else 80 end
  where user_id = p_user_id and slug = '100kg-bench';

  update public.achievements
    set unlocked = v_meal_types >= 4,
        progress = case when v_meal_types >= 4 then 100 else v_meal_types * 25 end
  where user_id = p_user_id and slug = 'meal-prep-hero';
end;
$$;

create or replace function public.trigger_refresh_achievements()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.refresh_achievement_progress(coalesce(new.user_id, old.user_id));
  return coalesce(new, old);
end;
$$;

drop trigger if exists workouts_refresh_achievements on public.workouts;
create trigger workouts_refresh_achievements
after insert or update on public.workouts
for each row execute procedure public.trigger_refresh_achievements();

drop trigger if exists workout_sets_refresh_achievements on public.workout_sets;
create trigger workout_sets_refresh_achievements
after insert or update on public.workout_sets
for each row execute procedure public.trigger_refresh_achievements();

drop trigger if exists nutrition_refresh_achievements on public.nutrition_log;
create trigger nutrition_refresh_achievements
after insert or update or delete on public.nutrition_log
for each row execute procedure public.trigger_refresh_achievements();

drop trigger if exists profiles_refresh_achievements on public.profiles;
create trigger profiles_refresh_achievements
after update of streak on public.profiles
for each row execute procedure public.trigger_refresh_achievements();

alter table public.profiles enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_sets enable row level security;
alter table public.routines enable row level security;
alter table public.routine_exercises enable row level security;
alter table public.nutrition_log enable row level security;
alter table public.bodyweight_log enable row level security;
alter table public.goals enable row level security;
alter table public.schedule_completions enable row level security;
alter table public.friends enable row level security;
alter table public.achievements enable row level security;
alter table public.meal_plan_entries enable row level security;
alter table public.exercise_rank_entries enable row level security;

drop policy if exists "Users own profiles" on public.profiles;
create policy "Users own profiles" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Public profiles readable" on public.profiles;
create policy "Public profiles readable" on public.profiles for select using (is_public = true or auth.uid() = id);

drop policy if exists "Users own workouts" on public.workouts;
create policy "Users own workouts" on public.workouts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Public workouts readable" on public.workouts;
create policy "Public workouts readable" on public.workouts for select using (
  auth.uid() = user_id or exists (select 1 from public.profiles where profiles.id = workouts.user_id and profiles.is_public = true)
);

drop policy if exists "Users own workout sets" on public.workout_sets;
create policy "Users own workout sets" on public.workout_sets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users own routines" on public.routines;
create policy "Users own routines" on public.routines for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users own routine exercises" on public.routine_exercises;
create policy "Users own routine exercises" on public.routine_exercises for all using (
  exists (select 1 from public.routines where routines.id = routine_exercises.routine_id and routines.user_id = auth.uid())
) with check (
  exists (select 1 from public.routines where routines.id = routine_exercises.routine_id and routines.user_id = auth.uid())
);

drop policy if exists "Users own nutrition" on public.nutrition_log;
create policy "Users own nutrition" on public.nutrition_log for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users own weight" on public.bodyweight_log;
create policy "Users own weight" on public.bodyweight_log for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users own goals" on public.goals;
create policy "Users own goals" on public.goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users own schedule" on public.schedule_completions;
create policy "Users own schedule" on public.schedule_completions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users own friends" on public.friends;
create policy "Users own friends" on public.friends for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users own achievements" on public.achievements;
create policy "Users own achievements" on public.achievements for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users own meal plans" on public.meal_plan_entries;
create policy "Users own meal plans" on public.meal_plan_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users own exercise ranks" on public.exercise_rank_entries;
create policy "Users own exercise ranks" on public.exercise_rank_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
