import type { SupabaseClient } from '@supabase/supabase-js';
import { ProfileSchema, type Profile } from '@/types/database';

export async function fetchProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, photo_url, handicap, club, member_since')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw new Error(`[profile] ${error.message}`);
  if (!data) return null;

  return ProfileSchema.parse(data);
}
