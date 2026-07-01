# Calisthenics Tracker

A personal, single-user calisthenics workout tracker. Built with Expo (React
Native + Expo Router) on the frontend and Supabase (Postgres + Auth) as the
backend.

## Features

- **Workout Player**: log sets during a workout with inputs that adapt to the
  exercise type (Reps + Added Weight for dynamic exercises like pull-ups/dips;
  Hold Time + Band Resistance/Variation for static holds like front lever/planche),
  plus an auto-starting rest timer between sets.
- **Dashboard**: progressive overload chart (volume by movement pattern over
  time), skill progression chart (hold time over time per static exercise,
  with variation transitions highlighted), and a GitHub-style consistency
  heatmap.
- **History**: browse past workouts and their logged sets.

## Tech stack

- Expo SDK 57 + Expo Router (file-based routing)
- Supabase (Postgres, Auth, Row Level Security)
- TanStack React Query (server state) + Zustand (local workout-session state)
- victory-native (legacy/SVG build, aliased to `victory` on web via Metro)

## One-time setup

This is a single-user app with no sign-in screen — it authenticates
automatically on boot using one account's credentials from your `.env` file.
You need to create that Supabase project and user once:

1. **Create a Supabase project** at [supabase.com](https://supabase.com).
2. **Create the one auth user**: Dashboard → Authentication → Users → Add
   user. Use the email/password you'll put in `.env`.
3. **Run the migrations**: open the SQL editor (or use `supabase db push`
   with the Supabase CLI) and run, in order:
   - `supabase/migrations/20260701120000_init_schema.sql`
   - `supabase/migrations/20260701120100_seed_exercises.sql` (edit the
     placeholder email in this file to match the user you created first)
4. **Configure env vars**: copy `.env.example` to `.env` and fill in:
   - `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` — from your
     Supabase project's API settings
   - `EXPO_PUBLIC_AUTH_EMAIL` / `EXPO_PUBLIC_AUTH_PASSWORD` — the one user's
     credentials from step 2

`.env` is gitignored; never commit real credentials.

## Running the app

```bash
npm install
npm run web      # runs in the browser (fastest way to iterate on this platform)
npm run ios       # requires macOS + Xcode, or the Expo Go app
npm run android   # requires Android Studio, or the Expo Go app
```

Other useful scripts:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint .
```

## Project structure

```
app/                    # expo-router routes (thin screens only)
  _layout.tsx           # root layout: QueryClientProvider + auth bootstrap
  (tabs)/                # Home / Workout / Dashboard / History tabs
src/
  lib/                  # supabase client, auth bootstrap, react-query client
  types/                # hand-written row types matching the SQL schema
  api/                  # thin supabase query/mutation functions
  hooks/                # react-query hooks wrapping api/*
  stores/               # zustand store for the active workout session
  components/
    workout/             # Workout Player pieces (exercise picker, set forms, rest timer)
    dashboard/           # chart components
    ui/                  # shared Screen/Button/Card
  utils/                # date bucketing + volume/aggregation helpers
supabase/migrations/    # SQL schema + seed data
```

## Known limitations (deliberate MVP scope)

- No sign-up/password-reset flow — this is intentionally single-user with no
  sign-in UI.
- No offline queue — requires network connectivity to Supabase.
- Rest timer uses `setInterval` in the foreground; it does not use native
  push notifications, so it won't count down while the browser tab or app is
  backgrounded.
- Analytics aggregation happens client-side (not via SQL views/RPCs) since
  data volume for one user is small.
