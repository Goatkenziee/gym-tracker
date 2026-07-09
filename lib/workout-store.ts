'use client';

import { useState, useEffect, useCallback } from 'react';
import { Workout, WorkoutTemplate, DEFAULT_EXERCISES, Exercise } from '@/types/workout';

const STORAGE_KEY = 'gym-tracker-workouts';
const TEMPLATES_KEY = 'gym-tracker-templates';

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
  };
}
