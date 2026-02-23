"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { formatMessageTime } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";

export function ConversationList() {
  const conversations = useQuery(api.conversations.getMyConversations);
  const router = useRouter();
  const params = useParams();
  const activeChatId = params?.conversationId as string;

  if (conversations === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading chats...</p>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-20"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <p className="text-base font-medium text-foreground">No conversations yet</p>
        <p className="text-sm mt-1">Search for a user to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col gap-1 p-2">
        {conversations.map((chat) => {
          const isActive = activeChatId === chat._id;

          return (
            <button
              key={chat._id}
              onClick={() => router.push(`/chat/${chat._id}`)}
              className={`flex items-center gap-3 rounded-lg p-3 text-left transition-colors focus-visible:outline-none ${
                isActive ? "bg-primary/10" : "hover:bg-muted/60 focus-visible:bg-muted/60"
              }`}
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
                {chat.otherUser?.avatarUrl ? (
                  <Image src={chat.otherUser.avatarUrl} alt={chat.otherUser.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-lg font-semibold text-primary">
                    {chat.otherUser?.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="truncate text-sm font-semibold text-foreground">
                    {chat.otherUser?.name || "Unknown User"}
                  </span>
                  {chat.lastMessage && (
                    <span className="shrink-0 text-[10px] text-muted-foreground ml-2">
                      {formatMessageTime(chat.lastMessage._creationTime)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`truncate text-xs ${chat.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {chat.lastMessage ? chat.lastMessage.content : "No messages yet"}
                  </span>
                  {chat.unreadCount > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
