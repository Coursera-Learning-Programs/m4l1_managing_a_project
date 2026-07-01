export type ExerciseType = 'DYNAMIC' | 'STATIC';
export type MovementPattern = 'PUSH' | 'PULL' | 'CORE' | 'LEGS';

export interface Exercise {
  id: string;
  user_id: string;
  name: string;
  type: ExerciseType;
  movement_pattern: MovementPattern;
  created_at: string;
}

export interface Workout {
  id: string;
  user_id: string;
  date: string;
  duration_minutes: number | null;
  notes: string | null;
  created_at: string;
}

export interface WorkoutSet {
  id: string;
  user_id: string;
  workout_id: string;
  exercise_id: string;
  set_order: number;
  reps: number | null;
  added_weight_kg: number | null;
  hold_time_seconds: number | null;
  variation: string | null;
  is_completed: boolean;
  created_at: string;
}
