"use client";

import { useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { SearchBar } from "./SearchBar";
import { UserList } from "./UserList";
import { ConversationList } from "./ConversationList";

export function Sidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isGroupMode, setIsGroupMode] = useState(false);

  return (
    <div className="flex h-full w-full flex-col border-r border-border bg-card shadow-sm sm:w-80 lg:w-96">
      <SidebarHeader />
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      {/* If searching or creating a group, show the user list. Otherwise, active conversations. */}
      {searchQuery.trim().length > 0 || isGroupMode ? (
        <UserList 
          searchQuery={searchQuery} 
          onChatCreated={() => {
            setSearchQuery("");
            setIsGroupMode(false);
          }} 
          isGroupMode={isGroupMode}
          setIsGroupMode={setIsGroupMode}
        />
      ) : (
        <ConversationList onStartGroup={() => setIsGroupMode(true)} />
      )}
    </div>
  );
}

