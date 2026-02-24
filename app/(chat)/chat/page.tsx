'use client';

import { Authenticated } from 'convex/react';
import { MessageSquare, Sparkles } from 'lucide-react';

export default function ChatPage() {
  return (
    <Authenticated>
      <div className="text-muted-foreground relative flex h-full items-center justify-center overflow-hidden p-8 text-center">
        {/* Animated gradient background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="bg-primary/10 absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full blur-[100px]" />
          <div
            className="bg-aquamarine-400/10 absolute right-1/4 bottom-1/4 h-48 w-48 animate-pulse rounded-full blur-[80px]"
            style={{ animationDelay: '1s' }}
          />
          <div className="bg-primary/5 absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />
        </div>

        <div className="animate-in fade-in zoom-in-95 relative z-10 flex max-w-md flex-col items-center gap-6 duration-700">
          {/* Logo area with glow */}
          <div className="relative">
            <div className="bg-primary/20 absolute inset-0 scale-150 rounded-3xl blur-xl" />
            <div className="from-primary/20 to-primary/5 border-primary/20 shadow-primary/10 relative flex h-20 w-20 items-center justify-center rounded-3xl border bg-linear-to-br shadow-lg">
              <MessageSquare className="text-primary h-9 w-9" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-foreground text-2xl font-bold tracking-tight">Your Messages</h2>
            <p className="mx-auto max-w-xs text-sm leading-relaxed">
              Select a user from the sidebar to start a new conversation, or continue an existing one.
            </p>
          </div>

          <div className="bg-primary/10 text-primary border-primary/20 flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            Real-time messaging powered by Convex
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
