"use client";

import { useQuery, usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { ChatInput } from "./ChatInput";
import { formatMessageTime } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function ChatUI({ conversationId }: { conversationId: Id<"conversations"> }) {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const conversation = useQuery(api.conversations.getConversation, { conversationId });
  const currentUser = useQuery(api.auth.current);

  const {
    results: messages,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.messages.getMessages,
    { conversationId },
    { initialNumItems: 50 }
  );

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (conversation === undefined || currentUser === undefined) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (conversation === null || currentUser === null) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center p-8 text-center">
        <p className="text-xl font-semibold text-foreground">Chat not found</p>
        <p className="text-muted-foreground">This conversation might have been deleted or you don&apos;t have access.</p>
        <button onClick={() => router.push("/chat")} className="mt-4 text-primary hover:underline">
          Return to chat list
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-background">
      {/* Chat Header */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-md">
        <button 
          onClick={() => router.push("/chat")}
          className="mr-1 block rounded-full p-2 hover:bg-muted sm:hidden"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
          {conversation.otherUser?.avatarUrl ? (
            <Image src={conversation.otherUser.avatarUrl} alt={conversation.otherUser.name || "User"} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-lg font-semibold text-primary">
              {conversation.otherUser?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
        </div>
        
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{conversation.otherUser?.name || "Unknown User"}</span>
          <span className="text-xs text-muted-foreground">@{conversation.otherUser?.username || "unknown"}</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 relative min-h-full justify-end">
          
          {status === "CanLoadMore" && (
            <div className="flex justify-center pb-4">
              <button 
                onClick={() => loadMore(50)}
                className="rounded-full bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
              >
                Load older messages
              </button>
            </div>
          )}
          
          {status === "LoadingMore" && (
            <div className="flex justify-center pb-4">
               <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}

          {messages.length === 0 && status !== "LoadingFirstPage" ? (
             <div className="flex w-full flex-col items-center justify-center py-10 opacity-60">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <p className="text-sm font-medium">No messages yet</p>
                <p className="text-xs text-muted-foreground">Send a message to start the conversation</p>
             </div>
          ) : (
             messages.map((msg) => {
               const isMe = msg.senderId === currentUser._id;
               return (
                 <div
                   key={msg._id}
                   className={`flex max-w-[80%] flex-col gap-1 ${isMe ? "self-end items-end" : "self-start items-start"}`}
                 >
                   <div 
                     className={`rounded-2xl px-4 py-2 text-[15px] ${
                       isMe 
                         ? "bg-primary text-primary-foreground rounded-br-sm" 
                         : "bg-muted text-foreground rounded-bl-sm"
                     }`}
                   >
                     {msg.content}
                   </div>
                   <span className="px-1 text-[10px] text-muted-foreground font-medium">
                     {formatMessageTime(msg._creationTime)}
                   </span>
                 </div>
               );
             })
          )}
          
          <div ref={bottomRef} className="h-1 shrink-0" />
        </div>
      </div>

      {/* Input Area */}
      <ChatInput conversationId={conversationId} />
    </div>
  );
}
