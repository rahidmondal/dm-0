'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Authenticated, Unauthenticated } from 'convex/react';
import { SignUpButton, SignInButton, UserButton } from '@clerk/nextjs';
import Image from 'next/image';

import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col transition-colors duration-300">
      <header className="border-border bg-background/80 sticky top-0 z-10 flex w-full items-center justify-between border-b p-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="dm-0 Logo" width={32} height={32} className="rounded-lg shadow-sm" />
          <span className="text-primary text-xl font-bold tracking-tight">dm-0</span>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Authenticated>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'h-9 w-9',
                },
              }}
            />
          </Authenticated>
          <Unauthenticated>
            <span className="text-muted-foreground hidden text-sm sm:inline-block">Not logged in</span>
          </Unauthenticated>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-6">
        <Authenticated>
          {/* We use an effect in a component block to automatically push the user to the chat layout */}
          <AuthRedirect />
        </Authenticated>

        <Unauthenticated>
          <div className="border-border bg-card animate-in slide-in-from-bottom-8 flex w-full max-w-sm flex-col gap-8 rounded-2xl border p-8 shadow-2xl duration-500">
            <div className="flex flex-col items-center gap-2 text-center">
              <Image
                src="/logo.svg"
                alt="dm-0 Logo"
                width={64}
                height={64}
                className="mb-4 rounded-2xl drop-shadow-md"
              />
              <h1 className="text-2xl font-bold tracking-tight">Sign in to dm-0</h1>
              <p className="text-muted-foreground text-sm">Join our real-time messaging platform today.</p>
            </div>

            <div className="flex flex-col gap-4">
              <SignInButton mode="modal">
                <button className="bg-primary text-primary-foreground hover:bg-primary-hover flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="border-border bg-background text-foreground hover:bg-muted flex w-full items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
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

function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Small delay to ensure sync process has started before mounting chat UI
    const timer = setTimeout(() => {
      router.push('/chat');
    }, 500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="animate-in fade-in zoom-in flex max-w-2xl flex-col items-center gap-6 text-center duration-500">
      <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
      <p className="text-muted-foreground text-lg">Entering the chat...</p>
    </div>
  );
}
