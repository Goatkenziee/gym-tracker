'use client';

import Link from 'next/link';
import { useWorkoutStore } from '@/lib/workout-store';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/states/empty-state';
import { cn } from '@/lib/utils';
import { Plus, Dumbbell, Clock, CheckCircle, TrendingUp, Flame, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const { workouts, loaded } = useWorkoutStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !loaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="h-5 w-5 rounded-full border-2 border-foreground/10 border-t-foreground/60 animate-spin" />
          <span className="text-xs text-muted-foreground/20">Loading...</span>
        </div>
      </div>
    );
  }

  const activeWorkouts = workouts.filter(w => !w.completed);
  const completedWorkouts = workouts.filter(w => w.completed);
  const recentWorkouts = [...workouts].sort((a, b) => {
    const aDate = a.endTime || a.startTime || a.date || '';
    const bDate = b.endTime || b.startTime || b.date || '';
    return bDate.localeCompare(aDate);
  }).slice(0, 10);

  const totalSets = workouts.reduce((sum, w) =>
    sum + w.exercises.reduce((s, e) => s + e.sets.length, 0), 0);
  const completedSets = workouts.reduce((sum, w) =>
    sum + w.exercises.reduce((s, e) => s + e.sets.filter(set => set.completed).length, 0), 0);
  const totalWeight = workouts.reduce((sum, w) =>
    sum + w.exercises.reduce((s, e) =>
      s + e.sets.filter(set => set.completed).reduce((ss, set) => ss + set.weightKg * set.reps, 0), 0), 0);

  const stats = [
    { label: 'Workouts', value: workouts.length.toString(), icon: Dumbbell, change: null as string | null },
    { label: 'Sets Done', value: completedSets.toString(), icon: CheckCircle, change: completedSets > 0 ? `${Math.round((completedSets / (totalSets || 1)) * 100)}%` : null },
    { label: 'Volume', value: totalWeight > 1000 ? `${(totalWeight / 1000).toFixed(1)}t` : `${totalWeight}kg`, icon: TrendingUp, change: null },
    { label: 'Active', value: activeWorkouts.length.toString(), icon: Flame, change: null },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <Container>
        <PageHeader
          title="Dashboard"
          description="Track your gym progress"
          actions={
            <Link href="/new-workout">
              <Button className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                New
              </Button>
            </Link>
          }
        />

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-px bg-border/40 rounded-xl overflow-hidden mt-2 border border-border/60">
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-card p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground/20" />
                  {s.change && (
                    <span className="text-[10px] font-medium text-foreground/30">{s.change}</span>
                  )}
                </div>
                <p className="text-lg sm:text-xl font-semibold text-foreground/90 tracking-tight">{s.value}</p>
                <p className="text-[10px] text-muted-foreground/20 mt-0.5">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Active workouts */}
        {activeWorkouts.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-muted-foreground/30 uppercase tracking-wider">In Progress</h2>
              <span className="text-[10px] text-muted-foreground/15">{activeWorkouts.length}</span>
            </div>
            <div className="space-y-1">
              {activeWorkouts.map(w => {
                const done = w.exercises.reduce((s, e) => s + e.sets.filter(s => s.completed).length, 0);
                const total = w.exercises.reduce((s, e) => s + e.sets.length, 0);
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <Link key={w.id} href={`/workout/${w.id}`}>
                    <div className="group flex items-center justify-between rounded-xl px-4 py-3 bg-card border border-border/60 hover:border-foreground/15 transition-all">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground/80 truncate">{w.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-1 flex-1 max-w-[120px] rounded-full bg-muted/60 overflow-hidden">
                            <div className="h-full rounded-full bg-foreground/40 transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] text-muted-foreground/20 font-medium">{done}/{total}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/15 group-hover:text-muted-foreground/30 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent workouts */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-muted-foreground/30 uppercase tracking-wider">Recent</h2>
            <span className="text-[10px] text-muted-foreground/15">{recentWorkouts.length}</span>
          </div>
          {recentWorkouts.length > 0 ? (
            <div className="space-y-1">
              {recentWorkouts.map(w => {
                const done = w.exercises.reduce((s, e) => s + e.sets.filter(s => s.completed).length, 0);
                const total = w.exercises.reduce((s, e) => s + e.sets.length, 0);
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <Link key={w.id} href={`/workout/${w.id}`}>
                    <div className="group flex items-center justify-between rounded-xl px-4 py-3 bg-card border border-border/60 hover:border-foreground/15 transition-all">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground/80 truncate">{w.name}</p>
                          {w.completed && <Badge tone="success" className="text-[10px]">Done</Badge>}
                        </div>
                        <p className="text-[10px] text-muted-foreground/15 mt-0.5">
                          {w.date} · {done}/{total} sets
                          {pct > 0 && ` · ${pct}%`}
                        </p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/15 group-hover:text-muted-foreground/30 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Dumbbell}
              title="No workouts yet"
              description="Start your first workout to see it here"
              action={
                <Link href="/new-workout">
                  <Button variant="primary" size="sm">
                    <Plus className="h-3.5 w-3.5" />
                    New Workout
                  </Button>
                </Link>
              }
            />
          )}
        </div>
      </Container>
    </div>
  );
}
