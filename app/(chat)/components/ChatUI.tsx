'use client';

import { useQuery, usePaginatedQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import Image from 'next/image';
import { ChatInput } from './ChatInput';
import { formatMessageTime } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { OnlineIndicator } from './OnlineIndicator';
import { TypingIndicator } from './TypingIndicator';
import { ReactionsPopover } from './ReactionsPopover';
import { GroupSettingsModal } from './GroupSettingsModal';
import { motion, AnimatePresence } from 'framer-motion';
export function ChatUI({ conversationId }: { conversationId: Id<'conversations'> }) {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  const isAtBottomRef = useRef(true);
  const prevMessagesLength = useRef(0);
  const [showNewBadge, setShowNewBadge] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const conversation = useQuery(api.conversations.getConversation, { conversationId });
  const currentUser = useQuery(api.auth.current);

  const {
    results: messages,
    status,
    loadMore,
  } = usePaginatedQuery(api.messages.getMessages, { conversationId }, { initialNumItems: 50 });

  const markRead = useMutation(api.conversations.markRead);
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const toggleReaction = useMutation(api.messages.toggleReaction);

  // Auto-scroll to bottom on new messages and mark read
  useEffect(() => {
    if (messages.length > 0) {
      const isInitialLoad = prevMessagesLength.current === 0;
      const hasNewMessages = messages.length > prevMessagesLength.current;

      prevMessagesLength.current = messages.length;

      // Mark the latest message as read
      const latestMessage = messages[messages.length - 1];
      if (latestMessage) {
        markRead({ conversationId, messageId: latestMessage._id }).catch(console.error);
      }

      const isMyMessage = latestMessage?.senderId === currentUser?._id;

      if (isAtBottomRef.current || isInitialLoad || isMyMessage) {
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: isInitialLoad ? 'auto' : 'smooth' });
        }, 10);
      } else if (hasNewMessages) {
        setTimeout(() => {
          setShowNewBadge(true);
        }, 0);
      }
    }
  }, [messages, conversationId, markRead, currentUser?._id]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const atBottom = scrollHeight - scrollTop - clientHeight < 100;
    isAtBottomRef.current = atBottom;
    if (atBottom && showNewBadge) {
      setShowNewBadge(false);
    }
  };

  // Mobile Long-Press State
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = (msgId: string) => {
    pressTimer.current = setTimeout(() => {
      setSelectedMessageId(msgId);
      // Optional: Add haptic feedback if supported by browser
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }, 400); // 400ms long press
  };

  const handleTouchEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  if (conversation === undefined || currentUser === undefined) {
    return (
      <div className="bg-background flex h-full flex-1 flex-col overflow-hidden">
        {/* Skeleton Header */}
        <div className="border-border bg-card/80 flex h-16 shrink-0 items-center gap-3 border-b px-4">
          <div className="bg-muted h-10 w-10 shrink-0 animate-pulse rounded-full"></div>
          <div className="flex flex-col gap-2">
            <div className="bg-muted h-4 w-32 animate-pulse rounded-md"></div>
            <div className="bg-muted h-3 w-20 animate-pulse rounded-md"></div>
          </div>
        </div>

        {/* Skeleton Messages Area */}
        <div className="flex-1 overflow-y-hidden p-4 opacity-60 sm:p-6">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
            <div className="bg-muted h-16 w-64 animate-pulse self-start rounded-2xl rounded-bl-sm"></div>
            <div className="bg-muted h-10 w-48 animate-pulse self-start rounded-2xl rounded-bl-sm"></div>
            <div className="bg-primary/20 h-12 w-64 animate-pulse self-end rounded-2xl rounded-br-sm"></div>
            <div className="bg-muted h-20 w-72 animate-pulse self-start rounded-2xl rounded-bl-sm"></div>
            <div className="bg-primary/20 h-10 w-40 animate-pulse self-end rounded-2xl rounded-br-sm"></div>
          </div>
        </div>
      </div>
    );
  }

  if (conversation === null || currentUser === null) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center p-8 text-center">
        <p className="text-foreground text-xl font-semibold">Chat not found</p>
        <p className="text-muted-foreground">
          This conversation might have been deleted or you don&apos;t have access.
        </p>
        <button onClick={() => router.push('/chat')} className="text-primary mt-4 hover:underline">
          Return to chat list
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background relative flex h-full flex-1 flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="border-border bg-card/80 relative flex h-16 shrink-0 items-center gap-3 overflow-hidden border-b px-4 backdrop-blur-md">
        {/* Subtle gradient accent */}
        <div className="from-primary/5 pointer-events-none absolute inset-0 bg-linear-to-r via-transparent to-transparent" />

        <button
          onClick={() => router.push('/chat')}
          className="hover:bg-muted relative z-10 mr-1 block rounded-full p-2 transition-colors sm:hidden"
        >
          <ArrowLeft className="text-foreground h-5 w-5" />
        </button>

        <div
          className={`relative z-10 flex items-center gap-3 ${conversation.isGroup ? 'cursor-pointer transition-opacity hover:opacity-80' : ''}`}
          onClick={() => {
            if (conversation.isGroup) setIsSettingsOpen(true);
          }}
        >
          <div className="relative h-10 w-10 shrink-0">
            <div className="bg-muted ring-border/50 relative h-full w-full overflow-hidden rounded-full shadow-sm ring-2">
              {conversation.isGroup ? (
                conversation.avatarUrl ? (
                  <Image
                    src={conversation.avatarUrl}
                    alt={conversation.name || 'Group'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="from-primary/20 to-primary/5 text-primary flex h-full w-full items-center justify-center bg-linear-to-br text-lg font-semibold">
                    {conversation.name?.charAt(0).toUpperCase() || 'G'}
                  </div>
                )
              ) : conversation.otherUser?.avatarUrl ? (
                <Image
                  src={conversation.otherUser.avatarUrl}
                  alt={conversation.otherUser.name || 'User'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="from-primary/20 to-primary/5 text-primary flex h-full w-full items-center justify-center bg-linear-to-br text-lg font-semibold">
                  {conversation.otherUser?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            {!conversation.isGroup && <OnlineIndicator userId={conversation.otherUser?._id} />}
          </div>

          <div className="flex flex-col">
            <span className="text-foreground font-semibold">
              {conversation.isGroup ? conversation.name : conversation.otherUser?.name || 'Unknown User'}
            </span>
            <span className="text-muted-foreground max-w-[200px] truncate text-xs sm:max-w-md">
              {conversation.isGroup
                ? `${conversation.groupMembers?.length || 0} members`
                : `@${conversation.otherUser?.username || 'unknown'}`}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-4 sm:p-6"
        onScroll={handleScroll}
        onClick={() => setSelectedMessageId(null)}
      >
        <div className="relative mx-auto flex min-h-full max-w-4xl flex-col justify-end gap-4">
          {status === 'CanLoadMore' && (
            <div className="flex justify-center pb-4">
              <button
                onClick={() => loadMore(50)}
                className="bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground rounded-full px-4 py-1.5 text-xs font-medium transition-colors"
              >
                Load older messages
              </button>
            </div>
          )}

          {status === 'LoadingMore' && (
            <div className="flex justify-center pb-4">
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            </div>
          )}

          {messages.length === 0 && status !== 'LoadingFirstPage' ? (
            <div className="flex w-full flex-col items-center justify-center py-10 opacity-60">
              <div className="bg-primary/10 text-primary mb-3 flex h-16 w-16 items-center justify-center rounded-full">
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
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium">No messages yet</p>
              <p className="text-muted-foreground text-xs">Send a message to start the conversation</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => {
                const isMe = msg.senderId === currentUser._id;

                // Check if the previous message was from the same user to avoid redundant sender names
                const prevMsg = index > 0 ? messages[index - 1] : null;
                const showSenderName = conversation.isGroup && !isMe && (!prevMsg || prevMsg.senderId !== msg.senderId);

                if (msg.isDeleted) {
                  return (
                    <motion.div
                      key={msg._id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`flex max-w-[80%] flex-col gap-1 ${isMe ? 'items-end self-end' : 'items-start self-start'}`}
                    >
                      {showSenderName && (
                        <span className="text-muted-foreground pl-1 text-xs font-medium">{msg.senderName}</span>
                      )}
                      <div className="border-border text-muted-foreground rounded-2xl border bg-transparent px-4 py-2 text-[15px] italic">
                        This message was deleted
                      </div>
                      <span className="text-muted-foreground px-1 text-[10px] font-medium">
                        {formatMessageTime(msg._creationTime)}
                      </span>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`group flex max-w-[80%] flex-col gap-1 ${isMe ? 'items-end self-end' : 'items-start self-start'}`}
                  >
                    {showSenderName && (
                      <span className="text-muted-foreground pl-1 text-xs font-medium">{msg.senderName}</span>
                    )}
                    <div
                      className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'} relative`}
                      onTouchStart={() => handleTouchStart(msg._id as string)}
                      onTouchEnd={handleTouchEnd}
                      onTouchCancel={handleTouchEnd}
                      onClick={e => {
                        // Prevent click from reaching the parent container (which dismissed the actions)
                        if (selectedMessageId === msg._id) {
                          e.stopPropagation();
                        }
                      }}
                    >
                      <div
                        className={`rounded-2xl px-4 py-2 text-[15px] shadow-sm backdrop-blur-md transition-transform duration-200 ${
                          selectedMessageId === msg._id ? 'scale-[0.98] opacity-90' : ''
                        } ${
                          isMe
                            ? 'bg-primary text-primary-foreground border-primary/20 rounded-br-sm border'
                            : 'bg-muted text-foreground border-border/50 rounded-bl-sm border'
                        }`}
                      >
                        {msg.content}
                      </div>

                      {/* Action Buttons (Visible via selectedMessageId on mobile, or group-hover on desktop) */}
                      <div
                        className={`bg-background/80 dark:bg-card border-border/50 flex items-center gap-1 rounded-full border px-1 py-0.5 shadow-sm backdrop-blur-sm transition-opacity duration-200 ${
                          selectedMessageId === msg._id || isMe === false /* Always allow hover on desktop */
                            ? 'z-10 opacity-100'
                            : 'opacity-0 group-hover:opacity-100'
                        } ${
                          !isMe && selectedMessageId !== msg._id ? 'opacity-0 group-hover:opacity-100' : '' // Ensure logic applies to both
                        } ${isMe ? 'mr-1' : 'ml-1'}`}
                      >
                        {isMe && (
                          <button
                            onClick={() => {
                              deleteMessage({ messageId: msg._id as Id<'messages'> });
                              setSelectedMessageId(null);
                            }}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full p-1.5 transition-colors"
                            title="Delete message"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}

                        <div className="text-muted-foreground hover:text-foreground">
                          <ReactionsPopover messageId={msg._id as Id<'messages'>} reactions={msg.reactions || []} />
                        </div>
                      </div>
                    </div>

                    {/* Render Active Reactions */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className={`flex flex-wrap gap-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {msg.reactions.map(({ emoji, count, userIds }) => {
                          const hasReacted = currentUser && userIds.includes(currentUser._id);
                          return (
                            <button
                              key={emoji}
                              onClick={() =>
                                toggleReaction({ messageId: msg._id as Id<'messages'>, emoji }).catch(console.error)
                              }
                              className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium transition-colors ${
                                hasReacted
                                  ? 'bg-primary/20 text-primary border-primary/30 border'
                                  : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted border'
                              }`}
                            >
                              <span>{emoji}</span>
                              <span>{count}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <span className="text-muted-foreground px-1 text-[10px] font-medium">
                      {formatMessageTime(msg._creationTime)}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}

          {/* Typing Indicator — supports both 1-on-1 and group */}
          {conversation.isGroup ? (
            <TypingIndicator groupMembers={conversation.groupMembers || []} currentUserId={currentUser._id} />
          ) : (
            <TypingIndicator typingUntil={conversation.otherMember?.typingUntil} name={conversation.otherUser?.name} />
          )}

          <div ref={bottomRef} className="h-1 shrink-0" />
        </div>
      </div>

      {showNewBadge && (
        <div className="animate-in fade-in slide-in-from-bottom-4 absolute bottom-20 left-1/2 z-10 -translate-x-1/2 duration-300">
          <button
            onClick={() => {
              bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
              setShowNewBadge(false);
            }}
            className="bg-primary/95 text-primary-foreground hover:bg-primary flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium shadow-lg backdrop-blur-md transition-colors"
          >
            ↓ New messages
          </button>
        </div>
      )}

      {/* Input Area */}
      <ChatInput conversationId={conversationId} />

      {/* Group Settings Modal */}
      {conversation.isGroup && (
        <GroupSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          conversationId={conversationId}
          groupName={conversation.name || 'Group'}
          avatarUrl={conversation.avatarUrl}
          memberCount={conversation.groupMembers?.length || 0}
          groupMembers={conversation.groupMembers || []}
          adminId={conversation.adminId}
        />
      )}
    </div>
  );
}
