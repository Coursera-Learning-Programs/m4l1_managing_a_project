-- Seeds the common exercises used by the Workout Player so the app isn't
-- empty on first run. Run this AFTER creating the single auth user
-- (Supabase Dashboard -> Authentication -> Add user) with the same email
-- as EXPO_PUBLIC_AUTH_EMAIL in your .env.
do $$
declare
  target_user_id uuid;
begin
  select id into target_user_id
  from auth.users
  where email = 'you@example.com' -- replace with your EXPO_PUBLIC_AUTH_EMAIL value
  limit 1;

  if target_user_id is null then
    raise exception 'No auth user found for that email. Create the user in Supabase Auth first, then re-run this seed.';
  end if;

  insert into exercises (user_id, name, type, movement_pattern)
  values
    (target_user_id, 'Pull-ups', 'DYNAMIC', 'PULL'),
    (target_user_id, 'Chin-ups', 'DYNAMIC', 'PULL'),
    (target_user_id, 'Dips', 'DYNAMIC', 'PUSH'),
    (target_user_id, 'Push-ups', 'DYNAMIC', 'PUSH'),
    (target_user_id, 'Handstand Push-ups', 'DYNAMIC', 'PUSH'),
    (target_user_id, 'Squats', 'DYNAMIC', 'LEGS'),
    (target_user_id, 'Pistol Squats', 'DYNAMIC', 'LEGS'),
    (target_user_id, 'Hanging Leg Raises', 'DYNAMIC', 'CORE'),
    (target_user_id, 'Front Lever', 'STATIC', 'PULL'),
    (target_user_id, 'Back Lever', 'STATIC', 'PULL'),
    (target_user_id, 'Planche', 'STATIC', 'PUSH'),
    (target_user_id, 'L-Sit', 'STATIC', 'CORE'),
    (target_user_id, 'Handstand', 'STATIC', 'PUSH')
  on conflict do nothing;
end $$;
