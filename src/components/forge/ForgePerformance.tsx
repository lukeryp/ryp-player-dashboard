'use client';

import React from 'react';
import { GlassCard, StatCard, RypAreaChart, RypRadarChart, EmptyState, formatDate } from '@ryp/ui';
import type { ForgeData } from '@/lib/queries/forge';
import type { ForgeDrillCategory } from '@/types/database';
import { cn } from '@ryp/ui';

interface ForgePerformanceProps {
  data: ForgeData;
}

const CATEGORY_META: Record<ForgeDrillCategory, { label: string; color: string; icon: string }> = {
  driving:  { label: 'Driving',  color: '#00af51', icon: '🏌️' },
  approach: { label: 'Approach', color: '#f4ee19', icon: '🎯' },
  chipping: { label: 'Chipping', color: '#00d463', icon: '⛳' },
  putting:  { label: 'Putting',  color: '#c9c310', icon: '🏠' },
};

function RPIGauge({ value }: { value: number }) {
  const pct   = Math.min(Math.max(value, 0), 100);
  const angle = -135 + (pct / 100) * 270;
  const color = pct >= 75 ? '#00af51' : pct >= 50 ? '#f4ee19' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-32 h-20 flex items-end justify-center">
        {/* Track arc (SVG) */}
        <svg viewBox="0 0 128 80" className="absolute inset-0 w-full h-full" aria-hidden="true">
          <path
            d="M 14 70 A 50 50 0 1 1 114 70"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 14 70 A 50 50 0 1 1 114 70"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * 157} 157`}
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        </svg>
        {/* Center needle indicator */}
        <div className="relative z-10 mb-1">
          <p className="font-heading text-3xl font-black tabular-nums" style={{ color }}>
            {value.toFixed(0)}
          </p>
        </div>
      </div>
      <p className="text-xs text-white/40 font-body uppercase tracking-wider">RYP Performance Index</p>
    </div>
  );
}

export function ForgePerformance({ data }: ForgePerformanceProps) {
  const { latestRPI, rpiTrend, categoryScores, recentSessions } = data;

  if (latestRPI === null) {
    return (
      <GlassCard padding="lg">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-ryp-yellow/10 border border-ryp-yellow/20 flex items-center justify-center text-base">🔨</div>
          <div>
            <h2 className="font-heading text-lg font-bold text-white">FORGE Performance</h2>
            <p className="text-white/40 font-body text-xs">Drill scores & training index</p>
          </div>
        </div>
        <EmptyState
          title="No FORGE sessions yet"
          description="Complete a drill session in FORGE to see your Performance Index and scores here."
        />
      </GlassCard>
    );
  }

  // Radar data for category scores
  const radarData = categoryScores.map((cs) => ({
    category: CATEGORY_META[cs.category].label,
    score:    Math.round(cs.avg),
  }));

  return (
    <GlassCard padding="lg">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-ryp-yellow/10 border border-ryp-yellow/20 flex items-center justify-center text-base">🔨</div>
        <div>
          <h2 className="font-heading text-lg font-bold text-white">FORGE Performance</h2>
          <p className="text-white/40 font-body text-xs">Drill scores & training index</p>
        </div>
      </div>

      {/* RPI Gauge */}
      <div className="flex justify-center mb-6">
        <RPIGauge value={latestRPI} />
      </div>

      {/* Category scores */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {categoryScores.map((cs) => {
          const meta  = CATEGORY_META[cs.category];
          const trend = cs.trend >= 0 ? `+${cs.trend.toFixed(1)}` : cs.trend.toFixed(1);
          return (
            <StatCard
              key={cs.category}
              label={meta.label}
              value={cs.avg.toFixed(0)}
              trend={trend}
              trendDirection={cs.trend > 0 ? 'up' : cs.trend < 0 ? 'down' : 'neutral'}
              icon={<span className="text-base">{meta.icon}</span>}
            />
          );
        })}
      </div>

      {/* Radar chart */}
      {radarData.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-3">Skill Profile</p>
          <RypRadarChart
            data={radarData}
            angleKey="category"
            series={[{ dataKey: 'score', name: 'Score', color: '#00af51', fillOpacity: 0.2 }]}
            height={220}
          />
        </div>
      )}

      {/* RPI trend */}
      {rpiTrend.length > 1 && (
        <div className="mb-6">
          <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-3">
            Performance Index Trend
          </p>
          <RypAreaChart
            data={rpiTrend.map((r) => ({ ...r, label: r.date }))}
            xKey="label"
            series={[{ dataKey: 'rpi', name: 'RPI', color: '#f4ee19' }]}
            height={160}
            valueFormatter={(v) => v.toFixed(0)}
          />
        </div>
      )}

      {/* Recent sessions */}
      {recentSessions.length > 0 && (
        <div>
          <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-3">Recent Sessions</p>
          <div className="space-y-2">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-white/[0.03] border border-white/[0.05]"
              >
                <p className="text-sm text-white/60 font-body">{formatDate(session.date)}</p>
                <div className="flex items-center gap-1">
                  <span
                    className={cn(
                      'font-heading text-base font-bold tabular-nums',
                      session.ryp_performance_index >= 75
                        ? 'text-ryp-green'
                        : session.ryp_performance_index >= 50
                        ? 'text-ryp-yellow'
                        : 'text-ryp-danger',
                    )}
                  >
                    {session.ryp_performance_index.toFixed(0)}
                  </span>
                  <span className="text-xs text-white/30 font-body">RPI</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
}
