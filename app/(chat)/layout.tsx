"use client";

import { Sidebar } from "./components/Sidebar";

export default function ChatLayout() {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      {/* Sidebar - Hidden on mobile if a chat is active, otherwise full width */}
      <div className="h-full w-full sm:w-auto">
        <Sidebar />
      </div>

      {/* Main Chat Area - Hidden on mobile if no chat is active, otherwise flex-1 */}
      <main className="hidden h-full flex-1 flex-col sm:flex bg-muted/20">
        <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
          <div className="flex max-w-sm flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <h2 className="text-xl font-semibold text-foreground">Your Messages</h2>
            <p className="text-sm">Select a user from the sidebar to start a new conversation or continue an existing one.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
