'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@ryp/ui';
import { useAuth } from '@/components/providers/AuthProvider';
import { getSupabase } from '@/lib/supabase';
import { fetchProfile } from '@/lib/queries/profile';
import { fetchRedSummary, type RedSummaryData } from '@/lib/queries/red';
import { fetchForgeData, type ForgeData } from '@/lib/queries/forge';
import { fetchChipData, type ChipData } from '@/lib/queries/chip';
import { fetchPracticeAssessment } from '@/lib/queries/practice-dna';
import { PlayerProfileHeader } from '@/components/profile/PlayerProfileHeader';
import { RedSummary } from '@/components/red/RedSummary';
import { ForgePerformance } from '@/components/forge/ForgePerformance';
import { ChipFitness } from '@/components/chip/ChipFitness';
import { PracticeDNA } from '@/components/practice-dna/PracticeDNA';
import { CombinedInsights } from '@/components/insights/CombinedInsights';
import type { Profile, PracticeAssessment } from '@/types/database';

interface DashboardData {
  profile:     Profile;
  red:         RedSummaryData;
  forge:       ForgeData;
  chip:        ChipData;
  dna:         PracticeAssessment | null;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-48 rounded-xl bg-white/[0.03] border border-white/[0.05]" />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [data, setData]       = useState<DashboardData | null>(null);
  const [error, setError]     = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  const loadData = useCallback(async (userId: string) => {
    setFetching(true);
    setError(null);

    try {
      const supabase = getSupabase();

      const [profile, red, forge, chip, dna] = await Promise.all([
        fetchProfile(supabase, userId),
        fetchRedSummary(supabase, userId),
        fetchForgeData(supabase, userId),
        fetchChipData(supabase, userId),
        fetchPracticeAssessment(supabase, userId),
      ]);

      if (!profile) {
        setError('Profile not found. Your account may not be fully set up.');
        return;
      }

      setData({ profile, red, forge, chip, dna });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load dashboard data.';
      setError(message);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    void loadData(user.id);
  }, [user, authLoading, router, loadData]);

  // ── Auth loading ───────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // ── Not logged in ─────────────────────────────────────────────────────────
  if (!user) return null;

  return (
    <div className="min-h-screen bg-black">
      {/* Background gradient */}
      <div
        className="pointer-events-none fixed inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 40% at 50% -10%, rgba(0,175,81,0.06) 0%, transparent 60%)',
        }}
      />

      <main className="relative max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-10 space-y-5">
        {/* Loading state */}
        {fetching && !data && <DashboardSkeleton />}

        {/* Error state */}
        {error && !fetching && (
          <div className="rounded-xl border border-ryp-danger/20 bg-ryp-danger/[0.06] p-6 text-center">
            <p className="font-heading text-base font-bold text-ryp-danger mb-1">Unable to load dashboard</p>
            <p className="text-sm text-white/50 font-body">{error}</p>
            <button
              onClick={() => user && void loadData(user.id)}
              className="mt-4 text-sm text-ryp-green font-body hover:text-ryp-green-light transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* Dashboard content */}
        {data && (
          <>
            {/* 1. Player Profile Header */}
            <PlayerProfileHeader profile={data.profile} />

            {/* 2. RYP Red Summary */}
            <RedSummary data={data.red} />

            {/* 3. FORGE Performance */}
            <ForgePerformance data={data.forge} />

            {/* 4. CHIP Fitness */}
            <ChipFitness data={data.chip} />

            {/* 5. Practice DNA */}
            <PracticeDNA data={data.dna} />

            {/* 6. Combined Insights */}
            <CombinedInsights
              red={data.red}
              forge={data.forge}
              chip={data.chip}
              dna={data.dna}
            />

            {/* Footer */}
            <div className="pb-8 text-center">
              <p className="text-xs text-white/15 font-body">
                RYP Golf · Player Dashboard · Data synced in real time
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
