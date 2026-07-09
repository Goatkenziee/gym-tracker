'use client';

import { useParams, useRouter } from 'next/navigation';
import { useWorkoutStore } from '@/lib/workout-store';
import { SetTracker } from '@/components/workout/set-tracker';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/states/empty-state';
import { CheckCircle, Timer, Dumbbell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SetRecord } from '@/types/workout';

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getWorkout, updateWorkout, exercises } = useWorkoutStore();
  const workout = getWorkout(params.id as string);
  const [elapsed, setElapsed] = useState('0:00');

  useEffect(() => {
    if (!workout?.startTime) return;
    const interval = setInterval(() => {
      const start = new Date(workout.startTime).getTime();
      const diff = Math.floor((Date.now() - start) / 1000);
      const mins = Math.floor(diff / 60);
      const secs = diff % 60;
      setElapsed(`${mins}:${secs.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [workout?.startTime]);

  if (!workout) {
    return (
      <Container>
        <EmptyState
          icon={<Dumbbell className="h-12 w-12" />}
          title="Workout not found"
          description="This workout doesn't exist or was deleted."
          action={<Button onClick={() => router.push('/')}>Back to Dashboard</Button>}
        />
      </Container>
    );
  }

  const updateSets = (entryId: string, sets: SetRecord[]) => {
    updateWorkout(workout.id, {
      exercises: workout.exercises.map(e => (e.id === entryId ? { ...e, sets } : e)),
    });
  };

  const removeEntry = (entryId: string) => {
    updateWorkout(workout.id, {
      exercises: workout.exercises.filter(e => e.id !== entryId),
    });
  };

  const completeWorkout = () => {
    updateWorkout(workout.id, {
      completed: true,
      endTime: new Date().toISOString(),
    });
    router.push('/');
  };

  const totalSets = workout.exercises.reduce((sum, e) => sum + e.sets.length, 0);
  const completedSets = workout.exercises.reduce((sum, e) => sum + e.sets.filter(s => s.completed).length, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Container>
        <PageHeader
          title={workout.name}
          backHref="/"
        />

        {/* Stats bar */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2 mb-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-1.5">
            <Timer className="h-4 w-4" />
            <span>{elapsed}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Dumbbell className="h-4 w-4" />
            <span>{completedSets}/{totalSets} sets</span>
          </div>
        </div>

        <div className="space-y-3">
          {workout.exercises.map(entry => (
            <SetTracker
              key={entry.id}
              entry={entry}
              onUpdateSets={sets => updateSets(entry.id, sets)}
              onRemove={() => removeEntry(entry.id)}
            />
          ))}
        </div>

        {!workout.completed && (
          <Button
            className="w-full mt-6 gap-2 h-12 text-base"
            onClick={completeWorkout}
          >
            <CheckCircle className="h-5 w-5" />
            Complete Workout
          </Button>
        )}

        {workout.completed && (
          <div className="text-center mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <CheckCircle className="h-6 w-6 text-primary mx-auto mb-1" />
            <p className="font-medium text-primary">Workout Complete!</p>
            <p className="text-sm text-muted-foreground">
              {completedSets} sets across {workout.exercises.length} exercises
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
