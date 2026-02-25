'use client';

import { useAuth } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const isChatActive = !!params?.conversationId;

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="bg-background flex h-dvh w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="bg-background flex h-dvh w-full overflow-hidden">
      {/* Sidebar - Hidden on mobile if a chat is active */}
      <div
        className={`sm:border-border/50 h-full w-full sm:w-auto sm:border-r ${isChatActive ? 'hidden sm:block' : 'block'}`}
      >
        <Sidebar />
      </div>

      {/* Main Chat Area */}
      <main
        className={`from-background to-muted/20 h-full flex-1 flex-col bg-linear-to-b ${isChatActive ? 'flex' : 'hidden sm:flex'}`}
      >
        {children}
      </main>
    </div>
  );
}
