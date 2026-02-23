"use client";

import { Search } from "lucide-react";

export function SearchBar({ 
  searchQuery, 
  setSearchQuery 
}: { 
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) {
  return (
    <div className="p-4 border-b border-border bg-card">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
}

