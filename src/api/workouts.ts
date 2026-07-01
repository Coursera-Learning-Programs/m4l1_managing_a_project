import { supabase } from '@/lib/supabase';
import type { Workout } from '@/types/database';

export async function createWorkout(): Promise<Workout> {
  // user_id defaults to auth.uid() at the DB level, so it's omitted here.
  const { data, error } = await supabase
    .from('workouts')
    .insert({ date: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateWorkout(
  id: string,
  updates: Partial<Pick<Workout, 'duration_minutes' | 'notes'>>
): Promise<Workout> {
  const { data, error } = await supabase
    .from('workouts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchWorkoutHistory(limit = 50): Promise<Workout[]> {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}
