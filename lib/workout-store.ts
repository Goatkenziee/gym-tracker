'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Workout, Exercise, ExerciseEntry, Set } from '@/types/workout';

interface WorkoutStore {
  workouts: Workout[];
  templates: WorkoutTemplate[];
  exercises: Exercise[];
  loaded: boolean;
  addWorkout: (w: Workout) => void;
  updateWorkout: (id: string, updates: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  getWorkout: (id: string) => Workout | null;
  addTemplate: (t: WorkoutTemplate) => void;
  deleteTemplate: (id: string) => void;
  createWorkout: (name: string, exercises: { exerciseId: string; exerciseName: string }[]) => string;
  addSet: (workoutId: string, exerciseId: string, set: Set) => void;
  removeSet: (workoutId: string, exerciseId: string, setId: string) => void;
  updateSet: (workoutId: string, exerciseId: string, setId: string, updates: Partial<Set>) => void;
  toggleSet: (workoutId: string, exerciseId: string, setId: string) => void;
  completeWorkout: (id: string) => void;
}

interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: { exerciseId: string; exerciseName: string }[];
}

const DEFAULT_EXERCISES: Exercise[] = [
  { id: 'bench-press', name: 'Bench Press', category: 'chest' },
  { id: 'squat', name: 'Squat', category: 'legs' },
  { id: 'deadlift', name: 'Deadlift', category: 'back' },
  { id: 'ohp', name: 'Overhead Press', category: 'shoulders' },
  { id: 'barbell-row', name: 'Barbell Row', category: 'back' },
  { id: 'pullup', name: 'Pull-up', category: 'back' },
  { id: 'dip', name: 'Dip', category: 'chest' },
  { id: 'bicep-curl', name: 'Bicep Curl', category: 'arms' },
  { id: 'tricep-extension', name: 'Tricep Extension', category: 'arms' },
  { id: 'leg-press', name: 'Leg Press', category: 'legs' },
  { id: 'hamstring-curl', name: 'Hamstring Curl', category: 'legs' },
  { id: 'lateral-raise', name: 'Lateral Raise', category: 'shoulders' },
  { id: 'face-pull', name: 'Face Pull', category: 'shoulders' },
  { id: 'db-row', name: 'Dumbbell Row', category: 'back' },
  { id: 'incline-bench', name: 'Incline Bench Press', category: 'chest' },
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      workouts: [],
      templates: [],
      exercises: DEFAULT_EXERCISES,
      loaded: true,

      addWorkout: (w) => set((s) => ({ workouts: [...s.workouts, w] })),

      updateWorkout: (id, updates) =>
        set((s) => ({
          workouts: s.workouts.map((w) => (w.id === id ? { ...w, ...updates } : w)),
        })),

      deleteWorkout: (id) =>
        set((s) => ({ workouts: s.workouts.filter((w) => w.id !== id) })),

      getWorkout: (id) => get().workouts.find((w) => w.id === id) ?? null,

      addTemplate: (t) => set((s) => ({ templates: [...s.templates, t] })),

      deleteTemplate: (id) =>
        set((s) => ({ templates: s.templates.filter((t) => t.id !== id) })),

      createWorkout: (name, exercises) => {
        const id = generateId();
        const now = new Date().toISOString();
        const workout: Workout = {
          id,
          name,
          date: now.slice(0, 10),
          startTime: now,
          completed: false,
          exercises: exercises.map((e) => ({
            exerciseId: e.exerciseId,
            exerciseName: e.exerciseName,
            sets: [],
          })),
        };
        get().addWorkout(workout);
        return id;
      },

      addSet: (workoutId, exerciseId, set) => {
        set((s) => ({
          workouts: s.workouts.map((w) =>
            w.id === workoutId
              ? {
                  ...w,
                  exercises: w.exercises.map((e) =>
                    e.exerciseId === exerciseId
                      ? { ...e, sets: [...e.sets, set] }
                      : e
                  ),
                }
              : w
          ),
        }));
      },

      removeSet: (workoutId, exerciseId, setId) => {
        set((s) => ({
          workouts: s.workouts.map((w) =>
            w.id === workoutId
              ? {
                  ...w,
                  exercises: w.exercises.map((e) =>
                    e.exerciseId === exerciseId
                      ? { ...e, sets: e.sets.filter((set) => set.id !== setId) }
                      : e
                  ),
                }
              : w
          ),
        }));
      },

      updateSet: (workoutId, exerciseId, setId, updates) => {
        set((s) => ({
          workouts: s.workouts.map((w) =>
            w.id === workoutId
              ? {
                  ...w,
                  exercises: w.exercises.map((e) =>
                    e.exerciseId === exerciseId
                      ? {
                          ...e,
                          sets: e.sets.map((set) =>
                            set.id === setId ? { ...set, ...updates } : set
                          ),
                        }
                      : e
                  ),
                }
              : w
          ),
        }));
      },

      toggleSet: (workoutId, exerciseId, setId) => {
        set((s) => ({
          workouts: s.workouts.map((w) =>
            w.id === workoutId
              ? {
                  ...w,
                  exercises: w.exercises.map((e) =>
                    e.exerciseId === exerciseId
                      ? {
                          ...e,
                          sets: e.sets.map((set) =>
                            set.id === setId
                              ? { ...set, completed: !set.completed }
                              : set
                          ),
                        }
                      : e
                  ),
                }
              : w
          ),
        }));
      },

      completeWorkout: (id) => {
        const now = new Date().toISOString();
        set((s) => ({
          workouts: s.workouts.map((w) =>
            w.id === id
              ? { ...w, completed: true, endTime: now }
              : w
          ),
        }));
      },
    }),
    {
      name: 'gym-workout-storage',
      onRehydrateStorage: () => (state) => {
        if (state) state.loaded = true;
      },
    }
  )
);
