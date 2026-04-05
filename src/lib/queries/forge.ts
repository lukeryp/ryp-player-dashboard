import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { ForgeSessionSchema, ForgeDrillSchema, type ForgeSession, type ForgeDrill, type ForgeDrillCategory } from '@/types/database';

export interface CategoryScore {
  category: ForgeDrillCategory;
  avg:      number;
  trend:    number; // delta vs previous period
}

export interface ForgeData {
  latestRPI:        number | null;
  rpiTrend:         Array<{ date: string; rpi: number }>;
  categoryScores:   CategoryScore[];
  recentSessions:   ForgeSession[];
  allDrills:        ForgeDrill[];
}

const CATEGORIES: ForgeDrillCategory[] = ['driving', 'approach', 'chipping', 'putting'];

export async function fetchForgeData(
  supabase: SupabaseClient,
  userId: string,
): Promise<ForgeData> {
  const { data: sessionsRaw, error: sessionsError } = await supabase
    .from('forge_sessions')
    .select('id, player_id, date, ryp_performance_index, notes, created_at')
    .eq('player_id', userId)
    .order('date', { ascending: false })
    .limit(30);

  if (sessionsError) throw new Error(`[forge/sessions] ${sessionsError.message}`);

  const sessions = z.array(ForgeSessionSchema).parse(sessionsRaw ?? []) as ForgeSession[];

  if (sessions.length === 0) {
    return {
      latestRPI:      null,
      rpiTrend:       [],
      categoryScores: [],
      recentSessions: [],
      allDrills:      [],
    };
  }

  const sessionIds = sessions.map((s) => s.id);

  const { data: drillsRaw, error: drillsError } = await supabase
    .from('forge_drills')
    .select('id, session_id, category, drill_name, score, created_at')
    .in('session_id', sessionIds);

  if (drillsError) throw new Error(`[forge/drills] ${drillsError.message}`);

  const drills = z.array(ForgeDrillSchema).parse(drillsRaw ?? []) as ForgeDrill[];

  // Category scores — avg across all drills, plus trend (last 5 vs previous 5 sessions)
  const recentSessionIds = sessions.slice(0, 5).map((s) => s.id);
  const prevSessionIds   = sessions.slice(5, 10).map((s) => s.id);

  const categoryScores: CategoryScore[] = CATEGORIES.map((cat) => {
    const catDrills      = drills.filter((d) => d.category === cat);
    const recentDrills   = catDrills.filter((d) => recentSessionIds.includes(d.session_id));
    const prevDrills     = catDrills.filter((d) => prevSessionIds.includes(d.session_id));
    const avg            = catDrills.length > 0
      ? catDrills.reduce((s, d) => s + d.score, 0) / catDrills.length
      : 0;
    const recentAvg      = recentDrills.length > 0
      ? recentDrills.reduce((s, d) => s + d.score, 0) / recentDrills.length
      : avg;
    const prevAvg        = prevDrills.length > 0
      ? prevDrills.reduce((s, d) => s + d.score, 0) / prevDrills.length
      : recentAvg;
    return { category: cat, avg, trend: recentAvg - prevAvg };
  });

  return {
    latestRPI:      sessions[0]?.ryp_performance_index ?? null,
    rpiTrend:       [...sessions].reverse().map((s) => ({ date: s.date, rpi: s.ryp_performance_index })),
    categoryScores,
    recentSessions: sessions.slice(0, 6),
    allDrills:      drills,
  };
}
