"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function OnlineIndicator({ userId }: { userId?: Id<"users"> }) {
  const isOnline = useQuery(api.presence.isUserOnline, userId ? { userId } : "skip");

  if (!isOnline) return null;

  return (
    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-background bg-green-500 shadow-sm"></span>
  );
}
