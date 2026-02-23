"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";

export function SyncUserWithConvex() {
  const { user } = useUser();
  const syncUser = useMutation(api.users.syncUser);

  useEffect(() => {
    if (!user) return;

    const performSync = async () => {
      try {
        await syncUser();
      } catch (error) {
        console.error("Error syncing user to Convex:", error);
      }
    };

    performSync();
  }, [user, syncUser]);

  return null;
}

