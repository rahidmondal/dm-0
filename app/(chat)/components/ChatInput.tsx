'use client';

import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useState, useRef } from 'react';
import { SendHorizonal } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

export function ChatInput({ conversationId }: { conversationId: Id<'conversations'> }) {
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const sendMessage = useMutation(api.messages.sendMessage);
  const setTyping = useMutation(api.conversations.setTyping);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastTyped = useRef<number>(0);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    try {
      await sendMessage({ conversationId, content: trimmed });
      setContent('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    // Throttle typing updates to once per second
    const now = Date.now();
    if (now - lastTyped.current > 1000) {
      lastTyped.current = now;
      setTyping({ conversationId }).catch(console.error);
    }
  };

  return (
    <div className="border-border bg-card/80 relative z-20 border-t p-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] backdrop-blur-md dark:shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)]">
      <form onSubmit={handleSend} className="mx-auto flex w-full max-w-4xl items-end gap-2">
        <TextareaAutosize
          ref={inputRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          maxRows={6}
          className="border-border bg-background focus:border-primary focus:ring-primary flex-1 resize-none rounded-2xl border px-4 py-3 text-[15px] shadow-sm transition-all focus:ring-1 focus:outline-none disabled:opacity-50"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={!content.trim() || isSending}
          className="bg-primary text-primary-foreground hover:bg-primary-hover flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-md transition-all duration-200 hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
        >
          <SendHorizonal className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
