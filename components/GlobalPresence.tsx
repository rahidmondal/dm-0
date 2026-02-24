'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Generate a stable connection ID for this browser tab session length
const CONNECTION_ID = typeof window !== 'undefined' ? uuidv4() : '';
const HEARTBEAT_INTERVAL = 15000; // 15 seconds

export function GlobalPresence() {
  const heartbeat = useMutation(api.presence.heartbeat);
  const removePresence = useMutation(api.presence.removePresence);
  const currentUser = useQuery(api.auth.current);

  useEffect(() => {
    // Only start heartbeat if we are logged in relative to convex
    if (currentUser === undefined || currentUser === null) return;

    const ping = () => {
      heartbeat({ connectionId: CONNECTION_ID }).catch(console.error);
    };

    // Initial ping
    ping();

    // Set up recurring ping
    const intervalId = setInterval(ping, HEARTBEAT_INTERVAL);

    // Cleanup ping when tab closes or component unmounts
    const handleBeforeUnload = () => {
      removePresence({ connectionId: CONNECTION_ID });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      removePresence({ connectionId: CONNECTION_ID }).catch(console.error);
    };
  }, [currentUser, heartbeat, removePresence]);

  // This component doesn't render anything, it just manages the background heartbeat
  return null;
}
