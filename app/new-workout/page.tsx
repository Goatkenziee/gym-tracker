'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkoutStore } from '@/lib/workout-store';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExercisePicker } from '@/components/workout/exercise-picker';
import type { Exercise } from '@/types/workout';
import { ArrowRight } from 'lucide-react';

export default function NewWorkoutPage() {
  const router = useRouter();
  const { createWorkout } = useWorkoutStore();
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<Exercise[]>([]);

  const toggleExercise = (exercise: Exercise) => {
    setSelected(prev =>
      prev.some(e => e.id === exercise.id)
        ? prev.filter(e => e.id !== exercise.id)
        : [...prev, exercise],
    );
  };

  const handleStart = () => {
    if (!name.trim() || selected.length === 0) return;
    const workout = createWorkout(name.trim(), selected);
    router.push(`/workout/${workout.id}`);
  };

  const canStart = name.trim().length > 0 && selected.length > 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      <Container>
        <PageHeader
          title="New Workout"
          description="Name it and pick exercises"
          backHref="/"
        />

        {/* Workout name */}
        <div className="mt-4">
          <label className="text-[10px] font-semibold text-muted-foreground/20 uppercase tracking-wider mb-2 block">
            Workout Name
          </label>
          <Input
            placeholder="e.g. Monday Push"
            value={name}
            onChange={e => setName(e.target.value)}
            className="h-10 text-sm"
            autoFocus
          />
        </div>

        {/* Exercise picker */}
        <div className="mt-6">
          <label className="text-[10px] font-semibold text-muted-foreground/20 uppercase tracking-wider mb-2 block">
            Exercises · {selected.length} selected
          </label>
          <ExercisePicker selected={selected} onToggle={toggleExercise} />
        </div>

        {/* Start button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
          <Button
            onClick={handleStart}
            disabled={!canStart}
            className="w-full gap-2"
          >
            Start Workout
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </Container>
    </div>
  );
}
