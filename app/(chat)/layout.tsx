"use client";

import { Sidebar } from "./components/Sidebar";
import { useParams } from "next/navigation";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const isChatActive = !!params?.conversationId;

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      {/* Sidebar - Hidden on mobile if a chat is active */}
      <div className={`h-full w-full sm:w-auto ${isChatActive ? "hidden sm:block" : "block"}`}>
        <Sidebar />
      </div>

      {/* Main Chat Area - Hidden on mobile if no chat is active, otherwise flex-1 */}
      <main className={`h-full flex-1 flex-col bg-muted/20 ${isChatActive ? "flex" : "hidden sm:flex"}`}>
        {children}
      </main>
    </div>
  );
}
