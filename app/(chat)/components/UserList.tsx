"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Id } from "@/convex/_generated/dataModel";
import { OnlineIndicator } from "./OnlineIndicator";

export function UserList({ 
  searchQuery, 
  onChatCreated 
}: { 
  searchQuery: string; 
  onChatCreated?: () => void 
}) {
  const users = useQuery(api.users.getUsers);
  const getOrCreateConversation = useMutation(api.conversations.getOrCreateConversation);
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  if (users === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading users...</p>
        </div>
      </div>
    );
  }

  // Client side filtering for immediate response
  const filteredUsers = users.filter((user) => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredUsers.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-base font-medium text-foreground">No users found</p>
          <p className="text-sm text-muted-foreground">
            {searchQuery ? "Try a different search term." : "When others join, they'll appear here."}
          </p>
        </div>
      </div>
    );
  }

  const handleStartChat = async (otherUserId: Id<"users">) => {
    try {
      setPendingId(otherUserId);
      const conversationId = await getOrCreateConversation({ otherUserId });
      onChatCreated?.();
      router.push(`/chat/${conversationId}`);
    } catch (error) {
      console.error("Failed to start chat:", error);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col gap-1 p-2">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => handleStartChat(user._id)}
            disabled={pendingId !== null}
            className="flex items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none disabled:opacity-50"
          >
            <div className="relative shrink-0">
              <div className="relative flex h-12 w-12 overflow-hidden rounded-full bg-muted items-center justify-center">
                {pendingId === user._id ? (
                   <Loader2 className="h-5 w-5 animate-spin text-primary" />
                ) : user.avatarUrl ? (
                  <Image src={user.avatarUrl} alt={user.name} fill className="object-cover" />
                ) : (
                  <div className="text-lg font-semibold text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <OnlineIndicator userId={user._id} />
            </div>
            
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-semibold text-foreground">
                {user.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                @{user.username}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
