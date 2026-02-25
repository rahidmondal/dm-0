'use client';

import { useState } from 'react';
import { ConversationList } from './ConversationList';
import { SearchBar } from './SearchBar';
import { SidebarHeader } from './SidebarHeader';
import { UserList } from './UserList';

export function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isGroupMode, setIsGroupMode] = useState(false);

  return (
    <div className="border-border bg-card flex h-full w-full flex-col border-r shadow-sm sm:w-80 lg:w-96">
      <SidebarHeader />
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {searchQuery.trim().length > 0 || isGroupMode ? (
        <UserList
          searchQuery={searchQuery}
          onChatCreated={() => {
            setSearchQuery('');
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
