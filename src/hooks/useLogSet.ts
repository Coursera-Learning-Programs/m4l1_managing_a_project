import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSet } from '@/api/sets';
import { useWorkoutSessionStore } from '@/stores/useWorkoutSessionStore';

export function useLogSet() {
  const queryClient = useQueryClient();
  const addLoggedSet = useWorkoutSessionStore((state) => state.addLoggedSet);
  const startRestTimer = useWorkoutSessionStore((state) => state.startRestTimer);

  return useMutation({
    mutationFn: createSet,
    onSuccess: (set) => {
      addLoggedSet(set);
      startRestTimer();
      queryClient.invalidateQueries({ queryKey: ['workout-sets', set.workout_id] });
    },
  });
}
