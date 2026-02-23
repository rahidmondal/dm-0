"use client";

import { Authenticated } from "convex/react";
import { MessageSquare } from "lucide-react";

export default function ChatPage() {
  return (
    <Authenticated>
      <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
        <div className="flex max-w-sm flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MessageSquare className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Your Messages</h2>
          <p className="text-sm">Select a user from the sidebar to start a new conversation or continue an existing one.</p>
        </div>
      </div>
    </Authenticated>
  );
}
