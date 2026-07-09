'use client';

import { useParams, useRouter } from 'next/navigation';
import { useWorkoutStore } from '@/lib/workout-store';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SetTracker } from '@/components/workout/set-tracker';
import { cn } from '@/lib/utils';
import { Check, Timer, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { workouts, completeWorkout, loaded } = useWorkoutStore();
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const workout = workouts.find(w => w.id === params.id);

  // Timer
  useEffect(() => {
    if (workout && !workout.completed) {
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [workout?.completed]);

  if (!mounted || !loaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="h-5 w-5 rounded-full border-2 border-foreground/10 border-t-foreground/60 animate-spin" />
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xs text-muted-foreground/20">Workout not found</p>
      </div>
    );
  }

  const totalSets = workout.exercises.reduce((s, e) => s + e.sets.length, 0);
  const completedSets = workout.exercises.reduce((s, e) => s + e.sets.filter(set => set.completed).length, 0);
  const allDone = totalSets > 0 && completedSets === totalSets;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    completeWorkout(workout.id);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <Container>
        <PageHeader
          title={workout.name}
          description={`${workout.exercises.length} exercises`}
          backHref="/"
        />

        {/* Timer + progress bar */}
        <div className="flex items-center justify-between mt-2 mb-6">
          <div className="flex items-center gap-2 text-muted-foreground/20">
            <Timer className="h-3.5 w-3.5" />
            <span className="text-sm font-mono tabular-nums text-foreground/40">{formatTime(seconds)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1 w-24 rounded-full bg-muted/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-foreground/40 transition-all"
                style={{ width: totalSets > 0 ? `${(completedSets / totalSets) * 100}%` : '0%' }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground/15 font-medium">{completedSets}/{totalSets}</span>
          </div>
        </div>

        {/* Exercises */}
        <div className="space-y-2">
          {workout.exercises.map((entry, idx) => {
            const isExpanded = expanded === entry.exerciseId;
            const entryDone = entry.sets.filter(s => s.completed).length;
            const entryTotal = entry.sets.length;
            const entryPct = entryTotal > 0 ? Math.round((entryDone / entryTotal) * 100) : 0;

            return (
              <div
                key={entry.exerciseId}
                className="rounded-xl border border-border/60 bg-card overflow-hidden"
              >
                {/* Exercise header — clickable to expand */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : entry.exerciseId)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      'h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-medium shrink-0',
                      entryDone === entryTotal && entryTotal > 0
                        ? 'bg-success/15 text-success'
                        : 'bg-muted/60 text-muted-foreground/20',
                    )}>
                      {entryDone === entryTotal && entryTotal > 0 ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground/80 truncate">{entry.exerciseName}</p>
                      <p className="text-[10px] text-muted-foreground/15">
                        {entryDone}/{entryTotal} sets · {entryPct}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {entryDone === entryTotal && entryTotal > 0 && (
                      <Badge tone="success" className="text-[10px]">Done</Badge>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5 text-muted-foreground/15" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/15" />
                    )}
                  </div>
                </button>

                {/* Expandable set tracker */}
                {isExpanded && (
                  <div className="border-t border-border/40 px-4 py-3">
                    <SetTracker
                      workoutId={workout.id}
                      entry={entry}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Complete workout button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent pt-8">
          <div className="max-w-lg mx-auto">
            <Button
              onClick={handleComplete}
              disabled={!allDone}
              className={cn(
                'w-full h-12 gap-2 rounded-xl text-sm font-semibold transition-all',
                allDone
                  ? 'bg-foreground text-background hover:bg-foreground/90'
                  : 'bg-muted/60 text-muted-foreground/20 cursor-not-allowed',
              )}
            >
              <Check className="h-4 w-4" />
              {allDone ? 'Complete Workout' : `${completedSets}/${totalSets} sets done`}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
