"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Users, Check, X, ArrowRight } from "lucide-react";

import { Id } from "@/convex/_generated/dataModel";
import { OnlineIndicator } from "./OnlineIndicator";

export function UserList({ 
  searchQuery, 
  onChatCreated,
  isGroupMode,
  setIsGroupMode
}: { 
  searchQuery: string; 
  onChatCreated?: () => void;
  isGroupMode: boolean;
  setIsGroupMode: (val: boolean) => void;
}) {
  const users = useQuery(api.users.getUsers);
  const getOrCreateConversation = useMutation(api.conversations.getOrCreateConversation);
  const createGroup = useMutation(api.conversations.createGroup);
  
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  
  // Group Mode States
  const [selectedUserIds, setSelectedUserIds] = useState<Id<"users">[]>([]);
  const [showGroupNameModal, setShowGroupNameModal] = useState(false);
  const [groupName, setGroupName] = useState("");

  if (users === undefined) {
    return (
      <div className="flex-1 overflow-hidden p-2">
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg p-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted animate-pulse"></div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-4 w-32 rounded bg-muted animate-pulse"></div>
                <div className="h-3 w-20 rounded bg-muted animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Client side filtering for immediate response
  const filteredUsers = users.filter((user) => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = async (otherUserId: Id<"users">) => {
    if (isGroupMode) {
      setSelectedUserIds((prev) => 
        prev.includes(otherUserId) 
          ? prev.filter(id => id !== otherUserId) 
          : [...prev, otherUserId]
      );
      return;
    }

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

  const handleCreateGroup = async () => {
    if (selectedUserIds.length === 0) return;
    if (!groupName.trim()) return;

    try {
      setPendingId("group_creation");
      const conversationId = await createGroup({ 
        name: groupName.trim(), 
        memberIds: selectedUserIds 
      });
      setIsGroupMode(false);
      setSelectedUserIds([]);
      setShowGroupNameModal(false);
      setGroupName("");
      onChatCreated?.();
      router.push(`/chat/${conversationId}`);
    } catch (error) {
      console.error("Failed to create group:", error);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative">
      <div className="p-3 border-b border-border/50 sticky top-0 z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        {!isGroupMode ? (
          <button
            onClick={() => setIsGroupMode(true)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary/10 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            <Users className="h-4 w-4" />
            Create Group Chat
          </button>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              {selectedUserIds.length} selected
            </span>
            <button
              onClick={() => {
                setIsGroupMode(false);
                setSelectedUserIds([]);
              }}
              className="flex items-center gap-1 rounded-full p-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 p-2 pb-24">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-8 text-center mt-10">
            <div className="flex flex-col items-center gap-2">
              <p className="text-base font-medium text-foreground">No users found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try a different search term." : "When others join, they'll appear here."}
              </p>
            </div>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isSelected = selectedUserIds.includes(user._id);

            return (
              <button
                key={user._id}
                onClick={() => handleUserClick(user._id)}
                disabled={pendingId !== null && !isGroupMode}
                className={`flex items-center gap-3 rounded-lg p-3 text-left transition-all focus-visible:outline-none ${
                  isSelected ? "bg-primary/5" : "hover:bg-muted/60 focus-visible:bg-muted/60"
                }`}
              >
                {isGroupMode && (
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
                  }`}>
                    {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                  </div>
                )}
                
                <div className="relative shrink-0">
                  <div className="relative flex h-12 w-12 overflow-hidden rounded-full bg-muted items-center justify-center">
                    {pendingId === user._id && !isGroupMode ? (
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
            );
          })
        )}
      </div>

      {isGroupMode && selectedUserIds.length > 0 && !showGroupNameModal && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[80%] z-20 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <button
            onClick={() => setShowGroupNameModal(true)}
            disabled={pendingId === "group_creation"}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 px-6 text-sm font-semibold text-primary-foreground shadow-xl transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
          >
            {pendingId === "group_creation" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Continue with {selectedUserIds.length}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}

      {showGroupNameModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-4 shadow-xl">
            <h3 className="mb-2 text-lg font-semibold text-foreground">Name your group</h3>
            <p className="mb-4 text-sm text-muted-foreground">Give this conversation a clear name.</p>
            <input
              type="text"
              placeholder="e.g. Weekend Plans"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mb-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && groupName.trim()) {
                  handleCreateGroup();
                } else if (e.key === 'Escape') {
                  setShowGroupNameModal(false);
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowGroupNameModal(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                disabled={pendingId === "group_creation"}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                disabled={!groupName.trim() || pendingId === "group_creation"}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {pendingId === "group_creation" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Create Group"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
