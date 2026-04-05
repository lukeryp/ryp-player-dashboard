/**
 * RYP Supabase Client Factory
 *
 * Each app calls createRypClient() with its own env vars.
 * Never import a singleton here — let each app own its client lifecycle.
 *
 * Usage (in app/lib/supabase.ts):
 *   import { createRypClient, createRypServerClient } from '@ryp/ui/utils/supabase'
 *   export const supabase = createRypClient(
 *     process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
 *   )
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface RypSupabaseConfig {
  url:    string;
  anonKey: string;
  /** Pass service-role key for server-side privileged operations only */
  serviceRoleKey?: string;
}

/**
 * Create a browser/client-side Supabase client.
 * Use this in Client Components and browser contexts.
 */
export function createRypClient(
  url: string,
  anonKey: string,
): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error(
      '[ryp-ui] createRypClient: SUPABASE_URL and SUPABASE_ANON_KEY are required.',
    );
  }
  return createClient(url, anonKey, {
    auth: {
      persistSession:    true,
      autoRefreshToken:  true,
      detectSessionInUrl: true,
    },
  });
}

/**
 * Create a server-side Supabase client (service role).
 * Use ONLY in Next.js Server Components, Route Handlers, or Server Actions.
 * Never expose the service-role key to the browser.
 */
export function createRypServerClient(
  url: string,
  serviceRoleKey: string,
): SupabaseClient {
  if (!url || !serviceRoleKey) {
    throw new Error(
      '[ryp-ui] createRypServerClient: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.',
    );
  }
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken:  false,
      persistSession:    false,
    },
  });
}

// ── Auth helpers ───────────────────────────────────────────────────────────

export interface RypUser {
  id:    string;
  email: string | undefined;
}

/**
 * Get the currently authenticated user or null.
 */
export async function getCurrentUser(
  client: SupabaseClient,
): Promise<RypUser | null> {
  const { data: { user } } = await client.auth.getUser();
  if (!user) return null;
  return { id: user.id, email: user.email };
}

/**
 * Sign out the current user.
 */
export async function signOut(client: SupabaseClient): Promise<void> {
  await client.auth.signOut();
}

// ── Query helpers ──────────────────────────────────────────────────────────

export interface SupabaseError {
  message: string;
  code?:   string;
  details?: string;
}

/**
 * Unwrap a Supabase query result, throwing a typed error on failure.
 *
 * ```ts
 * const rounds = await unwrap(
 *   supabase.from('rounds').select('*').eq('player_id', id)
 * );
 * ```
 */
export async function unwrap<T>(
  query: PromiseLike<{ data: T | null; error: { message: string; code?: string; details?: string } | null }>,
): Promise<T> {
  const { data, error } = await query;
  if (error) {
    const err = new Error(error.message) as Error & SupabaseError;
    err.code    = error.code;
    err.details = error.details;
    throw err;
  }
  if (data === null) {
    throw new Error('No data returned from Supabase query');
  }
  return data;
}

/**
 * Unwrap allowing null (for single-row queries that may not exist).
 */
export async function unwrapMaybe<T>(
  query: PromiseLike<{ data: T | null; error: { message: string } | null }>,
): Promise<T | null> {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}
