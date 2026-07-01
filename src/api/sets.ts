import { supabase } from '@/lib/supabase';
import type { WorkoutSet } from '@/types/database';

export type NewWorkoutSet = Pick<WorkoutSet, 'workout_id' | 'exercise_id' | 'set_order'> &
  Partial<
    Pick<WorkoutSet, 'reps' | 'added_weight_kg' | 'hold_time_seconds' | 'variation' | 'is_completed'>
  >;

export interface SetWithExercise extends WorkoutSet {
  exercises: { name: string; type: string; movement_pattern: string };
}

export async function createSet(input: NewWorkoutSet): Promise<SetWithExercise> {
  const { data, error } = await supabase
    .from('workout_sets')
    .insert({ is_completed: true, ...input })
    .select('*, exercises(name, type, movement_pattern)')
    .single();
  if (error) throw error;
  return data as unknown as SetWithExercise;
}

export async function fetchSetsForWorkout(workoutId: string): Promise<SetWithExercise[]> {
  const { data, error } = await supabase
    .from('workout_sets')
    .select('*, exercises(name, type, movement_pattern)')
    .eq('workout_id', workoutId)
    .order('set_order', { ascending: true });
  if (error) throw error;
  return data as unknown as SetWithExercise[];
}
