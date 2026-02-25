'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Image from 'next/image';
import { formatMessageTime } from '@/lib/utils';
import { useRouter, useParams } from 'next/navigation';
import { OnlineIndicator } from './OnlineIndicator';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function ConversationList({ onStartGroup }: { onStartGroup: () => void }) {
  const conversations = useQuery(api.conversations.getMyConversations);
  const router = useRouter();
  const params = useParams();
  const activeChatId = params?.conversationId as string;

  if (conversations === undefined) {
    return (
      <div className="flex-1 overflow-hidden p-2">
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3 rounded-lg p-3">
              <div className="bg-muted relative h-12 w-12 shrink-0 animate-pulse overflow-hidden rounded-full"></div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="bg-muted h-4 w-24 animate-pulse rounded"></div>
                <div className="bg-muted h-3 w-40 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto">
      <div className="mb-1 p-2">
        <button
          onClick={onStartGroup}
          className="bg-primary/10 text-primary hover:bg-primary/20 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-colors"
        >
          <Users className="h-4 w-4" />
          Create Group Chat
        </button>
      </div>

      {conversations.length === 0 ? (
        <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-4 opacity-20"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <p className="text-foreground text-base font-medium">No conversations yet</p>
          <p className="mt-1 text-sm">Search for a user to start chatting.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-1 p-2 pt-0"
        >
          {conversations.map(chat => {
            const isActive = activeChatId === chat._id;

            return (
              <motion.button
                variants={itemVariants}
                key={chat._id}
                onClick={() => router.push(`/chat/${chat._id}`)}
                className={`flex items-center gap-3 rounded-lg p-3 text-left transition-all duration-200 focus-visible:outline-none ${
                  isActive ? 'bg-primary/15 scale-[0.98] shadow-sm' : 'hover:bg-muted/60 focus-visible:bg-muted/60'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="bg-muted border-border/50 relative h-12 w-12 overflow-hidden rounded-full border shadow-sm">
                    {chat.isGroup ? (
                      chat.avatarUrl ? (
                        <Image src={chat.avatarUrl} alt={chat.name || 'Group'} fill className="object-cover" />
                      ) : (
                        <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center">
                          <Users className="h-5 w-5" />
                        </div>
                      )
                    ) : chat.otherUser?.avatarUrl ? (
                      <Image
                        src={chat.otherUser.avatarUrl}
                        alt={chat.otherUser.name || 'User'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center text-lg font-semibold">
                        {chat.otherUser?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  {!chat.isGroup && <OnlineIndicator userId={chat.otherUser?._id} />}
                </div>

                <div className="flex flex-1 flex-col overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground truncate text-sm font-semibold">
                      {chat.isGroup ? chat.name : chat.otherUser?.name || 'Unknown User'}
                    </span>
                    {chat.lastMessage && (
                      <span className="text-muted-foreground ml-2 shrink-0 text-[10px] font-medium">
                        {formatMessageTime(chat.lastMessage._creationTime)}
                      </span>
                    )}
                  </div>

                  <div className="mt-0.5 flex items-center justify-between">
                    <span
                      className={`truncate text-xs ${chat.unreadCount > 0 ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}
                    >
                      {chat.lastMessage ? chat.lastMessage.content : 'No messages yet'}
                    </span>
                    {chat.unreadCount > 0 && (
                      <span className="bg-primary text-primary-foreground flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold shadow-sm">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
