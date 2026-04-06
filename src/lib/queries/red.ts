import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { RoundSchema, HoleSchema, type Round } from '@/types/database';

export interface RedSummaryData {
  recentRounds:   Round[];
  scoringTrend:   Array<{ date: string; scoreToPar: number; score: number }>;
  bestRound:      Round | null;
  worstRound:     Round | null;
  avgSSL:         number | null;
  avgESL:         number | null;
  avgPutts:       number | null;
  girPercent:     number | null;
  fairwayPercent: number | null;
}

export async function fetchRedSummary(
  supabase: SupabaseClient,
  userId: string,
): Promise<RedSummaryData> {
  const { data: roundsRaw, error: roundsError } = await supabase
    .from('rounds')
    .select('id, player_id, date, course_name, total_score, par, ssl, esl, created_at')
    .eq('player_id', userId)
    .order('date', { ascending: false })
    .limit(20);

  if (roundsError) throw new Error(`[red/rounds] ${roundsError.message}`);

  const rounds = z.array(RoundSchema).parse(roundsRaw ?? []) as Round[];

  if (rounds.length === 0) {
    return {
      recentRounds:   [],
      scoringTrend:   [],
      bestRound:      null,
      worstRound:     null,
      avgSSL:         null,
      avgESL:         null,
      avgPutts:       null,
      girPercent:     null,
      fairwayPercent: null,
    };
  }

  const roundIds = rounds.map((r) => r.id);

  const { data: holesRaw, error: holesError } = await supabase
    .from('holes')
    .select('id, round_id, hole_number, par, score, fairway_hit, gir, putts, driving_distance')
    .in('round_id', roundIds);

  if (holesError) throw new Error(`[red/holes] ${holesError.message}`);

  const holes = z.array(HoleSchema).parse(holesRaw ?? []);

  const roundStats = rounds.map((round) => {
    const roundHoles   = holes.filter((h) => h.round_id === round.id);
    const totalPutts   = roundHoles.reduce((s, h) => s + h.putts, 0);
    const girsHit      = roundHoles.filter((h) => h.gir).length;
    const fairwayHoles = roundHoles.filter((h) => h.fairway_hit !== null).length;
    const fairwaysHit  = roundHoles.filter((h) => h.fairway_hit === true).length;
    return {
      round,
      putts:      roundHoles.length > 0 ? (totalPutts / roundHoles.length) * 18 : null,
      girPct:     roundHoles.length > 0 ? (girsHit / roundHoles.length) * 100 : null,
      fairwayPct: fairwayHoles > 0 ? (fairwaysHit / fairwayHoles) * 100 : null,
    };
  });

  const sorted = [...rounds].sort(
    (a, b) => (a.total_score - a.par) - (b.total_score - b.par),
  );
  const bestRound  = sorted[0] ?? null;
  const worstRound = sorted[sorted.length - 1] ?? null;

  const sslValues = rounds.filter((r) => r.ssl !== null).map((r) => r.ssl as number);
  const eslValues = rounds.filter((r) => r.esl !== null).map((r) => r.esl as number);
  const avgSSL = sslValues.length > 0
    ? sslValues.reduce((s, n) => s + n, 0) / sslValues.length
    : null;
  const avgESL = eslValues.length > 0
    ? eslValues.reduce((s, n) => s + n, 0) / eslValues.length
    : null;

  const puttsArr = roundStats.map((s) => s.putts).filter((p): p is number => p !== null);
  const avgPutts = puttsArr.length > 0
    ? puttsArr.reduce((s, n) => s + n, 0) / puttsArr.length
    : null;

  const girArr = roundStats.map((s) => s.girPct).filter((p): p is number => p !== null);
  const girPercent = girArr.length > 0
    ? girArr.reduce((s, n) => s + n, 0) / girArr.length
    : null;

  const fwArr = roundStats.map((s) => s.fairwayPct).filter((p): p is number => p !== null);
  const fairwayPercent = fwArr.length > 0
    ? fwArr.reduce((s, n) => s + n, 0) / fwArr.length
    : null;

  const scoringTrend = [...rounds].reverse().map((r) => ({
    date:       r.date,
    scoreToPar: r.total_score - r.par,
    score:      r.total_score,
  }));

  return {
    recentRounds: rounds.slice(0, 8),
    scoringTrend,
    bestRound,
    worstRound,
    avgSSL,
    avgESL,
    avgPutts,
    girPercent,
    fairwayPercent,
  };
}
