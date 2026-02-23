"use client";

import { useQuery, usePaginatedQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { ChatInput } from "./ChatInput";
import { formatMessageTime } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { OnlineIndicator } from "./OnlineIndicator";
import { TypingIndicator } from "./TypingIndicator";
import { ReactionsPopover } from "./ReactionsPopover";
import { GroupSettingsModal } from "./GroupSettingsModal";

export function ChatUI({ conversationId }: { conversationId: Id<"conversations"> }) {
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
  } = usePaginatedQuery(
    api.messages.getMessages,
    { conversationId },
    { initialNumItems: 50 }
  );

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
          bottomRef.current?.scrollIntoView({ behavior: isInitialLoad ? "auto" : "smooth" });
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
      <div className="flex h-full flex-1 flex-col overflow-hidden bg-background">
        {/* Skeleton Header */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card/80 px-4">
          <div className="h-10 w-10 shrink-0 rounded-full bg-muted animate-pulse"></div>
          <div className="flex flex-col gap-2">
            <div className="h-4 w-32 rounded-md bg-muted animate-pulse"></div>
            <div className="h-3 w-20 rounded-md bg-muted animate-pulse"></div>
          </div>
        </div>
        
        {/* Skeleton Messages Area */}
        <div className="flex-1 overflow-y-hidden p-4 sm:p-6 opacity-60">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 w-full">
            <div className="self-start h-16 w-64 rounded-2xl rounded-bl-sm bg-muted animate-pulse"></div>
            <div className="self-start h-10 w-48 rounded-2xl rounded-bl-sm bg-muted animate-pulse"></div>
            <div className="self-end h-12 w-64 rounded-2xl rounded-br-sm bg-primary/20 animate-pulse"></div>
            <div className="self-start h-20 w-72 rounded-2xl rounded-bl-sm bg-muted animate-pulse"></div>
            <div className="self-end h-10 w-40 rounded-2xl rounded-br-sm bg-primary/20 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (conversation === null || currentUser === null) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center p-8 text-center">
        <p className="text-xl font-semibold text-foreground">Chat not found</p>
        <p className="text-muted-foreground">This conversation might have been deleted or you don&apos;t have access.</p>
        <button onClick={() => router.push("/chat")} className="mt-4 text-primary hover:underline">
          Return to chat list
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-background relative">
      {/* Chat Header */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-md">
        <button 
          onClick={() => router.push("/chat")}
          className="mr-1 block rounded-full p-2 hover:bg-muted sm:hidden"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        
        <div 
          className={`flex items-center gap-3 ${conversation.isGroup ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
          onClick={() => {
            if (conversation.isGroup) setIsSettingsOpen(true);
          }}
        >
          <div className="relative h-10 w-10 shrink-0">
            <div className="relative h-full w-full overflow-hidden rounded-full bg-muted">
              {conversation.isGroup ? (
                conversation.avatarUrl ? (
                  <Image src={conversation.avatarUrl} alt={conversation.name || "Group"} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-lg font-semibold text-primary">
                    {conversation.name?.charAt(0).toUpperCase() || "G"}
                  </div>
                )
              ) : conversation.otherUser?.avatarUrl ? (
                <Image src={conversation.otherUser.avatarUrl} alt={conversation.otherUser.name || "User"} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-lg font-semibold text-primary">
                  {conversation.otherUser?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            {!conversation.isGroup && <OnlineIndicator userId={conversation.otherUser?._id} />}
          </div>
          
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">
              {conversation.isGroup ? conversation.name : conversation.otherUser?.name || "Unknown User"}
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-md">
              {conversation.isGroup 
                ? `${conversation.groupMembers?.length || 0} members`
                : `@${conversation.otherUser?.username || "unknown"}`
              }
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
        <div className="mx-auto flex max-w-4xl flex-col gap-4 relative min-h-full justify-end">
          
          {status === "CanLoadMore" && (
            <div className="flex justify-center pb-4">
              <button 
                onClick={() => loadMore(50)}
                className="rounded-full bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
              >
                Load older messages
              </button>
            </div>
          )}
          
          {status === "LoadingMore" && (
            <div className="flex justify-center pb-4">
               <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}

          {messages.length === 0 && status !== "LoadingFirstPage" ? (
             <div className="flex w-full flex-col items-center justify-center py-10 opacity-60">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <p className="text-sm font-medium">No messages yet</p>
                <p className="text-xs text-muted-foreground">Send a message to start the conversation</p>
             </div>
          ) : (
             messages.map((msg, index) => {
               const isMe = msg.senderId === currentUser._id;
               
               // Check if the previous message was from the same user to avoid redundant sender names
               const prevMsg = index > 0 ? messages[index - 1] : null;
               const showSenderName = conversation.isGroup && !isMe && (!prevMsg || prevMsg.senderId !== msg.senderId);
               
               if (msg.isDeleted) {
                 return (
                   <div key={msg._id} className={`flex max-w-[80%] flex-col gap-1 ${isMe ? "self-end items-end" : "self-start items-start"}`}>
                     {showSenderName && (
                       <span className="pl-1 text-xs font-medium text-muted-foreground">{msg.senderName}</span>
                     )}
                     <div className="rounded-2xl px-4 py-2 text-[15px] border border-border bg-transparent text-muted-foreground italic">
                       This message was deleted
                     </div>
                     <span className="px-1 text-[10px] text-muted-foreground font-medium">
                       {formatMessageTime(msg._creationTime)}
                     </span>
                   </div>
                 );
               }

               return (
                 <div
                   key={msg._id}
                   className={`group flex max-w-[80%] flex-col gap-1 ${isMe ? "self-end items-end" : "self-start items-start"}`}
                 >
                   {showSenderName && (
                     <span className="pl-1 text-xs font-medium text-muted-foreground">{msg.senderName}</span>
                   )}
                   <div 
                     className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"} relative`}
                     onTouchStart={() => handleTouchStart(msg._id as string)}
                     onTouchEnd={handleTouchEnd}
                     onTouchCancel={handleTouchEnd}
                     onClick={(e) => {
                       // Prevent click from reaching the parent container (which dismissed the actions)
                       if (selectedMessageId === msg._id) {
                         e.stopPropagation();
                       }
                     }}
                   >
                     <div 
                       className={`rounded-2xl px-4 py-2 text-[15px] transition-transform duration-200 ${
                         selectedMessageId === msg._id ? "scale-[0.98] opacity-90" : ""
                       } ${
                         isMe 
                           ? "bg-primary text-primary-foreground rounded-br-sm" 
                           : "bg-muted text-foreground rounded-bl-sm"
                       }`}
                     >
                       {msg.content}
                     </div>
                     
                     {/* Action Buttons (Visible via selectedMessageId on mobile, or group-hover on desktop) */}
                     <div className={`flex items-center gap-1 transition-opacity duration-200 bg-background/80 dark:bg-card border border-border/50 backdrop-blur-sm rounded-full px-1 py-0.5 shadow-sm ${
                       selectedMessageId === msg._id || isMe === false /* Always allow hover on desktop */
                         ? "opacity-100 z-10" 
                         : "opacity-0 group-hover:opacity-100"
                     } ${
                       !isMe && selectedMessageId !== msg._id ? "opacity-0 group-hover:opacity-100" : "" // Ensure logic applies to both
                     } ${
                       isMe ? "mr-1" : "ml-1"
                     }`}>
                       {isMe && (
                         <button
                           onClick={() => {
                             deleteMessage({ messageId: msg._id as Id<"messages"> });
                             setSelectedMessageId(null);
                           }}
                           className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                           title="Delete message"
                         >
                           <Trash2 className="h-3.5 w-3.5" />
                         </button>
                       )}
                       
                       <div className="text-muted-foreground hover:text-foreground">
                         <ReactionsPopover 
                           messageId={msg._id as Id<"messages">} 
                           reactions={msg.reactions || []} 
                         />
                       </div>
                     </div>
                   </div>
                   
                   {/* Render Active Reactions */}
                   {msg.reactions && msg.reactions.length > 0 && (
                     <div className={`flex flex-wrap gap-1 ${isMe ? "justify-end" : "justify-start"}`}>
                       {msg.reactions.map(({ emoji, count, userIds }) => {
                         const hasReacted = currentUser && userIds.includes(currentUser._id);
                         return (
                           <button
                             key={emoji}
                             onClick={() => toggleReaction({ messageId: msg._id as Id<"messages">, emoji }).catch(console.error)}
                             className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium transition-colors ${
                               hasReacted 
                                 ? "bg-primary/20 text-primary border border-primary/30" 
                                 : "bg-muted/50 text-muted-foreground border border-border hover:bg-muted"
                             }`}
                           >
                             <span>{emoji}</span>
                             <span>{count}</span>
                           </button>
                         );
                       })}
                     </div>
                   )}
                   
                   <span className="px-1 text-[10px] text-muted-foreground font-medium">
                     {formatMessageTime(msg._creationTime)}
                   </span>
                 </div>
               );
             })
          )}
          
          <TypingIndicator 
            typingUntil={conversation.otherMember?.typingUntil} 
            name={conversation.otherUser?.name} 
          />
          
          <div ref={bottomRef} className="h-1 shrink-0" />
        </div>
      </div>

      {showNewBadge && (
        <div className="absolute bottom-20 left-1/2 z-10 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button 
            onClick={() => {
              bottomRef.current?.scrollIntoView({ behavior: "smooth" });
              setShowNewBadge(false);
            }}
            className="flex items-center gap-2 rounded-full bg-primary/95 px-4 py-1.5 text-sm font-medium text-primary-foreground shadow-lg backdrop-blur-md transition-colors hover:bg-primary"
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
          groupName={conversation.name || "Group"}
          avatarUrl={conversation.avatarUrl}
          memberCount={conversation.groupMembers?.length || 0}
        />
      )}
    </div>
  );
}
