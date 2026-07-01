import { create } from 'zustand';
import type { SetWithExercise } from '@/api/sets';

const DEFAULT_REST_SECONDS = 90;

interface RestTimerState {
  isRunning: boolean;
  secondsRemaining: number;
  durationSeconds: number;
}

interface WorkoutSessionState {
  activeWorkoutId: string | null;
  selectedExerciseId: string | null;
  loggedSets: SetWithExercise[];
  restTimer: RestTimerState;

  startWorkout: (workoutId: string) => void;
  endWorkout: () => void;
  selectExercise: (exerciseId: string) => void;
  addLoggedSet: (set: SetWithExercise) => void;

  startRestTimer: (durationSeconds?: number) => void;
  tickRestTimer: () => void;
  stopRestTimer: () => void;
  setDefaultRestDuration: (seconds: number) => void;
}

export const useWorkoutSessionStore = create<WorkoutSessionState>((set, get) => ({
  activeWorkoutId: null,
  selectedExerciseId: null,
  loggedSets: [],
  restTimer: {
    isRunning: false,
    secondsRemaining: 0,
    durationSeconds: DEFAULT_REST_SECONDS,
  },

  startWorkout: (workoutId) =>
    set({ activeWorkoutId: workoutId, loggedSets: [], selectedExerciseId: null }),

  endWorkout: () =>
    set({
      activeWorkoutId: null,
      selectedExerciseId: null,
      loggedSets: [],
      restTimer: { isRunning: false, secondsRemaining: 0, durationSeconds: get().restTimer.durationSeconds },
    }),

  selectExercise: (exerciseId) => set({ selectedExerciseId: exerciseId }),

  addLoggedSet: (workoutSet) => set((state) => ({ loggedSets: [...state.loggedSets, workoutSet] })),

  startRestTimer: (durationSeconds) =>
    set((state) => ({
      restTimer: {
        isRunning: true,
        durationSeconds: durationSeconds ?? state.restTimer.durationSeconds,
        secondsRemaining: durationSeconds ?? state.restTimer.durationSeconds,
      },
    })),

  tickRestTimer: () =>
    set((state) => {
      if (!state.restTimer.isRunning) return state;
      const nextRemaining = state.restTimer.secondsRemaining - 1;
      if (nextRemaining <= 0) {
        return { restTimer: { ...state.restTimer, isRunning: false, secondsRemaining: 0 } };
      }
      return { restTimer: { ...state.restTimer, secondsRemaining: nextRemaining } };
    }),

  stopRestTimer: () =>
    set((state) => ({ restTimer: { ...state.restTimer, isRunning: false, secondsRemaining: 0 } })),

  setDefaultRestDuration: (seconds) =>
    set((state) => ({ restTimer: { ...state.restTimer, durationSeconds: seconds } })),
}));
