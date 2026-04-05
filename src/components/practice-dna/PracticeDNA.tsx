'use client';

import React from 'react';
import { GlassCard, RypRadarChart, RypPieChart, EmptyState } from '@ryp/ui';
import type { PracticeAssessment, Persona } from '@/types/database';

interface PracticeDNAProps {
  data: PracticeAssessment | null;
}

const PERSONA_META: Record<Persona, { color: string; icon: string; tagline: string }> = {
  Scientist: { color: '#3b82f6', icon: '🔬', tagline: 'Data-driven. Analytical. Process-first.' },
  Engineer:  { color: '#f4ee19', icon: '⚙️', tagline: 'Systems thinker. Builder. Methodical.' },
  Warrior:   { color: '#ef4444', icon: '⚔️', tagline: 'Competitive. Intense. Pressure-fed.' },
  Artist:    { color: '#00af51', icon: '🎨', tagline: 'Intuitive. Flow-state. Feel-driven.' },
};

const ZONE_META: Array<{ key: keyof PracticeAssessment; label: string; color: string; description: string }> = [
  { key: 'zone_assembly', label: 'Assembly', color: '#3b82f6', description: 'Fundamentals & technique building' },
  { key: 'zone_lab',      label: 'Lab',      color: '#f4ee19', description: 'Experimentation & discovery' },
  { key: 'zone_crucible', label: 'Crucible', color: '#ef4444', description: 'Pressure & simulation training' },
  { key: 'zone_arena',    label: 'Arena',    color: '#00af51', description: 'Competition & performance mode' },
];

const OCEAN_KEYS: Array<{ key: keyof PracticeAssessment; label: string }> = [
  { key: 'ocean_openness',         label: 'Openness' },
  { key: 'ocean_conscientiousness', label: 'Conscientiousness' },
  { key: 'ocean_extraversion',     label: 'Extraversion' },
  { key: 'ocean_agreeableness',    label: 'Agreeableness' },
  { key: 'ocean_neuroticism',      label: 'Neuroticism' },
];

function ZoneHealthBar({ label, value, color, description }: {
  label: string; value: number; color: string; description: string;
}) {
  const pct    = Math.min(Math.max(value, 0), 100);
  const health = pct >= 75 ? 'Strong' : pct >= 50 ? 'Developing' : 'Needs Work';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-white font-body">{label}</span>
          <p className="text-xs text-white/30 font-body">{description}</p>
        </div>
        <div className="text-right">
          <span className="font-heading text-base font-bold tabular-nums" style={{ color }}>
            {pct.toFixed(0)}
          </span>
          <p className="text-xs font-body" style={{ color: `${color}99` }}>{health}</p>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function PracticeDNA({ data }: PracticeDNAProps) {
  if (!data) {
    return (
      <GlassCard padding="lg">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-ryp-yellow/10 border border-ryp-yellow/20 flex items-center justify-center text-base">🧬</div>
          <div>
            <h2 className="font-heading text-lg font-bold text-white">Practice DNA</h2>
            <p className="text-white/40 font-body text-xs">Your training psychology & profile</p>
          </div>
        </div>
        <EmptyState
          title="No assessment yet"
          description="Complete your Practice DNA assessment to unlock your persona, neuro signature, and training zones."
        />
      </GlassCard>
    );
  }

  const persona = PERSONA_META[data.persona];

  // Zone pie data
  const zonePieData = ZONE_META.map((z) => ({
    name:  z.label,
    value: Number(data[z.key]),
    color: z.color,
  }));

  // OCEAN radar data
  const oceanRadarData = OCEAN_KEYS.map((o) => ({
    trait: o.label,
    score: Number(data[o.key]),
  }));

  return (
    <GlassCard padding="lg">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-ryp-yellow/10 border border-ryp-yellow/20 flex items-center justify-center text-base">🧬</div>
        <div>
          <h2 className="font-heading text-lg font-bold text-white">Practice DNA</h2>
          <p className="text-white/40 font-body text-xs">Your training psychology & profile</p>
        </div>
      </div>

      {/* Persona card */}
      <div
        className="rounded-xl border p-5 mb-6"
        style={{
          background:   `${persona.color}10`,
          borderColor:  `${persona.color}30`,
        }}
      >
        <div className="flex items-start gap-4">
          <span className="text-4xl">{persona.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-heading text-xl font-black text-white">{data.persona}</h3>
              <span
                className="text-xs font-body px-2 py-0.5 rounded-full border"
                style={{ color: persona.color, borderColor: `${persona.color}40`, background: `${persona.color}15` }}
              >
                Master Archetype
              </span>
            </div>
            <p className="text-sm font-body" style={{ color: `${persona.color}cc` }}>
              {persona.tagline}
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-white/30 font-body uppercase tracking-wider">Neuro Signature</p>
                <p className="text-sm font-medium text-white font-body mt-0.5">{data.neuro_signature}</p>
              </div>
              <div>
                <p className="text-xs text-white/30 font-body uppercase tracking-wider">Master Archetype</p>
                <p className="text-sm font-medium text-white font-body mt-0.5">{data.master_archetype}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zone health map */}
      <div className="mb-6">
        <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-4">Zone Health Map</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ZONE_META.map((z) => (
            <ZoneHealthBar
              key={z.key as string}
              label={z.label}
              value={Number(data[z.key])}
              color={z.color}
              description={z.description}
            />
          ))}
        </div>
      </div>

      {/* Zone distribution pie */}
      <div className="mb-6">
        <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-3">Zone Distribution</p>
        <RypPieChart
          data={zonePieData}
          height={200}
          innerRadius={50}
          outerRadius={80}
          valueFormatter={(v) => `${v.toFixed(0)}%`}
        />
      </div>

      {/* OCEAN Big Five radar */}
      <div>
        <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-3">OCEAN Big Five Profile</p>
        <RypRadarChart
          data={oceanRadarData}
          angleKey="trait"
          series={[{
            dataKey:     'score',
            name:        'Score',
            color:       persona.color,
            fillOpacity: 0.15,
          }]}
          height={240}
        />
      </div>
    </GlassCard>
  );
}
