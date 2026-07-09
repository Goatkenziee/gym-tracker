'use client';

import Link from 'next/link';
import { useWorkoutStore } from '@/lib/workout-store';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/states/empty-state';
import { Plus, Dumbbell, Clock, CheckCircle, BarChart3, Flame, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const { workouts, loaded } = useWorkoutStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !loaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const activeWorkouts = workouts.filter(w => !w.completed);
  const completedWorkouts = workouts.filter(w => w.completed);
  const recentWorkouts = workouts.slice(0, 10);

  const totalSets = workouts.reduce((sum, w) =>
    sum + w.exercises.reduce((s, e) => s + e.sets.length, 0), 0);
  const completedSets = workouts.reduce((sum, w) =>
    sum + w.exercises.reduce((s, e) => s + e.sets.filter(set => set.completed).length, 0), 0);
  const totalWeight = workouts.reduce((sum, w) =>
    sum + w.exercises.reduce((s, e) =>
      s + e.sets.filter(set => set.completed).reduce((ss, set) => ss + set.weightKg * set.reps, 0), 0), 0);

  const stats = [
    { label: 'Workouts', value: workouts.length.toString(), icon: <Dumbbell className="h-4 w-4" />, color: 'text-primary' },
    { label: 'Sets Done', value: completedSets.toString(), icon: <CheckCircle className="h-4 w-4" />, color: 'text-success' },
    { label: 'Total Volume', value: totalWeight > 1000 ? `${(totalWeight / 1000).toFixed(1)}t` : `${totalWeight}kg`, icon: <TrendingUp className="h-4 w-4" />, color: 'text-orange-500' },
    { label: 'Active', value: activeWorkouts.length.toString(), icon: <Flame className="h-4 w-4" />, color: 'text-destructive' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <Container>
        <PageHeader
          title="My Gym"
          description="Track your workouts, build strength."
          actions={
            <Link href="/new-workout">
              <Button className="gap-1.5">
                <Plus className="h-4 w-4" />
                New Workout
              </Button>
            </Link>
          }
        />

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {stats.map(s => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <span className={s.color}>{s.icon}</span>
                  <span>{s.label}</span>
                </div>
                <p className="text-2xl font-bold tracking-tight">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active workouts */}
        {activeWorkouts.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Flame className="h-5 w-5 text-destructive" />
              Active Workouts
            </h2>
            <div className="space-y-2">
              {activeWorkouts.map(w => {
                const done = w.exercises.reduce((s, e) => s + e.sets.filter(s => s.completed).length, 0);
                const total = w.exercises.reduce((s, e) => s + e.sets.length, 0);
                return (
                  <Link key={w.id} href={`/workout/${w.id}`}>
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{w.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {w.exercises.length} exercises · {done}/{total} sets done
                          </p>
                        </div>
                        <Badge tone="outline" className="text-primary">In Progress</Badge>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent workouts */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Recent Workouts
          </h2>
          {recentWorkouts.length === 0 ? (
            <EmptyState
              icon={<Dumbbell className="h-10 w-10" />}
              title="No workouts yet"
              description="Start your first workout to begin tracking your progress."
              action={
                <Link href="/new-workout">
                  <Button className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Start Workout
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-2">
              {recentWorkouts.map(w => {
                const done = w.exercises.reduce((s, e) => s + e.sets.filter(s => s.completed).length, 0);
                const total = w.exercises.reduce((s, e) => s + e.sets.length, 0);
                return (
                  <Link key={w.id} href={`/workout/${w.id}`}>
                    <Card className="hover:border-muted-foreground/30 transition-colors cursor-pointer">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${w.completed ? 'bg-primary/10' : 'bg-muted'}`}>
                            {w.completed
                              ? <CheckCircle className="h-4 w-4 text-primary" />
                              : <Dumbbell className="h-4 w-4 text-muted-foreground" />
                            }
                          </div>
                          <div>
                            <p className="font-medium">{w.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {w.date} · {w.exercises.length} exercises · {done}/{total} sets
                            </p>
                          </div>
                        </div>
                        {w.completed && <Badge tone="success">Done</Badge>}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
