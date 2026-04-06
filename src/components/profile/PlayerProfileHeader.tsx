'use client';

import React from 'react';
import { GlassCard, formatDate } from '@ryp/ui';
import type { Profile } from '@/types/database';

interface PlayerProfileHeaderProps {
  profile: Profile;
}

export function PlayerProfileHeader({ profile }: PlayerProfileHeaderProps) {
  const handicapDisplay =
    profile.handicap !== null
      ? profile.handicap > 0
        ? `+${profile.handicap.toFixed(1)}`
        : profile.handicap.toFixed(1)
      : null;

  return (
    <GlassCard padding="lg">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          {profile.photo_url ? (
            <img
              src={profile.photo_url}
              alt={profile.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-ryp-green/30"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-ryp-green/10 border-2 border-ryp-green/20 flex items-center justify-center">
              <span className="font-heading text-2xl font-bold text-ryp-green">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h1 className="font-heading text-2xl font-black text-white leading-tight truncate">
            {profile.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            {profile.club && (
              <span className="text-sm text-white/50 font-body">{profile.club}</span>
            )}
            {handicapDisplay && (
              <span className="text-sm font-semibold text-ryp-green font-body">
                HCP {handicapDisplay}
              </span>
            )}
            {profile.member_since && (
              <span className="text-xs text-white/30 font-body">
                Member since {formatDate(profile.member_since)}
              </span>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
