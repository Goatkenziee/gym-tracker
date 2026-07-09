'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Exercise, ExerciseEntry, SetRecord, Workout } from '@/types/workout';
import { useWorkoutStore } from '@/lib/workout-store';
import { ExercisePicker } from '@/components/workout/exercise-picker';
import { SetTracker } from '@/components/workout/set-tracker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/layout/page-header';
import { Container } from '@/components/layout/container';
import { ArrowLeft, Play, Plus } from 'lucide-react';

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function NewWorkoutPage() {
  const router = useRouter();
  const { exercises, addWorkout } = useWorkoutStore();
  const [name, setName] = useState('');
  const [entries, setEntries] = useState<ExerciseEntry[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const handleSelectExercise = (ex: Exercise) => {
    if (entries.some(e => e.exerciseId === ex.id)) return;
    const newEntry: ExerciseEntry = {
      id: generateId(),
      exerciseId: ex.id,
      exerciseName: ex.name,
      category: ex.category,
      sets: [{ id: generateId(), reps: 10, weightKg: 0, completed: false }],
    };
    setEntries([...entries, newEntry]);
    setShowPicker(false);
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const updateSets = (entryId: string, sets: SetRecord[]) => {
    setEntries(entries.map(e => (e.id === entryId ? { ...e, sets } : e)));
  };

  const startWorkout = () => {
    if (entries.length === 0) return;
    const workout: Workout = {
      id: generateId(),
      name: name.trim() || `Workout ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toISOString(),
      exercises: entries,
      completed: false,
    };
    addWorkout(workout);
    router.push(`/workout/${workout.id}`);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Container>
        <PageHeader
          title="New Workout"
          backHref="/"
          actions={
            <Button onClick={startWorkout} disabled={entries.length === 0} className="gap-1.5">
              <Play className="h-4 w-4" />
              Start
            </Button>
          }
        />

        <div className="space-y-4 mt-4">
          <Input
            placeholder="Workout name (optional)"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          {entries.map(entry => (
            <SetTracker
              key={entry.id}
              entry={entry}
              onUpdateSets={sets => updateSets(entry.id, sets)}
              onRemove={() => removeEntry(entry.id)}
            />
          ))}

          {showPicker ? (
            <div className="border rounded-lg p-4 bg-muted/30">
              <ExercisePicker
                exercises={exercises}
                onSelect={handleSelectExercise}
                selectedIds={entries.map(e => e.exerciseId)}
              />
            </div>
          ) : (
            <Button variant="outline" className="w-full gap-1.5" onClick={() => setShowPicker(true)}>
              <Plus className="h-4 w-4" />
              Add Exercise
            </Button>
          )}

          {entries.length === 0 && !showPicker && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Add an exercise to get started
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}
