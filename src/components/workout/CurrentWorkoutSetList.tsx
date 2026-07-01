import { StyleSheet, Text, View } from 'react-native';
import { useWorkoutSessionStore } from '@/stores/useWorkoutSessionStore';
import { SetListItem } from '@/components/workout/SetListItem';

export function CurrentWorkoutSetList() {
  const loggedSets = useWorkoutSessionStore((state) => state.loggedSets);

  if (loggedSets.length === 0) {
    return <Text style={styles.empty}>No sets logged yet this workout.</Text>;
  }

  return (
    <View>
      {loggedSets.map((set) => (
        <SetListItem key={set.id} set={set} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    color: '#6b7280',
    fontSize: 14,
  },
});
