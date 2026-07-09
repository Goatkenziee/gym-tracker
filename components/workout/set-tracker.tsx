'use client';

import { useWorkoutStore } from '@/lib/workout-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ExerciseEntry } from '@/types/workout';
import { Plus, X, Check } from 'lucide-react';

interface SetTrackerProps {
  workoutId: string;
  entry: ExerciseEntry;
}

export function SetTracker({ workoutId, entry }: SetTrackerProps) {
  const { addSet, removeSet, updateSet, toggleSet } = useWorkoutStore();

  return (
    <div>
      {/* Header */}
      <div className="grid grid-cols-[24px_1fr_1fr_28px] gap-2 mb-2 text-[10px] font-medium text-muted-foreground/30 uppercase tracking-wider">
        <span />
        <span>Weight</span>
        <span>Reps</span>
        <span />
      </div>

      {/* Sets */}
      <div className="space-y-1">
        {entry.sets.map((set, idx) => (
          <div
            key={set.id}
            className={cn(
              'grid grid-cols-[24px_1fr_1fr_28px] gap-2 items-center rounded-lg px-2 py-1.5 transition-all',
              set.completed ? 'opacity-40' : '',
            )}
          >
            {/* Set number */}
            <button
              onClick={() => toggleSet(workoutId, entry.exerciseId, set.id)}
              className={cn(
                'h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-medium transition-all',
                set.completed
                  ? 'bg-success/20 text-success'
                  : 'bg-muted/60 text-muted-foreground/30 hover:bg-muted',
              )}
            >
              {set.completed ? <Check className="h-3 w-3" /> : idx + 1}
            </button>

            {/* Weight */}
            <input
              type="number"
              value={set.weightKg || ''}
              onChange={e => updateSet(workoutId, entry.exerciseId, set.id, { weightKg: parseFloat(e.target.value) || 0 })}
              placeholder="kg"
              className="w-full h-7 px-2 rounded-md bg-muted/40 text-xs text-foreground/60 placeholder:text-muted-foreground/15 border border-border/30 focus:outline-none focus:border-foreground/30 transition-colors"
            />

            {/* Reps */}
            <input
              type="number"
              value={set.reps || ''}
              onChange={e => updateSet(workoutId, entry.exerciseId, set.id, { reps: parseInt(e.target.value) || 0 })}
              placeholder="reps"
              className="w-full h-7 px-2 rounded-md bg-muted/40 text-xs text-foreground/60 placeholder:text-muted-foreground/15 border border-border/30 focus:outline-none focus:border-foreground/30 transition-colors"
            />

            {/* Remove */}
            <button
              onClick={() => removeSet(workoutId, entry.exerciseId, set.id)}
              className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground/20 hover:text-destructive hover:bg-destructive/10 transition-all"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Add set */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => addSet(workoutId, entry.exerciseId)}
        className="mt-2 text-muted-foreground/30 hover:text-foreground/60"
      >
        <Plus className="h-3 w-3" />
        Add set
      </Button>
    </div>
  );
}
