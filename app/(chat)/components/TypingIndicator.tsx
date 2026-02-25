'use client';

import { useEffect, useState } from 'react';

type TypingEntry = {
  name?: string;
  typingUntil?: number;
};

export function TypingIndicator({
  typingUntil,
  name,
  groupMembers,
  currentUserId,
}: {
  typingUntil?: number | null;
  name?: string;
  groupMembers?: TypingEntry[];
  currentUserId?: string;
}) {
  const [now, setNow] = useState(() => Date.now());

  const hasAnyTyping = typingUntil || groupMembers?.some(m => m.typingUntil);

  useEffect(() => {
    if (!hasAnyTyping) return;

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
  }, [hasAnyTyping]);

  if (!groupMembers) {
    const isTyping = typingUntil ? typingUntil > now : false;
    if (!isTyping) return null;

    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 flex w-full items-center gap-2 pb-2 pl-2 opacity-70 duration-300">
        <span className="text-muted-foreground text-xs font-medium">{name} is typing</span>
        <BouncingDots />
      </div>
    );
  }

  const typingNames = groupMembers
    .filter(m => m.typingUntil && m.typingUntil > now && m.name)
    .filter(m => {
      const memberId = (m as TypingEntry & { _id?: string })._id;
      return currentUserId ? memberId !== currentUserId : true;
    })
    .map(m => m.name!);

  if (typingNames.length === 0) return null;

  const label =
    typingNames.length === 1
      ? `${typingNames[0]} is typing`
      : typingNames.length === 2
        ? `${typingNames[0]} and ${typingNames[1]} are typing`
        : `${typingNames[0]} and ${typingNames.length - 1} others are typing`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 flex w-full items-center gap-2 pb-2 pl-2 opacity-70 duration-300">
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
      <BouncingDots />
    </div>
  );
}

function BouncingDots() {
  return (
    <div className="bg-muted/60 flex items-center gap-1 rounded-full px-3 py-2">
      <div className="bg-primary/70 h-1.5 w-1.5 animate-bounce rounded-full" style={{ animationDelay: '0ms' }} />
      <div className="bg-primary/70 h-1.5 w-1.5 animate-bounce rounded-full" style={{ animationDelay: '150ms' }} />
      <div className="bg-primary/70 h-1.5 w-1.5 animate-bounce rounded-full" style={{ animationDelay: '300ms' }} />
    </div>
  );
}
