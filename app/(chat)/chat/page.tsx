"use client";

import { Authenticated } from "convex/react";
import { MessageSquare, Sparkles } from "lucide-react";

export default function ChatPage() {
  return (
    <Authenticated>
      <div className="relative flex h-full items-center justify-center p-8 text-center text-muted-foreground overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-aquamarine-400/10 blur-[80px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
        </div>
        
        <div className="flex max-w-md flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-700 relative z-10">
          {/* Logo area with glow */}
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-xl scale-150" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-lg shadow-primary/10">
              <MessageSquare className="h-9 w-9 text-primary" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Your Messages</h2>
            <p className="text-sm leading-relaxed max-w-xs mx-auto">Select a user from the sidebar to start a new conversation, or continue an existing one.</p>
          </div>
          
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-medium text-primary border border-primary/20">
            <Sparkles className="h-3.5 w-3.5" />
            Real-time messaging powered by Convex
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
