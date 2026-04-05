'use client';

import React from 'react';
import { GlassCard, StatCard, RypBarChart, EmptyState, formatDate } from '@ryp/ui';
import type { ChipData } from '@/lib/queries/chip';

interface ChipFitnessProps {
  data: ChipData;
}

export function ChipFitness({ data }: ChipFitnessProps) {
  const {
    totalSessions, currentStreak, longestStreak,
    recentWorkouts, categoryBreakdown, weeklyVolume,
  } = data;

  if (totalSessions === 0) {
    return (
      <GlassCard padding="lg">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-ryp-green/10 border border-ryp-green/20 flex items-center justify-center text-base">💪</div>
          <div>
            <h2 className="font-heading text-lg font-bold text-white">CHIP Fitness</h2>
            <p className="text-white/40 font-body text-xs">Workout streak & training volume</p>
          </div>
        </div>
        <EmptyState
          title="No workouts logged"
          description="Log your first workout in CHIP to track your fitness streak and training patterns here."
        />
      </GlassCard>
    );
  }

  const streakColor = currentStreak >= 7
    ? 'text-ryp-green'
    : currentStreak >= 3
    ? 'text-ryp-yellow'
    : 'text-white';

  return (
    <GlassCard padding="lg">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-ryp-green/10 border border-ryp-green/20 flex items-center justify-center text-base">💪</div>
        <div>
          <h2 className="font-heading text-lg font-bold text-white">CHIP Fitness</h2>
          <p className="text-white/40 font-body text-xs">Workout streak & training volume</p>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl bg-ryp-green/[0.08] border border-ryp-green/20 p-4 text-center">
          <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-2">Streak</p>
          <p className={`font-heading text-3xl font-black tabular-nums ${streakColor}`}>
            {currentStreak}
          </p>
          <p className="text-xs text-white/30 font-body mt-1">days</p>
        </div>
        <StatCard label="Total Sessions" value={totalSessions} subLabel="all time" />
        <StatCard label="Best Streak" value={`${longestStreak}d`} subLabel="longest run" />
      </div>

      {/* Weekly volume chart */}
      {weeklyVolume.length > 1 && (
        <div className="mb-6">
          <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-3">
            Weekly Sessions
          </p>
          <RypBarChart
            data={weeklyVolume.map((w) => ({ ...w, label: w.week }))}
            xKey="label"
            series={[{ dataKey: 'sessions', name: 'Sessions', color: '#00af51' }]}
            height={140}
          />
        </div>
      )}

      {/* Category breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-3">
            Workout Categories
          </p>
          <div className="space-y-2">
            {categoryBreakdown.map(({ category, count }) => {
              const pct = Math.round((count / totalSessions) * 100);
              return (
                <div key={category} className="flex items-center gap-3">
                  <p className="text-sm text-white/60 font-body w-28 shrink-0 capitalize">{category}</p>
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-ryp-green transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-white/40 font-body tabular-nums w-10 text-right">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent workouts */}
      {recentWorkouts.length > 0 && (
        <div>
          <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-3">Recent Workouts</p>
          <div className="space-y-2">
            {recentWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-white/[0.03] border border-white/[0.05]"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white font-body truncate">{workout.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-white/40 font-body">{formatDate(workout.date)}</span>
                    <span className="text-white/20">·</span>
                    <span className="text-xs text-white/40 font-body capitalize">{workout.category}</span>
                  </div>
                </div>
                <span className="text-xs text-white/40 font-body shrink-0">
                  {workout.duration_minutes}m
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
}
