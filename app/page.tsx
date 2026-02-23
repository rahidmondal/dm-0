'use client';

import { Authenticated, Unauthenticated } from 'convex/react';
import { SignUpButton, SignInButton, UserButton } from '@clerk/nextjs';
import Image from 'next/image';

import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-10 flex w-full items-center justify-between border-b border-border bg-background/80 p-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="dm-0 Logo" width={32} height={32} className="rounded-lg shadow-sm" />
          <span className="text-xl font-bold tracking-tight text-primary">dm-0</span>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Authenticated>
            <UserButton appearance={{
              elements: {
                avatarBox: "h-9 w-9"
              }
            }} />
          </Authenticated>
          <Unauthenticated>
             <span className="text-sm text-muted-foreground hidden sm:inline-block">Not logged in</span>
          </Unauthenticated>
        </div>
      </header>
      
      <main className="flex flex-1 flex-col items-center justify-center p-6">
        <Authenticated>
          <div className="flex max-w-2xl flex-col items-center gap-6 text-center animate-in fade-in zoom-in duration-500">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Welcome back to <span className="text-primary">dm-0</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              You are successfully authenticated. 
              Real-time messaging, direct conversations, and presence tracking features are coming soon.
            </p>
            <div className="rounded-xl border border-border bg-muted/50 p-6 shadow-sm">
                <p className="font-mono text-sm">Phase 2: Authentication Verified &nbsp; ✅</p>
            </div>
          </div>
        </Authenticated>
        
        <Unauthenticated>
          <div className="flex w-full max-w-sm flex-col gap-8 rounded-2xl border border-border bg-card p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex flex-col items-center gap-2 text-center">
              <Image src="/logo.svg" alt="dm-0 Logo" width={64} height={64} className="mb-4 drop-shadow-md rounded-2xl" />
              <h1 className="text-2xl font-bold tracking-tight">Sign in to dm-0</h1>
              <p className="text-sm text-muted-foreground">
                Join our real-time messaging platform today.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <SignInButton mode="modal">
                <button className="flex w-full items-center justify-center rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98]">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="flex w-full items-center justify-center rounded-lg border border-border bg-background py-2.5 px-4 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-muted hover:scale-[1.02] active:scale-[0.98]">
                  Create an account
                </button>
              </SignUpButton>
            </div>
          </div>
        </Unauthenticated>
      </main>
    </div>
  );
}
