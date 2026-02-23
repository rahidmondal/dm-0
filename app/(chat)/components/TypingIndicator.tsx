"use client";

import { useEffect, useState } from "react";

export function TypingIndicator({ 
  typingUntil, 
  name 
}: { 
  typingUntil?: number | null; 
  name?: string;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!typingUntil) return;

    const timeout = setTimeout(() => {
      setNow(Date.now());
    }, 0);

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 500);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [typingUntil]);

  const isTyping = typingUntil ? typingUntil > now : false;

  if (!isTyping) return null;

  return (
    <div className="flex w-full items-center gap-2 pb-2 pl-2 opacity-70 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <span className="text-xs font-medium text-muted-foreground">{name} is typing</span>
      <div className="flex items-center gap-1 rounded-full bg-muted/60 px-3 py-2">
        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/70" style={{ animationDelay: "0ms" }} />
        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/70" style={{ animationDelay: "150ms" }} />
        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/70" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
