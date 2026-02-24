'use client';

import { Sidebar } from './components/Sidebar';
import { useParams } from 'next/navigation';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const isChatActive = !!params?.conversationId;

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
