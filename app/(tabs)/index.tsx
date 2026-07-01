import { StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useWorkoutHistory } from '@/hooks/useWorkouts';

export default function HomeScreen() {
  const router = useRouter();
  const { data: workouts } = useWorkoutHistory();
  const lastWorkout = workouts?.[0];

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          {lastWorkout
            ? `Last workout: ${formatDistanceToNow(new Date(lastWorkout.date), { addSuffix: true })}`
            : 'No workouts logged yet.'}
        </Text>
      </Card>
      <Button title="Start Workout" onPress={() => router.push('/workout')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
});
