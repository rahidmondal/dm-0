'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Authenticated, Unauthenticated } from 'convex/react';
import { SignUpButton, SignInButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Zap, Shield, Users } from 'lucide-react';
import AuthRedirect from '@/components/AuthRedirect';

import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Background — light mode */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:hidden" />
      {/* Background — dark mode */}
      <div className="absolute inset-0 -z-10 hidden h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#020617_40%,#63e_100%)] dark:block" />

      {/* Theme toggle — top right */}
      <div className="absolute right-6 top-6 z-20">
        <ThemeToggle />
      </div>

      <Authenticated>
        <AuthRedirect />
      </Authenticated>

      <Unauthenticated>
        <div className="relative z-10 flex flex-col">
          {/* ═══════════════════════════════════
              HERO
          ═══════════════════════════════════ */}
          <section className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
            <Image
              src="/logo.svg"
              alt="DM-0"
              width={80}
              height={80}
              className="mb-6 rounded-2xl drop-shadow-lg"
            />

            <h1 className="mb-4 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-white">
              DM-0
            </h1>

            <p className="mx-auto mb-4 max-w-md text-lg text-slate-600 dark:text-slate-300">
              Welcome to a new way of{' '}
              <span className="font-semibold text-sky-900 dark:text-sky-400">communication</span>
            </p>

            <p className="mx-auto mb-10 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Fast, secure, and beautifully designed real-time messaging for teams and friends.
            </p>

            <div className="flex w-full max-w-xs flex-col gap-3">
              <SignInButton mode="modal">
                <button className="rounded-lg bg-sky-900 px-6 py-3 font-medium text-white transition-all hover:scale-[1.02] hover:bg-sky-800 active:scale-[0.98] dark:bg-sky-400 dark:text-slate-900 dark:hover:bg-sky-300">
                  Sign in
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="rounded-lg border border-slate-200 bg-white px-6 py-3 font-medium text-slate-900 transition-all hover:scale-[1.02] hover:bg-slate-50 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
                  Create an account
                </button>
              </SignUpButton>
            </div>

            {/* Scroll hint */}
            <div className="mt-16 animate-bounce text-slate-400 dark:text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
          </section>

          {/* ═══════════════════════════════════
              ABOUT — 3 bullet explanation
          ═══════════════════════════════════ */}
          <section className="px-6 py-24">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-4 text-center text-3xl font-bold text-slate-900 dark:text-white">
                Why DM-0?
              </h2>
              <p className="mx-auto mb-12 max-w-lg text-center text-sm text-slate-500 dark:text-slate-400">
                Built for speed, security, and simplicity.
              </p>

              <div className="grid gap-8 sm:grid-cols-3">
                <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white/70 p-8 text-center shadow-sm backdrop-blur-sm transition-transform hover:scale-[1.02] dark:border-slate-800 dark:bg-slate-900/70">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-900/40">
                    <Zap className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">Real-Time</h3>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    Messages delivered instantly with live typing indicators and presence status.
                  </p>
                </div>

                <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white/70 p-8 text-center shadow-sm backdrop-blur-sm transition-transform hover:scale-[1.02] dark:border-slate-800 dark:bg-slate-900/70">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/40">
                    <Shield className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">Secure</h3>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    Authentication powered by Clerk with enterprise-grade session management.
                  </p>
                </div>

                <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white/70 p-8 text-center shadow-sm backdrop-blur-sm transition-transform hover:scale-[1.02] dark:border-slate-800 dark:bg-slate-900/70">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                    <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">Group Chat</h3>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    Create conversations, invite members, and collaborate with your team seamlessly.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════
              TECH STACK ROW
          ═══════════════════════════════════ */}
          <section className="px-6 py-16">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-10 text-center text-2xl font-bold text-slate-900 dark:text-white">
                Built With
              </h2>

              <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
                {[
                  { name: 'Next.js', icon: '▲' },
                  { name: 'Convex', icon: '◈' },
                  { name: 'Clerk', icon: '🔐' },
                  { name: 'Tailwind CSS', icon: '🎨' },
                  { name: 'TypeScript', icon: '⌨' },
                  { name: 'shadcn/ui', icon: '◻' },
                ].map(tech => (
                  <div
                    key={tech.name}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/60 px-4 py-2 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/60"
                  >
                    <span>{tech.icon}</span>
                    <span>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════
              CTA BLOCK
          ═══════════════════════════════════ */}
          <section className="px-6 py-24">
            <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white/70 p-10 text-center shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
              <h2 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">
                Ready to start chatting?
              </h2>
              <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
                Join DM-0 and experience messaging the way it should be.
              </p>

              <SignUpButton mode="modal">
                <button className="rounded-lg bg-sky-900 px-8 py-3 font-medium text-white transition-all hover:scale-[1.02] hover:bg-sky-800 active:scale-[0.98] dark:bg-sky-400 dark:text-slate-900 dark:hover:bg-sky-300">
                  Get Started — It&apos;s Free
                </button>
              </SignUpButton>
            </div>
          </section>

          {/* ═══════════════════════════════════
              FOOTER
          ═══════════════════════════════════ */}
          <footer className="px-6 py-8">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <Image src="/logo.svg" alt="DM-0" width={20} height={20} className="rounded-md" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">DM-0</span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-500">
                <Link href="/terms-of-service" className="transition-colors hover:text-slate-600 dark:hover:text-slate-300">
                  Terms of Service
                </Link>
                <span>·</span>
                <Link href="/privacy-policy" className="transition-colors hover:text-slate-600 dark:hover:text-slate-300">
                  Privacy Policy
                </Link>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-600">
                © {new Date().getFullYear()} DM-0. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </Unauthenticated>
    </div>
  );
}


