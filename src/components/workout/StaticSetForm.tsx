import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { useLogSet } from '@/hooks/useLogSet';

interface StaticSetFormProps {
  workoutId: string;
  exerciseId: string;
  nextSetOrder: number;
}

export function StaticSetForm({ workoutId, exerciseId, nextSetOrder }: StaticSetFormProps) {
  const [holdTimeSeconds, setHoldTimeSeconds] = useState('');
  const [variation, setVariation] = useState('');
  const logSet = useLogSet();

  const canSubmit = holdTimeSeconds.trim().length > 0 && !logSet.isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;
    logSet.mutate(
      {
        workout_id: workoutId,
        exercise_id: exerciseId,
        set_order: nextSetOrder,
        hold_time_seconds: Number(holdTimeSeconds),
        variation: variation.trim() || null,
      },
      {
        onSuccess: () => {
          setHoldTimeSeconds('');
        },
      }
    );
  };

  return (
    <View style={styles.row}>
      <View style={styles.field}>
        <Text style={styles.label}>Hold time (seconds)</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={holdTimeSeconds}
          onChangeText={setHoldTimeSeconds}
          placeholder="20"
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Band resistance / variation</Text>
        <TextInput
          style={styles.input}
          value={variation}
          onChangeText={setVariation}
          placeholder="e.g. Tuck, Adv. Tuck, Purple Band"
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
