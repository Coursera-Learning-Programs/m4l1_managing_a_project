import { StyleSheet, Text, View } from 'react-native';
import type { SetWithExercise } from '@/api/sets';

export function SetListItem({ set }: { set: SetWithExercise }) {
  const isDynamic = set.exercises.type === 'DYNAMIC';
  return (
    <View style={styles.row}>
      <Text style={styles.order}>#{set.set_order}</Text>
      <Text style={styles.name}>{set.exercises.name}</Text>
      <Text style={styles.detail}>
        {isDynamic
          ? `${set.reps ?? '-'} reps${set.added_weight_kg ? ` @ ${set.added_weight_kg}kg` : ''}`
          : `${set.hold_time_seconds ?? '-'}s${set.variation ? ` (${set.variation})` : ''}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  order: {
    width: 28,
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '600',
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  detail: {
    fontSize: 14,
    color: '#374151',
  },
});
