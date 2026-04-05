import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { RoundSchema, HoleSchema, type Round, type Hole } from '@/types/database';

export interface RedSummaryData {
  recentRounds: Round[];
  scoringTrend: Array<{ date: string; score: number; par: number; scoreToPar: number }>;
  bestRound:    Round | null;
  worstRound:   Round | null;
  avgSSL:       number | null;
  avgESL:       number | null;
  avgPutts:     number | null;
  girPercent:   number | null;
  fairwayPercent: number | null;
}

export async function fetchRedSummary(
  supabase: SupabaseClient,
  userId: string,
): Promise<RedSummaryData> {
  // Fetch last 20 rounds
  const { data: roundsRaw, error: roundsError } = await supabase
    .from('rounds')
    .select('id, player_id, date, course_name, total_score, par, ssl, esl, created_at')
    .eq('player_id', userId)
    .order('date', { ascending: false })
    .limit(20);

  if (roundsError) throw new Error(`[red/rounds] ${roundsError.message}`);

  const rounds = z.array(RoundSchema).parse(roundsRaw ?? []);
  if (rounds.length === 0) {
    return {
      recentRounds: [],
      scoringTrend: [],
      bestRound:    null,
      worstRound:   null,
      avgSSL:       null,
      avgESL:       null,
      avgPutts:     null,
      girPercent:   null,
      fairwayPercent: null,
    };
  }

  // Fetch holes for the recent rounds (for GIR, putts, fairways)
  const roundIds = rounds.map((r) => r.id);
  const { data: holesRaw, error: holesError } = await supabase
    .from('holes')
    .select('id, round_id, hole_number, par, score, fairway_hit, gir, putts, driving_distance')
    .in('round_id', roundIds);

  if (holesError) throw new Error(`[red/holes] ${holesError.message}`);

  const holes = z.array(HoleSchema).parse(holesRaw ?? []) as Hole[];

  // Compute aggregate stats
  const totalHoles    = holes.length;
  const totalPutts    = holes.reduce((s, h) => s + h.putts, 0);
  const totalGIR      = holes.filter((h) => h.gir).length;
  const fairwayHoles  = holes.filter((h) => h.fairway_hit !== null);
  const totalFairways = fairwayHoles.filter((h) => h.fairway_hit === true).length;

  const sslRounds = rounds.filter((r) => r.ssl !== null);
  const eslRounds = rounds.filter((r) => r.esl !== null);

  const sorted = [...rounds].sort((a, b) => a.total_score - a.par - (b.total_score - b.par));

  return {
    recentRounds: rounds.slice(0, 10),
    scoringTrend: [...rounds]
      .reverse()
      .map((r) => ({
        date:       r.date,
        score:      r.total_score,
        par:        r.par,
        scoreToPar: r.total_score - r.par,
      })),
    bestRound:    sorted[0] ?? null,
    worstRound:   sorted[sorted.length - 1] ?? null,
    avgSSL:       sslRounds.length > 0
      ? sslRounds.reduce((s, r) => s + (r.ssl ?? 0), 0) / sslRounds.length
      : null,
    avgESL:       eslRounds.length > 0
      ? eslRounds.reduce((s, r) => s + (r.esl ?? 0), 0) / eslRounds.length
      : null,
    avgPutts:       totalHoles > 0 ? totalPutts / rounds.length : null,
    girPercent:     totalHoles > 0 ? (totalGIR / totalHoles) * 100 : null,
    fairwayPercent: fairwayHoles.length > 0 ? (totalFairways / fairwayHoles.length) * 100 : null,
  };
}
