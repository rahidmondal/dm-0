'use client';

import { Search, X } from 'lucide-react';

export function SearchBar({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) {
  return (
    <div className="p-3 px-4">
      <div className="group relative flex items-center">
        <Search className="text-muted-foreground group-focus-within:text-primary absolute left-3 h-4 w-4 transition-colors" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="border-border bg-muted/50 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/20 focus:bg-background hover:bg-muted/70 w-full rounded-xl border py-2.5 pr-9 pl-9 text-sm transition-all duration-200 outline-none focus:ring-2"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-muted-foreground hover:text-foreground absolute right-3 h-4 w-4 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
