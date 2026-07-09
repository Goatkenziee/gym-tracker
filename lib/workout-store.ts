'use client';

import { useState, useEffect, useCallback } from 'react';
import { Workout, WorkoutTemplate, DEFAULT_EXERCISES, Exercise, ExerciseEntry, SetRecord } from '@/types/workout';

const STORAGE_KEY = 'gym-tracker-workouts';
const TEMPLATES_KEY = 'gym-tracker-templates';

let setIdCounter = Date.now();
function genSetId() { return `set_${++setIdCounter}`; }
function genId() { return `w_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; }

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useWorkoutStore() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [exercises] = useState<Exercise[]>(DEFAULT_EXERCISES);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setWorkouts(loadFromStorage<Workout[]>(STORAGE_KEY, []));
    setTemplates(loadFromStorage<WorkoutTemplate[]>(TEMPLATES_KEY, []));
    setLoaded(true);
  }, []);

  const saveWorkouts = useCallback((w: Workout[]) => {
    setWorkouts(w);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(w));
    }
  }, []);

  const saveTemplates = useCallback((t: WorkoutTemplate[]) => {
    setTemplates(t);
    if (typeof window !== 'undefined') {
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(t));
    }
  }, []);

  const addWorkout = useCallback((w: Workout) => {
    saveWorkouts([w, ...workouts]);
  }, [workouts, saveWorkouts]);

  const updateWorkout = useCallback((id: string, updates: Partial<Workout>) => {
    saveWorkouts(workouts.map(w => w.id === id ? { ...w, ...updates } : w));
  }, [workouts, saveWorkouts]);

  const deleteWorkout = useCallback((id: string) => {
    saveWorkouts(workouts.filter(w => w.id !== id));
  }, [workouts, saveWorkouts]);

  const getWorkout = useCallback((id: string) => {
    return workouts.find(w => w.id === id) ?? null;
  }, [workouts]);

  const addTemplate = useCallback((t: WorkoutTemplate) => {
    saveTemplates([...templates, t]);
  }, [templates, saveTemplates]);

  const deleteTemplate = useCallback((id: string) => {
    saveTemplates(templates.filter(t => t.id !== id));
  }, [templates, saveTemplates]);

  // --- Set-level operations ---

  const addSet = useCallback((workoutId: string, exerciseId: string) => {
    saveWorkouts(workouts.map(w => {
      if (w.id !== workoutId) return w;
      return {
        ...w,
        exercises: w.exercises.map(e => {
          if (e.exerciseId !== exerciseId) return e;
          return {
            ...e,
            sets: [...e.sets, { id: genSetId(), reps: 0, weightKg: 0, completed: false }],
          };
        }),
      };
    }));
  }, [workouts, saveWorkouts]);

  const removeSet = useCallback((workoutId: string, exerciseId: string, setId: string) => {
    saveWorkouts(workouts.map(w => {
      if (w.id !== workoutId) return w;
      return {
        ...w,
        exercises: w.exercises.map(e => {
          if (e.exerciseId !== exerciseId) return e;
          return { ...e, sets: e.sets.filter(s => s.id !== setId) };
        }),
      };
    }));
  }, [workouts, saveWorkouts]);

  const updateSet = useCallback((workoutId: string, exerciseId: string, setId: string, updates: Partial<SetRecord>) => {
    saveWorkouts(workouts.map(w => {
      if (w.id !== workoutId) return w;
      return {
        ...w,
        exercises: w.exercises.map(e => {
          if (e.exerciseId !== exerciseId) return e;
          return {
            ...e,
            sets: e.sets.map(s => s.id === setId ? { ...s, ...updates } : s),
          };
        }),
      };
    }));
  }, [workouts, saveWorkouts]);

  const toggleSet = useCallback((workoutId: string, exerciseId: string, setId: string) => {
    saveWorkouts(workouts.map(w => {
      if (w.id !== workoutId) return w;
      return {
        ...w,
        exercises: w.exercises.map(e => {
          if (e.exerciseId !== exerciseId) return e;
          return {
            ...e,
            sets: e.sets.map(s => s.id === setId ? { ...s, completed: !s.completed } : s),
          };
        }),
      };
    }));
  }, [workouts, saveWorkouts]);

  // --- Workout creation ---

  const createWorkout = useCallback((name: string, selectedExercises: Exercise[]): Workout => {
    const now = new Date().toISOString();
    const exercises: ExerciseEntry[] = selectedExercises.map(ex => ({
      id: `entry_${genId()}`,
      exerciseId: ex.id,
      exerciseName: ex.name,
      category: ex.category,
      sets: [{ id: genSetId(), reps: 0, weightKg: 0, completed: false }],
    }));
    const workout: Workout = {
      id: genId(),
      name,
      date: now.slice(0, 10),
      startTime: now,
      exercises,
      completed: false,
    };
    addWorkout(workout);
    return workout;
  }, [addWorkout]);

  const completeWorkout = useCallback((id: string) => {
    updateWorkout(id, { completed: true, endTime: new Date().toISOString() });
  }, [updateWorkout]);

  return {
    workouts,
    templates,
    exercises,
    loaded,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    getWorkout,
    addTemplate,
    deleteTemplate,
    addSet,
    removeSet,
    updateSet,
    toggleSet,
    createWorkout,
    completeWorkout,
  };
}
