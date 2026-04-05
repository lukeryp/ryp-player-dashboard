import { createRypClient } from '@ryp/ui';
import type { SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | undefined;

/**
 * Returns a singleton Supabase client for browser use.
 * Safe to call multiple times — reuses the same instance.
 */
export function getSupabase(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      '[player-dashboard] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY',
    );
  }

  const client = createRypClient(url, key);
  _client = client;
  return client;
}
