'use client';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { Smile } from 'lucide-react';
import React, { useState } from 'react';

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '🎉', '👀', '🙌', '💯'];

interface ReactionsPopoverProps {
  messageId: Id<'messages'>;
  reactions: Array<{ emoji: string; count: number; userIds: Id<'users'>[] }>;
}

export function ReactionsPopover({ messageId, reactions }: ReactionsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleReaction = useMutation(api.messages.toggleReaction);
  const currentUser = useQuery(api.auth.current);

  const handleSelect = (emoji: string) => {
    setIsOpen(false);
    toggleReaction({ messageId, emoji }).catch(console.error);
  };

  const popoverRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="text-muted-foreground hover:text-primary hover:bg-primary/10 flex items-center justify-center rounded-full p-1.5 transition-colors"
        title="Add reaction"
      >
        <Smile className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="bg-background border-border animate-in fade-in zoom-in-95 absolute bottom-full left-1/2 z-50 mb-2 flex w-50 -translate-x-1/2 flex-wrap items-center justify-center gap-1 rounded-2xl border p-2 shadow-xl duration-200">
          {EMOJI_OPTIONS.map(emoji => {
            const reactionData = reactions?.find(r => r.emoji === emoji);
            const hasReacted = currentUser && reactionData?.userIds.includes(currentUser._id);
            return (
              <button
                key={emoji}
                onClick={() => handleSelect(emoji)}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-lg transition-transform hover:scale-125 ${
                  hasReacted ? 'bg-primary/20' : 'hover:bg-muted'
                }`}
              >
                {emoji}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
