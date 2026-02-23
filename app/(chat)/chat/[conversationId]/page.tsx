"use client";

import { use } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { ChatUI } from "../../components/ChatUI";

export default function ConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = use(params);

  return <ChatUI conversationId={conversationId as Id<"conversations">} />;
}
