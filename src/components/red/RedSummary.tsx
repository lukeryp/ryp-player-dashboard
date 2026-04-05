'use client';

import React from 'react';
import {
  GlassCard, StatCard,
  RypAreaChart, RypBarChart,
  EmptyState,
  formatDate, formatPercent,
} from '@ryp/ui';

/** Format a score-to-par delta: +3, -1, E */
function fmtToPar(delta: number): string {
  if (delta === 0) return 'E';
  return delta > 0 ? `+${delta}` : String(delta);
}

/** Tailwind text color for a score-to-par delta */
function toParColor(delta: number): string {
  if (delta <= -2) return 'text-ryp-yellow';
  if (delta === -1) return 'text-ryp-green';
  if (delta === 0)  return 'text-white';
  if (delta === 1)  return 'text-white/70';
  if (delta === 2)  return 'text-orange-400';
  return 'text-ryp-danger';
}
import type { RedSummaryData } from '@/lib/queries/red';

interface RedSummaryProps {
  data: RedSummaryData;
}

function SectionHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-8 rounded-lg bg-ryp-green/10 border border-ryp-green/20 flex items-center justify-center text-base shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="font-heading text-lg font-bold text-white leading-tight">{title}</h2>
        {subtitle && <p className="text-white/40 font-body text-xs">{subtitle}</p>}
      </div>
    </div>
  );
}

export function RedSummary({ data }: RedSummaryProps) {
  const {
    recentRounds, scoringTrend, bestRound, worstRound,
    avgSSL, avgESL, avgPutts, girPercent, fairwayPercent,
  } = data;

  if (recentRounds.length === 0) {
    return (
      <GlassCard padding="lg">
        <SectionHeader icon="🔴" title="RYP Red" subtitle="Scoring & on-course performance" />
        <EmptyState
          title="No rounds recorded"
          description="Your round data will appear here once you log your first round in RYP Red."
        />
      </GlassCard>
    );
  }

  const scoreToParData = scoringTrend.map((r) => ({
    ...r,
    label: formatDate(r.date),
  }));

  return (
    <GlassCard padding="lg">
      <SectionHeader icon="🔴" title="RYP Red" subtitle="Scoring & on-course performance" />

      {/* Key stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Avg Score to Par"
          value={
            scoringTrend.length > 0
              ? fmtToPar(
                  Math.round(
                    scoringTrend.reduce((s, r) => s + r.scoreToPar, 0) / scoringTrend.length,
                  ),
                )
              : '—'
          }
          subLabel="recent rounds"
        />
        <StatCard
          label="Avg Putts/Round"
          value={avgPutts !== null ? avgPutts.toFixed(1) : '—'}
          subLabel="per round"
        />
        <StatCard
          label="GIR %"
          value={girPercent !== null ? formatPercent(girPercent / 100) : '—'}
          variant={girPercent !== null && girPercent >= 50 ? 'green' : 'default'}
        />
        <StatCard
          label="Fairways Hit"
          value={fairwayPercent !== null ? formatPercent(fairwayPercent / 100) : '—'}
          variant={fairwayPercent !== null && fairwayPercent >= 60 ? 'green' : 'default'}
        />
      </div>

      {/* SSL / ESL */}
      {(avgSSL !== null || avgESL !== null) && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {avgSSL !== null && (
            <GlassCard variant="green" padding="md">
              <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-1">Avg SSL</p>
              <p className="font-heading text-2xl font-bold text-ryp-green tabular-nums">
                {avgSSL.toFixed(2)}
              </p>
              <p className="text-xs text-white/30 font-body mt-0.5">Scorecard Score Line</p>
            </GlassCard>
          )}
          {avgESL !== null && (
            <GlassCard variant="yellow" padding="md">
              <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-1">Avg ESL</p>
              <p className="font-heading text-2xl font-bold text-ryp-yellow tabular-nums">
                {avgESL.toFixed(2)}
              </p>
              <p className="text-xs text-white/30 font-body mt-0.5">Expected Score Line</p>
            </GlassCard>
          )}
        </div>
      )}

      {/* Scoring trend chart */}
      {scoreToParData.length > 1 && (
        <div className="mb-6">
          <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-3">
            Score to Par Trend
          </p>
          <RypAreaChart
            data={scoreToParData}
            xKey="label"
            series={[{ dataKey: 'scoreToPar', name: 'Score to Par', color: '#00af51' }]}
            height={180}
            valueFormatter={(v) => (v > 0 ? `+${v}` : String(v))}
          />
        </div>
      )}

      {/* Best / worst */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {bestRound && (
          <GlassCard variant="green" padding="md">
            <p className="text-xs text-ryp-green/80 font-body uppercase tracking-wider mb-2">Best Round</p>
            <p className="font-heading text-xl font-bold text-white">{bestRound.course_name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-body text-sm text-white/60">{formatDate(bestRound.date)}</span>
              <span
                className={`font-heading text-lg font-bold ${toParColor(bestRound.total_score - bestRound.par)}`}
              >
                {fmtToPar(bestRound.total_score - bestRound.par)}
              </span>
            </div>
          </GlassCard>
        )}
        {worstRound && (
          <GlassCard padding="md">
            <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-2">Worst Round</p>
            <p className="font-heading text-xl font-bold text-white">{worstRound.course_name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-body text-sm text-white/60">{formatDate(worstRound.date)}</span>
              <span
                className={`font-heading text-lg font-bold ${toParColor(worstRound.total_score - worstRound.par)}`}
              >
                {fmtToPar(worstRound.total_score - worstRound.par)}
              </span>
            </div>
          </GlassCard>
        )}
      </div>

      {/* Recent rounds table */}
      <div>
        <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-3">Recent Rounds</p>
        <div className="space-y-2">
          {recentRounds.map((round) => {
            const toPar = round.total_score - round.par;
            return (
              <div
                key={round.id}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-white/[0.03] border border-white/[0.05]"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white font-body truncate">{round.course_name}</p>
                  <p className="text-xs text-white/40 font-body">{formatDate(round.date)}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-white/50 font-body text-sm tabular-nums">{round.total_score}</span>
                  <span
                    className={`font-heading text-base font-bold tabular-nums ${toParColor(toPar)}`}
                  >
                    {fmtToPar(toPar)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Round distribution bar */}
      {scoringTrend.length > 2 && (
        <div className="mt-6">
          <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-3">Round Scores</p>
          <RypBarChart
            data={scoreToParData.slice(-10)}
            xKey="label"
            series={[{ dataKey: 'score', name: 'Score', color: '#00af51' }]}
            height={140}
          />
        </div>
      )}
    </GlassCard>
  );
}
