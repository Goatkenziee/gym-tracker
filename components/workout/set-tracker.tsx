'use client';

import { SetRecord, ExerciseEntry } from '@/types/workout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, X, Check, Dumbbell } from 'lucide-react';

interface Props {
  entry: ExerciseEntry;
  onUpdateSets: (sets: SetRecord[]) => void;
  onRemove: () => void;
}

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export function SetTracker({ entry, onUpdateSets, onRemove }: Props) {
  const addSet = () => {
    const lastSet = entry.sets[entry.sets.length - 1];
    const newSet: SetRecord = {
      id: generateId(),
      reps: lastSet?.reps ?? 10,
      weightKg: lastSet?.weightKg ?? 0,
      completed: false,
    };
    onUpdateSets([...entry.sets, newSet]);
  };

  const updateSet = (id: string, updates: Partial<SetRecord>) => {
    onUpdateSets(entry.sets.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const removeSet = (id: string) => {
    onUpdateSets(entry.sets.filter(s => s.id !== id));
  };

  const toggleComplete = (id: string) => {
    const set = entry.sets.find(s => s.id === id);
    if (set) updateSet(id, { completed: !set.completed });
  };

  return (
    <Card className="border-l-4 border-l-primary/40">
      <CardHeader className="pb-2 flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">{entry.exerciseName}</CardTitle>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Header row */}
        <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 text-xs font-medium text-muted-foreground px-1">
          <span className="w-6 text-center">#</span>
          <span>Weight (kg)</span>
          <span>Reps</span>
          <span className="w-8" />
        </div>

        {entry.sets.map((set, i) => (
          <div key={set.id} className={`grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center rounded-md p-1.5 transition-colors ${set.completed ? 'bg-primary/5' : ''}`}>
            <span className="w-6 text-center text-sm font-mono text-muted-foreground">{i + 1}</span>
            <Input
              type="number"
              min={0}
              step={0.5}
              value={set.weightKg || ''}
              onChange={e => updateSet(set.id, { weightKg: parseFloat(e.target.value) || 0 })}
              className="h-8 text-sm"
              placeholder="kg"
            />
            <Input
              type="number"
              min={1}
              step={1}
              value={set.reps || ''}
              onChange={e => updateSet(set.id, { reps: parseInt(e.target.value) || 0 })}
              className="h-8 text-sm"
              placeholder="reps"
            />
            <div className="flex gap-1">
              <Button
                variant={set.completed ? 'default' : 'outline'}
                size="icon"
                className="h-8 w-8"
                onClick={() => toggleComplete(set.id)}
              >
                <Check className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => removeSet(set.id)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}

        <Button variant="outline" size="sm" className="w-full gap-1 mt-1" onClick={addSet}>
          <Plus className="h-3.5 w-3.5" />
          Add Set
        </Button>
      </CardContent>
    </Card>
  );
}
