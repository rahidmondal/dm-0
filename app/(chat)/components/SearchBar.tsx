"use client";

import { Search, X } from "lucide-react";

export function SearchBar({ 
  searchQuery, 
  setSearchQuery 
}: { 
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) {
  return (
    <div className="p-3 px-4">
      <div className="relative flex items-center group">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-border bg-muted/50 py-2.5 pl-9 pr-9 text-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-background hover:bg-muted/70"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery("")}
            className="absolute right-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
