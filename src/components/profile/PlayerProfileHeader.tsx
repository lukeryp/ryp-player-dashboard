'use client';

import React from 'react';
import Image from 'next/image';
import { GlassCard, Button, formatDate, formatHandicap } from '@ryp/ui';
import type { Profile } from '@/types/database';
import { useAuth } from '@/components/providers/AuthProvider';

interface PlayerProfileHeaderProps {
  profile: Profile;
}

export function PlayerProfileHeader({ profile }: PlayerProfileHeaderProps) {
  const { signOut } = useAuth();

  return (
    <GlassCard padding="lg" className="relative overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(0,175,81,0.2) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="shrink-0">
          {profile.photo_url ? (
            <Image
              src={profile.photo_url}
              alt={profile.name}
              width={80}
              height={80}
              className="rounded-2xl border-2 border-ryp-green/30 object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-ryp-green/10 border-2 border-ryp-green/20 flex items-center justify-center">
              <span className="font-heading text-2xl font-bold text-ryp-green">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h1 className="font-heading text-3xl font-bold text-white leading-tight">
            {profile.name}
          </h1>
          {profile.club && (
            <p className="text-white/50 font-body text-sm mt-1">{profile.club}</p>
          )}
          <p className="text-white/30 font-body text-xs mt-0.5">
            Member since {formatDate(profile.member_since)}
          </p>
        </div>

        {/* Handicap badge */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="rounded-xl bg-ryp-yellow/10 border border-ryp-yellow/20 px-5 py-3 text-center">
            <p className="text-xs text-white/40 font-body uppercase tracking-widest mb-1">Handicap</p>
            <p className="font-heading text-3xl font-black text-ryp-yellow leading-none tabular-nums">
              {profile.handicap !== null ? formatHandicap(profile.handicap) : '—'}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-white/30 hover:text-white/60 text-xs"
          >
            Sign out
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
