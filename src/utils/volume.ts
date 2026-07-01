import type { MovementPattern } from '@/types/database';
import type { VolumeSetRow, StaticHoldSetRow, HeatmapWorkoutRow } from '@/api/analytics';
import { weekBucketKey, dayBucketKey } from '@/utils/dateHelpers';

const MOVEMENT_PATTERNS: MovementPattern[] = ['PUSH', 'PULL', 'CORE', 'LEGS'];

export type VolumeByWeek = { week: string } & Record<MovementPattern, number>;

function setVolume(reps: number | null, addedWeightKg: number | null): number {
  if (!reps) return 0;
  return reps * (addedWeightKg && addedWeightKg > 0 ? addedWeightKg : 1);
}

export function aggregateVolumeByPatternAndWeek(rows: VolumeSetRow[]): VolumeByWeek[] {
  const buckets = new Map<string, Record<MovementPattern, number>>();

  for (const row of rows) {
    const week = weekBucketKey(row.workouts.date);
    const pattern = row.exercises.movement_pattern;
    const existing =
      buckets.get(week) ?? ({ PUSH: 0, PULL: 0, CORE: 0, LEGS: 0 } as Record<MovementPattern, number>);
    existing[pattern] += setVolume(row.reps, row.added_weight_kg);
    buckets.set(week, existing);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, patterns]) => ({ week, ...patterns }));
}

export interface SkillSeriesPoint {
  date: string;
  hold_time_seconds: number;
  variation: string | null;
  isVariationTransition: boolean;
}

export function aggregateSkillProgression(rows: StaticHoldSetRow[]): Record<string, SkillSeriesPoint[]> {
  const byExercise = new Map<string, StaticHoldSetRow[]>();
  for (const row of rows) {
    const list = byExercise.get(row.exercises.name) ?? [];
    list.push(row);
    byExercise.set(row.exercises.name, list);
  }

  const result: Record<string, SkillSeriesPoint[]> = {};
  for (const [exerciseName, exerciseRows] of byExercise) {
    const sorted = [...exerciseRows].sort(
      (a, b) => new Date(a.workouts.date).getTime() - new Date(b.workouts.date).getTime()
    );
    let previousVariation: string | null = null;
    result[exerciseName] = sorted.map((row) => {
      const isVariationTransition = previousVariation !== null && previousVariation !== row.variation;
      previousVariation = row.variation;
      return {
        date: row.workouts.date,
        hold_time_seconds: row.hold_time_seconds ?? 0,
        variation: row.variation,
        isVariationTransition,
      };
    });
  }
  return result;
}

export function aggregateHeatmap(rows: HeatmapWorkoutRow[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const day = dayBucketKey(row.date);
    const setCount = row.workout_sets?.[0]?.count ?? 0;
    counts[day] = (counts[day] ?? 0) + setCount;
  }
  return counts;
}

export { MOVEMENT_PATTERNS };
