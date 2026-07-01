import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { useLogSet } from '@/hooks/useLogSet';

interface DynamicSetFormProps {
  workoutId: string;
  exerciseId: string;
  nextSetOrder: number;
}

export function DynamicSetForm({ workoutId, exerciseId, nextSetOrder }: DynamicSetFormProps) {
  const [reps, setReps] = useState('');
  const [addedWeightKg, setAddedWeightKg] = useState('');
  const logSet = useLogSet();

  const canSubmit = reps.trim().length > 0 && !logSet.isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;
    logSet.mutate(
      {
        workout_id: workoutId,
        exercise_id: exerciseId,
        set_order: nextSetOrder,
        reps: Number(reps),
        added_weight_kg: addedWeightKg.trim() ? Number(addedWeightKg) : null,
      },
      {
        onSuccess: () => {
          setReps('');
          setAddedWeightKg('');
        },
      }
    );
  };

  return (
    <View style={styles.row}>
      <View style={styles.field}>
        <Text style={styles.label}>Reps</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={reps}
          onChangeText={setReps}
          placeholder="10"
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Added weight (kg)</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={addedWeightKg}
          onChangeText={setAddedWeightKg}
          placeholder="0"
        />
      </View>
      <Button title="Log Set" onPress={handleSubmit} disabled={!canSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 12,
  },
  field: {
    gap: 4,
  },
  label: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 15,
  },
});
