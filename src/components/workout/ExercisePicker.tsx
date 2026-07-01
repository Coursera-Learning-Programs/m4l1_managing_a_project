import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useExercises } from '@/hooks/useExercises';
import { useWorkoutSessionStore } from '@/stores/useWorkoutSessionStore';
import type { MovementPattern } from '@/types/database';

const PATTERN_ORDER: MovementPattern[] = ['PUSH', 'PULL', 'CORE', 'LEGS'];

export function ExercisePicker() {
  const { data: exercises, isLoading, error } = useExercises();
  const selectedExerciseId = useWorkoutSessionStore((state) => state.selectedExerciseId);
  const selectExercise = useWorkoutSessionStore((state) => state.selectExercise);

  if (isLoading) return <Text>Loading exercises…</Text>;
  if (error) return <Text style={styles.error}>Failed to load exercises: {error.message}</Text>;
  if (!exercises || exercises.length === 0) {
    return <Text>No exercises found. Seed some via the Supabase SQL editor first.</Text>;
  }

  return (
    <View style={styles.container}>
      {PATTERN_ORDER.map((pattern) => {
        const group = exercises.filter((exercise) => exercise.movement_pattern === pattern);
        if (group.length === 0) return null;
        return (
          <View key={pattern} style={styles.group}>
            <Text style={styles.groupTitle}>{pattern}</Text>
            <View style={styles.chips}>
              {group.map((exercise) => {
                const isSelected = exercise.id === selectedExerciseId;
                return (
                  <Pressable
                    key={exercise.id}
                    onPress={() => selectExercise(exercise.id)}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {exercise.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  group: {
    gap: 6,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 0.5,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chipSelected: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  chipText: {
    fontSize: 14,
    color: '#111827',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  error: {
    color: '#dc2626',
  },
});
