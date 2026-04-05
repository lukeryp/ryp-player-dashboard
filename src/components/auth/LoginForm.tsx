'use client';

import React, { useState } from 'react';
import { GlassCard, Button, Input } from '@ryp/ui';
import { getSupabase } from '@/lib/supabase';

export function LoginForm() {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [mode, setMode]           = useState<'password' | 'magic'>('password');

  const handlePasswordLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: err } = await getSupabase().auth.signInWithPassword({ email, password });
    if (err) setError(err.message);
    setLoading(false);
  };

  const handleMagicLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: err } = await getSupabase().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (err) {
      setError(err.message);
    } else {
      setMagicSent(true);
    }
    setLoading(false);
  };

  if (magicSent) {
    return (
      <GlassCard variant="green" padding="xl" className="w-full max-w-md mx-auto text-center">
        <div className="text-4xl mb-4">✉️</div>
        <h2 className="font-heading text-xl font-bold text-white mb-2">Check your email</h2>
        <p className="text-white/60 font-body text-sm">
          We sent a magic link to <strong className="text-white">{email}</strong>. Click it to sign in.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard padding="xl" className="w-full max-w-md mx-auto">
      {/* Logo area */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-ryp-green/20 border border-ryp-green/30 mb-4">
          <svg className="w-6 h-6 text-ryp-green" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </div>
        <h1 className="font-heading text-2xl font-bold text-white">RYP Dashboard</h1>
        <p className="text-white/40 font-body text-sm mt-1">Your complete golf profile</p>
      </div>

      <form onSubmit={mode === 'password' ? handlePasswordLogin : handleMagicLink} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />

        {mode === 'password' && (
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        )}

        {error && (
          <p className="text-ryp-danger text-sm font-body bg-ryp-danger/10 border border-ryp-danger/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          disabled={loading}
        >
          {loading
            ? 'Signing in…'
            : mode === 'password'
            ? 'Sign in'
            : 'Send magic link'}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => { setMode(mode === 'password' ? 'magic' : 'password'); setError(null); }}
          className="text-xs text-white/40 hover:text-ryp-green transition-colors font-body"
        >
          {mode === 'password' ? 'Sign in with magic link instead' : 'Sign in with password instead'}
        </button>
      </div>
    </GlassCard>
  );
}
