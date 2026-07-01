import { useQuery } from '@tanstack/react-query';
import { fetchExercises } from '@/api/exercises';

export function useExercises() {
  return useQuery({ queryKey: ['exercises'], queryFn: fetchExercises });
}
