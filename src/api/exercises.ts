import { supabase } from '@/lib/supabase';
import type { Exercise } from '@/types/database';

export async function fetchExercises(): Promise<Exercise[]> {
  const { data, error } = await supabase.from('exercises').select('*').order('name');
  if (error) throw error;
  return data;
}
