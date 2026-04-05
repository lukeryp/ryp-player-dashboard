import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { WorkoutSchema, ExerciseSchema, type Workout } from '@/types/database';

export interface ChipData {
  totalSessions:    number;
  currentStreak:    number;
  longestStreak:    number;
  recentWorkouts:   Workout[];
  categoryBreakdown: Array<{ category: string; count: number }>;
  weeklyVolume:     Array<{ week: string; sessions: number; minutes: number }>;
}

export async function fetchChipData(
  supabase: SupabaseClient,
  userId: string,
): Promise<ChipData> {
  const { data: workoutsRaw, error: workoutsError } = await supabase
    .from('workouts')
    .select('id, player_id, date, duration_minutes, title, category, created_at')
    .eq('player_id', userId)
    .order('date', { ascending: false })
    .limit(60);

  if (workoutsError) throw new Error(`[chip/workouts] ${workoutsError.message}`);

  const workouts = z.array(WorkoutSchema).parse(workoutsRaw ?? []) as Workout[];

  if (workouts.length === 0) {
    return {
      totalSessions:    0,
      currentStreak:    0,
      longestStreak:    0,
      recentWorkouts:   [],
      categoryBreakdown: [],
      weeklyVolume:     [],
    };
  }

  // Fetch exercises for recent workouts
  const workoutIds = workouts.slice(0, 10).map((w) => w.id);
  const { data: _exercisesRaw } = await supabase
    .from('exercises')
    .select('id, workout_id, name, category, sets, reps, weight')
    .in('workout_id', workoutIds);

  z.array(ExerciseSchema).parse(_exercisesRaw ?? []);

  // Compute streak
  const sortedDates = workouts.map((w) => w.date).sort((a, b) => b.localeCompare(a));
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak    = 1;

  const today = new Date().toISOString().split('T')[0] ?? '';
  const latestDate = sortedDates[0] ?? '';

  // Only count streak if worked out today or yesterday
  const daysSinceLast = Math.floor(
    (new Date(today).getTime() - new Date(latestDate).getTime()) / 86_400_000,
  );
  if (daysSinceLast <= 1) {
    currentStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const curr = sortedDates[i] ?? '';
      const prev = sortedDates[i - 1] ?? '';
      const diff = Math.floor(
        (new Date(prev).getTime() - new Date(curr).getTime()) / 86_400_000,
      );
      if (diff === 1) {
        currentStreak++;
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        break;
      }
    }
  }

  // Longest streak across full history
  for (let i = 1; i < sortedDates.length; i++) {
    const curr = sortedDates[i] ?? '';
    const prev = sortedDates[i - 1] ?? '';
    const diff = Math.floor(
      (new Date(prev).getTime() - new Date(curr).getTime()) / 86_400_000,
    );
    if (diff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, currentStreak, 1);

  // Category breakdown
  const catMap: Record<string, number> = {};
  for (const w of workouts) {
    catMap[w.category] = (catMap[w.category] ?? 0) + 1;
  }
  const categoryBreakdown = Object.entries(catMap)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  // Weekly volume (last 8 weeks)
  const weeklyMap: Record<string, { sessions: number; minutes: number }> = {};
  for (const w of workouts) {
    const d    = new Date(w.date);
    const day  = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const week = new Date(d.setDate(diff)).toISOString().split('T')[0] ?? w.date;
    const cur  = weeklyMap[week] ?? { sessions: 0, minutes: 0 };
    weeklyMap[week] = {
      sessions: cur.sessions + 1,
      minutes:  cur.minutes + w.duration_minutes,
    };
  }
  const weeklyVolume = Object.entries(weeklyMap)
    .map(([week, stats]) => ({ week, ...stats }))
    .sort((a, b) => a.week.localeCompare(b.week))
    .slice(-8);

  return {
    totalSessions: workouts.length,
    currentStreak,
    longestStreak,
    recentWorkouts: workouts.slice(0, 6),
    categoryBreakdown,
    weeklyVolume,
  };
}
