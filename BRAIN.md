# BRAIN.md

## What this app does
A mobile-first PWA gym workout tracker. Create workouts, add exercises, track sets/reps/weight, and view history.

## Current state
✅ Built and compiling. 3 pages: Dashboard, New Workout, Active Workout.

## Tech stack and why
- **Next.js 14** — fast, mobile-responsive, PWA-ready
- **Tailwind CSS** — utility-first, dark theme
- **Zustand** (localStorage) — lightweight state persistence, no DB needed for v1
- **lucide-react** — consistent icon set
- **PWA manifest** — installable on mobile home screen

## What has been built
- `app/page.tsx` — Dashboard with stats (workouts, sets, volume, active), active workout list, recent workout history
- `app/new-workout/page.tsx` — Create workouts: name, pick exercises from library, track sets
- `app/workout/[id]/page.tsx` — Active workout view with live timer, set tracking, complete button
- `components/workout/exercise-picker.tsx` — Filterable exercise library (Push/Pull/Legs/Core categories)
- `components/workout/set-tracker.tsx` — Per-exercise set management (add/remove/toggle complete, reps, weight)
- `lib/workout-store.ts` — Zustand store with localStorage persistence
- `types/workout.ts` — TypeScript types (Exercise, SetRecord, ExerciseEntry, Workout)
- `public/manifest.json` + SVG icons — PWA install support
- `components/layout/page-header.tsx` — Updated with back button support

## Latest verification
- ✅ Build: `next build` compiles successfully (0 errors)
- ✅ Pages: / (dashboard), /new-workout, /workout/[id]
- ✅ Types: all TypeScript interfaces defined
- ✅ Store: Zustand + localStorage persistence

## What's still pending
- Deploy to Vercel for a live URL
- Add exercise library editing (create custom exercises)
- Add charts/progress over time
- Add rest timer between sets
- Add workout templates
- Add data export

## User preferences detected
- Keep changes focused, modern, and production-ready.
- Mobile-first PWA approach.

## Run notes
- Last updated: 2026-07-09T21:20:00.000Z
- Autonomous iteration: 1
