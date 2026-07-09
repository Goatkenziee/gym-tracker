'use client';

import { useState } from 'react';
import { useWorkoutStore } from '@/lib/workout-store';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Exercise } from '@/types/workout';

interface ExercisePickerProps {
  selected: Exercise[];
  onToggle: (exercise: Exercise) => void;
}

const CATEGORIES = ['All', 'Push', 'Pull', 'Legs', 'Core'] as const;

export function ExercisePicker({ selected, onToggle }: ExercisePickerProps) {
  const { exercises } = useWorkoutStore();
  const [category, setCategory] = useState<string>('All');

  const filtered = category === 'All'
    ? exercises
    : exercises.filter(e => e.category === category);

  return (
    <div>
      {/* Category tabs */}
      <div className="flex gap-1 mb-3 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all',
              category === cat
                ? 'bg-foreground/10 text-foreground/80'
                : 'text-muted-foreground/30 hover:text-muted-foreground/50 hover:bg-muted/40',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exercise list */}
      <div className="space-y-0.5">
        {filtered.map(exercise => {
          const isSelected = selected.some(s => s.id === exercise.id);
          return (
            <button
              key={exercise.id}
              onClick={() => onToggle(exercise)}
              className={cn(
                'w-full flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all border',
                isSelected
                  ? 'bg-foreground/8 border-foreground/20'
                  : 'bg-card border-border/60 hover:border-foreground/15',
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground/80 truncate">{exercise.name}</p>
                <p className="text-[11px] text-muted-foreground/30 mt-0.5">{exercise.category}</p>
              </div>
              <div className={cn(
                'h-4 w-4 rounded border-2 flex items-center justify-center transition-all shrink-0 ml-3',
                isSelected
                  ? 'bg-foreground border-foreground'
                  : 'border-border/60',
              )}>
                {isSelected && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4 7L8 3" stroke="hsl(var(--background))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-xs text-muted-foreground/20 text-center py-8">No exercises in this category.</p>
      )}
    </div>
  );
}
