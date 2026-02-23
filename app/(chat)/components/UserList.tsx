"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";

export function UserList({ searchQuery }: { searchQuery: string }) {
  const users = useQuery(api.users.getUsers);

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

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col gap-1 p-2">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            className="flex items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
              {user.avatarUrl ? (
                <Image src={user.avatarUrl} alt={user.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-lg font-semibold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
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
