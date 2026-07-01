import { supabase } from '@/lib/supabase';
import type { MovementPattern } from '@/types/database';

export interface VolumeSetRow {
  reps: number | null;
  added_weight_kg: number | null;
  workouts: { date: string };
  exercises: { movement_pattern: MovementPattern };
}

export async function fetchSetsForVolumeChart(sinceISO: string): Promise<VolumeSetRow[]> {
  const { data, error } = await supabase
    .from('workout_sets')
    .select('reps, added_weight_kg, workouts!inner(date), exercises!inner(movement_pattern)')
    .gte('workouts.date', sinceISO)
    .eq('is_completed', true);
  if (error) throw error;
  return data as unknown as VolumeSetRow[];
}

export interface StaticHoldSetRow {
  hold_time_seconds: number | null;
  variation: string | null;
  workouts: { date: string };
  exercises: { id: string; name: string };
}

export async function fetchStaticHoldSets(exerciseId?: string): Promise<StaticHoldSetRow[]> {
  let query = supabase
    .from('workout_sets')
    .select('hold_time_seconds, variation, workouts!inner(date), exercises!inner(id, name, type)')
    .eq('exercises.type', 'STATIC')
    .eq('is_completed', true)
    .not('hold_time_seconds', 'is', null);
  if (exerciseId) {
    query = query.eq('exercise_id', exerciseId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data as unknown as StaticHoldSetRow[];
}

export interface HeatmapWorkoutRow {
  date: string;
  workout_sets: { count: number }[];
}

export async function fetchWorkoutsForHeatmap(sinceISO: string): Promise<HeatmapWorkoutRow[]> {
  const { data, error } = await supabase
    .from('workouts')
    .select('date, workout_sets(count)')
    .gte('date', sinceISO);
  if (error) throw error;
  return data as unknown as HeatmapWorkoutRow[];
}
