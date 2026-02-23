"use client";

import { useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { SearchBar } from "./SearchBar";
import { UserList } from "./UserList";
import { ConversationList } from "./ConversationList";

export function Sidebar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-full w-full flex-col border-r border-border bg-card shadow-sm sm:w-80 lg:w-96">
      <SidebarHeader />
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      {/* If searching, show all users. Otherwise, show active conversations. */}
      {searchQuery.trim().length > 0 ? (
        <UserList searchQuery={searchQuery} onChatCreated={() => setSearchQuery("")} />
      ) : (
        <ConversationList />
      )}
    </div>
  );
}

