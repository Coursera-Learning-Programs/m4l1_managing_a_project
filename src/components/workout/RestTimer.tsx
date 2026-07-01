import { useEffect } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { useWorkoutSessionStore } from '@/stores/useWorkoutSessionStore';

function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function RestTimer() {
  const restTimer = useWorkoutSessionStore((state) => state.restTimer);
  const tickRestTimer = useWorkoutSessionStore((state) => state.tickRestTimer);
  const stopRestTimer = useWorkoutSessionStore((state) => state.stopRestTimer);
  const startRestTimer = useWorkoutSessionStore((state) => state.startRestTimer);
  const setDefaultRestDuration = useWorkoutSessionStore((state) => state.setDefaultRestDuration);

  useEffect(() => {
    if (!restTimer.isRunning) return;
    const interval = setInterval(tickRestTimer, 1000);
    return () => clearInterval(interval);
  }, [restTimer.isRunning, tickRestTimer]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rest Timer</Text>
      {restTimer.isRunning ? (
        <>
          <Text style={styles.countdown}>{formatSeconds(restTimer.secondsRemaining)}</Text>
          <View style={styles.actions}>
            <Button
              title="+30s"
              variant="secondary"
              onPress={() => startRestTimer(restTimer.secondsRemaining + 30)}
            />
            <Button title="Skip" variant="danger" onPress={stopRestTimer} />
          </View>
        </>
      ) : (
        <View style={styles.idleRow}>
          <Text style={styles.idleLabel}>Default rest:</Text>
          <TextInput
            style={styles.durationInput}
            keyboardType="number-pad"
            value={String(restTimer.durationSeconds)}
            onChangeText={(value) => {
              const parsed = Number(value);
              if (!Number.isNaN(parsed) && parsed > 0) setDefaultRestDuration(parsed);
            }}
          />
          <Text style={styles.idleLabel}>sec</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 0.5,
  },
  countdown: {
    fontSize: 40,
    fontWeight: '700',
    color: '#1d4ed8',
    fontVariant: ['tabular-nums'],
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  idleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  idleLabel: {
    fontSize: 14,
    color: '#374151',
  },
  durationInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    width: 60,
    textAlign: 'center',
  },
});
