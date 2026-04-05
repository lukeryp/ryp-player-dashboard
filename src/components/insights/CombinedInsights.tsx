'use client';

import React from 'react';
import { GlassCard } from '@ryp/ui';
import type { RedSummaryData } from '@/lib/queries/red';
import type { ForgeData } from '@/lib/queries/forge';
import type { ChipData } from '@/lib/queries/chip';
import type { PracticeAssessment } from '@/types/database';

interface CombinedInsightsProps {
  red:    RedSummaryData;
  forge:  ForgeData;
  chip:   ChipData;
  dna:    PracticeAssessment | null;
}

interface Insight {
  id:       string;
  type:     'warning' | 'positive' | 'info';
  title:    string;
  body:     string;
  products: string[];
}

function buildInsights(
  red:   RedSummaryData,
  forge: ForgeData,
  chip:  ChipData,
  dna:   PracticeAssessment | null,
): Insight[] {
  const insights: Insight[] = [];

  // ── Putting: drill improving but strokes gained getting worse ───────────────
  const puttingScore = forge.categoryScores.find((c) => c.category === 'putting');
  if (puttingScore && red.avgPutts !== null) {
    if (puttingScore.trend > 2 && red.avgPutts > 33) {
      insights.push({
        id:       'putting-gap',
        type:     'warning',
        title:    'Practice vs. Reality Gap — Putting',
        body:     `Your putting drill scores improved ${puttingScore.trend.toFixed(1)} points last period, but your on-course average of ${red.avgPutts.toFixed(1)} putts per round is still high. You may be practicing in low-pressure conditions that don't transfer. Try pressure simulations in the Crucible zone.`,
        products: ['Red', 'FORGE', 'Practice DNA'],
      });
    }
  }

  // ── Arena time vs. on-course pressure scores ────────────────────────────────
  if (dna !== null) {
    const arenaTime    = dna.zone_arena;
    const crucibleTime = dna.zone_crucible;

    if (arenaTime > 55 && crucibleTime < 30) {
      insights.push({
        id:       'arena-crucible-gap',
        type:     'warning',
        title:    'Too Much Arena, Not Enough Crucible',
        body:     `${arenaTime.toFixed(0)}% of your practice time is Arena (competition mode), but your Crucible score is only ${crucibleTime.toFixed(0)}. Without enough pressure-simulation training, Arena sessions don't build the mental reps needed for consistent on-course execution.`,
        products: ['Practice DNA', 'FORGE'],
      });
    }

    if (crucibleTime > 60) {
      insights.push({
        id:       'crucible-high',
        type:     'positive',
        title:    'Strong Crucible Investment',
        body:     `${crucibleTime.toFixed(0)}% Crucible zone health is excellent. Pressure-simulation training at this level typically correlates with lower scoring variance on the course. Keep building on this foundation.`,
        products: ['Practice DNA', 'Red'],
      });
    }
  }

  // ── Fitness consistency vs. scoring trends ──────────────────────────────────
  if (chip.currentStreak >= 5 && red.scoringTrend.length >= 3) {
    const recentScores = red.scoringTrend.slice(-3).map((r) => r.scoreToPar);
    const avgRecent    = recentScores.reduce((s, n) => s + n, 0) / recentScores.length;
    if (avgRecent < 0) {
      insights.push({
        id:       'fitness-score-positive',
        type:     'positive',
        title:    'Fitness Consistency Correlating with Better Scores',
        body:     `You're on a ${chip.currentStreak}-day workout streak, and your last 3 rounds averaged ${avgRecent.toFixed(1)} to par. Athletes who maintain consistent fitness routines during active scoring stretches typically see a 12–18% reduction in late-round scoring variance.`,
        products: ['CHIP', 'Red'],
      });
    }
  }

  if (chip.currentStreak === 0 && chip.totalSessions > 0) {
    insights.push({
      id:       'fitness-streak-broken',
      type:     'warning',
      title:    'Fitness Streak Broken',
      body:     `Your workout streak has reset. Research shows golf-specific fitness consistency drops off quickly after 3+ days without training. Getting back to the gym today protects your physical edge heading into your next round.`,
      products: ['CHIP'],
    });
  }

  // ── Approach game improving ─────────────────────────────────────────────────
  const approachScore = forge.categoryScores.find((c) => c.category === 'approach');
  if (approachScore && approachScore.trend > 3 && red.girPercent !== null) {
    insights.push({
      id:       'approach-improving',
      type:     'positive',
      title:    'Approach Drills Translating to GIR',
      body:     `Your Approach drill scores are up ${approachScore.trend.toFixed(1)} points and your GIR sits at ${red.girPercent.toFixed(0)}%. When approach practice improvement correlates with real GIR gains, you're drilling the right patterns. Keep the feedback loop going.`,
      products: ['FORGE', 'Red'],
    });
  }

  // ── GIR low but chipping decent ────────────────────────────────────────────
  const chippingScore = forge.categoryScores.find((c) => c.category === 'chipping');
  if (
    red.girPercent !== null && red.girPercent < 35 &&
    chippingScore && chippingScore.avg > 60
  ) {
    insights.push({
      id:       'gir-chip-strategy',
      type:     'info',
      title:    'Leverage Your Short Game Strength',
      body:     `Your GIR is ${red.girPercent.toFixed(0)}%, meaning you're often chipping in. Your Chipping drill avg of ${chippingScore.avg.toFixed(0)} is solid — this is a real scoring asset. Focus your FORGE sessions on making more short-game reps to capitalize on your miss patterns.`,
      products: ['Red', 'FORGE'],
    });
  }

  // ── Persona-specific insight ────────────────────────────────────────────────
  if (dna?.persona === 'Warrior' && chip.currentStreak >= 3) {
    insights.push({
      id:       'warrior-fitness',
      type:     'info',
      title:    'Warrior Profile: Channel Intensity Productively',
      body:     `Your Warrior profile thrives on intensity, and your ${chip.currentStreak}-day fitness streak shows it. Make sure your FORGE sessions include competitive drill formats — Warrior types lose engagement in rote repetition. Leaderboards and timed challenges sustain your training edge.`,
      products: ['Practice DNA', 'CHIP', 'FORGE'],
    });
  }

  return insights;
}

