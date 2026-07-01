import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createWorkout, fetchWorkoutHistory, updateWorkout } from '@/api/workouts';
import { fetchSetsForWorkout } from '@/api/sets';

export function useWorkoutHistory() {
  return useQuery({ queryKey: ['workouts'], queryFn: () => fetchWorkoutHistory() });
}

export function useWorkoutSets(workoutId: string | null) {
  return useQuery({
    queryKey: ['workout-sets', workoutId],
    queryFn: () => fetchSetsForWorkout(workoutId as string),
    enabled: !!workoutId,
  });
}

export function useCreateWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}

export function useUpdateWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof updateWorkout>[1] }) =>
      updateWorkout(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}
