import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { format } from 'date-fns';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SetListItem } from '@/components/workout/SetListItem';
import { useWorkoutHistory, useWorkoutSets } from '@/hooks/useWorkouts';
import type { Workout } from '@/types/database';

function WorkoutHistoryItem({ workout }: { workout: Workout }) {
  const [expanded, setExpanded] = useState(false);
  const { data: sets } = useWorkoutSets(expanded ? workout.id : null);

  return (
    <Card style={styles.card}>
      <Text style={styles.date}>{format(new Date(workout.date), 'EEE, MMM d yyyy')}</Text>
      <Text style={styles.meta}>
        {workout.duration_minutes ? `${workout.duration_minutes} min` : 'Duration not recorded'}
      </Text>
      <Button
        title={expanded ? 'Hide sets' : 'Show sets'}
        variant="secondary"
        onPress={() => setExpanded((prev) => !prev)}
      />
      {expanded && sets?.map((set) => <SetListItem key={set.id} set={set} />)}
    </Card>
  );
}

export default function HistoryScreen() {
  const { data: workouts, isLoading, error } = useWorkoutHistory();

  if (isLoading) return <Screen><Text>Loading history…</Text></Screen>;
  if (error) return <Screen><Text style={styles.error}>Failed to load: {error.message}</Text></Screen>;
  if (!workouts || workouts.length === 0) {
    return (
      <Screen>
        <Text>No workouts yet. Start one from the Home or Workout tab.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      {workouts.map((workout) => (
        <WorkoutHistoryItem key={workout.id} workout={workout} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
  },
  date: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  meta: {
    fontSize: 13,
    color: '#6b7280',
  },
  error: {
    color: '#dc2626',
  },
});