const TYPE_STYLES = {
  warning:  { border: 'border-ryp-yellow/25', bg: 'bg-ryp-yellow/[0.06]', dot: 'bg-ryp-yellow', label: 'Attention' },
  positive: { border: 'border-ryp-green/25',  bg: 'bg-ryp-green/[0.06]',  dot: 'bg-ryp-green',  label: 'Positive' },
  info:     { border: 'border-white/10',       bg: 'bg-white/[0.03]',      dot: 'bg-white/40',   label: 'Insight' },
};

export function CombinedInsights({ red, forge, chip, dna }: CombinedInsightsProps) {
  const insights = buildInsights(red, forge, chip, dna);

  const hasEnoughData =
    red.recentRounds.length > 0 ||
    forge.latestRPI !== null ||
    chip.totalSessions > 0 ||
    dna !== null;

  return (
    <GlassCard padding="lg">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.10] flex items-center justify-center text-base">🧠</div>
        <div>
          <h2 className="font-heading text-lg font-bold text-white">Combined Insights</h2>
          <p className="text-white/40 font-body text-xs">Cross-product analysis from all your data</p>
        </div>
      </div>

      {!hasEnoughData ? (
        <div className="text-center py-8">
          <p className="text-white/30 font-body text-sm">
            Insights will appear once you have data across Red, FORGE, CHIP, and Practice DNA.
          </p>
        </div>
      ) : insights.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-3xl mb-3">✅</p>
          <p className="font-heading text-base font-bold text-white mb-1">All Systems Aligned</p>
          <p className="text-white/40 font-body text-sm">
            No gaps or mismatches detected between your training and on-course performance. Keep it up.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => {
            const style = TYPE_STYLES[insight.type];
            return (
              <div
                key={insight.id}
                className={`rounded-xl border p-4 ${style.bg} ${style.border}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${style.dot}`} aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="font-heading text-sm font-bold text-white">{insight.title}</h3>
                      {insight.products.map((p) => (
                        <span
                          key={p}
                          className="text-xs text-white/30 font-body px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.04]"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-white/60 font-body leading-relaxed">{insight.body}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
