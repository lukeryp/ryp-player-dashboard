'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/components/providers/AuthProvider';
import { LoadingSpinner } from '@ryp/ui';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) return null; // redirecting

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black px-4 py-12">
      {/* Background radial glow */}
      <div
        className="pointer-events-none fixed inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,175,81,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-md">
        <LoginForm />
      </div>

      <p className="mt-8 text-xs text-white/20 font-body text-center">
        RYP Golf — Raise Your Performance
      </p>
    </main>
  );
}
