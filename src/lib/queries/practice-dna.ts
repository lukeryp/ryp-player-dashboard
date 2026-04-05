import type { SupabaseClient } from '@supabase/supabase-js';
import { PracticeAssessmentSchema, type PracticeAssessment } from '@/types/database';

export async function fetchPracticeAssessment(
  supabase: SupabaseClient,
  userId: string,
): Promise<PracticeAssessment | null> {
  const { data, error } = await supabase
    .from('practice_assessments')
    .select(
      'id, player_id, created_at, persona, neuro_signature, master_archetype, ' +
      'zone_assembly, zone_lab, zone_crucible, zone_arena, ' +
      'ocean_openness, ocean_conscientiousness, ocean_extraversion, ocean_agreeableness, ocean_neuroticism',
    )
    .eq('player_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`[practice-dna] ${error.message}`);
  if (!data) return null;

  return PracticeAssessmentSchema.parse(data);
}
