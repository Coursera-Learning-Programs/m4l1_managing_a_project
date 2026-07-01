import { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ExercisePicker } from '@/components/workout/ExercisePicker';
import { SetInputForm } from '@/components/workout/SetInputForm';
import { RestTimer } from '@/components/workout/RestTimer';
import { CurrentWorkoutSetList } from '@/components/workout/CurrentWorkoutSetList';
import { useCreateWorkout, useUpdateWorkout } from '@/hooks/useWorkouts';
import { useWorkoutSessionStore } from '@/stores/useWorkoutSessionStore';

export default function WorkoutScreen() {
  const activeWorkoutId = useWorkoutSessionStore((state) => state.activeWorkoutId);
  const startWorkout = useWorkoutSessionStore((state) => state.startWorkout);
  const endWorkout = useWorkoutSessionStore((state) => state.endWorkout);
  const createWorkout = useCreateWorkout();
  const updateWorkout = useUpdateWorkout();
  const startedAtRef = useRef<number | null>(null);

  const handleStart = () => {
    createWorkout.mutate(undefined, {
      onSuccess: (workout) => {
        startedAtRef.current = Date.now();
        startWorkout(workout.id);
      },
    });
  };

  const handleEnd = () => {
    if (activeWorkoutId && startedAtRef.current) {
      const durationMinutes = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 60000));
      updateWorkout.mutate({ id: activeWorkoutId, updates: { duration_minutes: durationMinutes } });
    }
    startedAtRef.current = null;
    endWorkout();
  };

  if (!activeWorkoutId) {
    return (
      <Screen>
        <Card>
          <Text style={styles.emptyTitle}>Ready to train?</Text>
          <Text style={styles.emptyBody}>Start a workout to begin logging sets.</Text>
          <View style={styles.spacer} />
          <Button title="Start Workout" onPress={handleStart} disabled={createWorkout.isPending} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <Card>
        <Text style={styles.sectionTitle}>Exercise</Text>
        <ExercisePicker />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Log a Set</Text>
        <SetInputForm workoutId={activeWorkoutId} />
      </Card>

      <Card>
        <RestTimer />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>This Workout</Text>
        <CurrentWorkoutSetList />
      </Card>

      <Button title="End Workout" variant="danger" onPress={handleEnd} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  emptyBody: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  spacer: {
    height: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
});
