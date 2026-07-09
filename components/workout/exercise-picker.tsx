'use client';

import { useState } from 'react';
import { Exercise, ExerciseCategory } from '@/types/workout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Dumbbell } from 'lucide-react';

const CATEGORIES: { value: ExerciseCategory; label: string }[] = [
  { value: 'chest', label: 'Chest' },
  { value: 'back', label: 'Back' },
  { value: 'legs', label: 'Legs' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'arms', label: 'Arms' },
  { value: 'core', label: 'Core' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'full-body', label: 'Full Body' },
];

interface Props {
  exercises: Exercise[];
  onSelect: (exercise: Exercise) => void;
  selectedIds: string[];
}

export function ExercisePicker({ exercises, onSelect, selectedIds }: Props) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ExerciseCategory | 'all'>('all');

  const filtered = exercises.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || e.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search exercises..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge
          tone={category === 'all' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setCategory('all')}
        >
          All
        </Badge>
        {CATEGORIES.map(c => (
          <Badge
            key={c.value}
            tone={category === c.value ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setCategory(c.value)}
          >
            {c.label}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {filtered.map(ex => {
          const selected = selectedIds.includes(ex.id);
          return (
            <Button
              key={ex.id}
              variant={selected ? 'default' : 'outline'}
              size="sm"
              className="justify-start gap-2 h-auto py-2"
              onClick={() => onSelect(ex)}
            >
              <Dumbbell className="h-3.5 w-3.5 shrink-0" />
              <span className="text-left text-sm">{ex.name}</span>
            </Button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No exercises found. Try a different search.
        </p>
      )}
    </div>
  );
}
