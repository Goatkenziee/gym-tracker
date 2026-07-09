export type ExerciseCategory =
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'cardio'
  | 'full-body';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  body: string; // description
}

export interface SetRecord {
  id: string;
  reps: number;
  weightKg: number;
  completed: boolean;
}

export interface ExerciseEntry {
  id: string;
  exerciseId: string;
  exerciseName: string;
  category: ExerciseCategory;
  sets: SetRecord[];
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  date: string; // ISO date
  startTime: string;
  endTime?: string;
  exercises: ExerciseEntry[];
  completed: boolean;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exerciseIds: string[];
}

export const DEFAULT_EXERCISES: Exercise[] = [
  { id: 'bench-press', name: 'Bench Press', category: 'chest', body: 'Barbell bench press — flat' },
  { id: 'incline-bench', name: 'Incline Bench Press', category: 'chest', body: 'Dumbbell or barbell incline press' },
  { id: 'dumbbell-fly', name: 'Dumbbell Fly', category: 'chest', body: 'Flat dumbbell flyes' },
  { id: 'pull-up', name: 'Pull-Up', category: 'back', body: 'Wide-grip pull-ups' },
  { id: 'bent-over-row', name: 'Bent-Over Row', category: 'back', body: 'Barbell bent-over row' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', category: 'back', body: 'Cable lat pulldown' },
  { id: 'squat', name: 'Squat', category: 'legs', body: 'Barbell back squat' },
  { id: 'deadlift', name: 'Deadlift', category: 'legs', body: 'Conventional barbell deadlift' },
  { id: 'leg-press', name: 'Leg Press', category: 'legs', body: 'Leg press machine' },
  { id: 'leg-curl', name: 'Leg Curl', category: 'legs', body: 'Lying leg curl' },
  { id: 'leg-extension', name: 'Leg Extension', category: 'legs', body: 'Leg extension machine' },
  { id: 'ohp', name: 'Overhead Press', category: 'shoulders', body: 'Standing barbell OHP' },
  { id: 'lateral-raise', name: 'Lateral Raise', category: 'shoulders', body: 'Dumbbell lateral raise' },
  { id: 'front-raise', name: 'Front Raise', category: 'shoulders', body: 'Dumbbell front raise' },
  { id: 'bicep-curl', name: 'Bicep Curl', category: 'arms', body: 'Dumbbell bicep curl' },
  { id: 'tricep-pushdown', name: 'Tricep Pushdown', category: 'arms', body: 'Cable tricep pushdown' },
  { id: 'hammer-curl', name: 'Hammer Curl', category: 'arms', body: 'Dumbbell hammer curl' },
  { id: 'crunch', name: 'Crunch', category: 'core', body: 'Floor crunch' },
  { id: 'plank', name: 'Plank', category: 'core', body: 'Front plank hold' },
  { id: 'running', name: 'Running', category: 'cardio', body: 'Treadmill or outdoor run' },
  { id: 'cycling', name: 'Cycling', category: 'cardio', body: 'Stationary bike or outdoor cycle' },
];
