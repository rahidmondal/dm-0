"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useRef } from "react";
import { SendHorizonal } from "lucide-react";

export function ChatInput({ conversationId }: { conversationId: Id<"conversations"> }) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const sendMessage = useMutation(api.messages.sendMessage);
  const setTyping = useMutation(api.conversations.setTyping);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastTyped = useRef<number>(0);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    try {
      await sendMessage({ conversationId, content: trimmed });
      setContent("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    
    // Throttle typing updates to once per second
    const now = Date.now();
    if (now - lastTyped.current > 1000) {
      lastTyped.current = now;
      setTyping({ conversationId }).catch(console.error);
    }
  };

  return (
    <div className="border-t border-border bg-card p-4">
      <form onSubmit={handleSend} className="mx-auto flex w-full max-w-4xl items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={content}
          onChange={handleChange}
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={!content.trim() || isSending}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-50"
        >
          <SendHorizonal className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
