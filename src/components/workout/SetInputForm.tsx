import { Text } from 'react-native';
import { useExercises } from '@/hooks/useExercises';
import { useWorkoutSessionStore } from '@/stores/useWorkoutSessionStore';
import { DynamicSetForm } from '@/components/workout/DynamicSetForm';
import { StaticSetForm } from '@/components/workout/StaticSetForm';

interface SetInputFormProps {
  workoutId: string;
}

export function SetInputForm({ workoutId }: SetInputFormProps) {
  const { data: exercises } = useExercises();
  const selectedExerciseId = useWorkoutSessionStore((state) => state.selectedExerciseId);
  const loggedSets = useWorkoutSessionStore((state) => state.loggedSets);

  if (!selectedExerciseId) {
    return <Text>Pick an exercise above to log a set.</Text>;
  }

  const exercise = exercises?.find((e) => e.id === selectedExerciseId);
  if (!exercise) return null;

  const nextSetOrder = loggedSets.length + 1;

  return exercise.type === 'DYNAMIC' ? (
    <DynamicSetForm workoutId={workoutId} exerciseId={exercise.id} nextSetOrder={nextSetOrder} />
  ) : (
    <StaticSetForm workoutId={workoutId} exerciseId={exercise.id} nextSetOrder={nextSetOrder} />
  );
}
