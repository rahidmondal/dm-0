"use client";

import { useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { SearchBar } from "./SearchBar";
import { UserList } from "./UserList";

export function Sidebar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-full w-full flex-col border-r border-border bg-card shadow-sm sm:w-80 lg:w-96">
      <SidebarHeader />
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <UserList searchQuery={searchQuery} />
    </div>
  );
}

