'use client';

import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const CONNECTION_ID = typeof window !== 'undefined' ? uuidv4() : '';
const HEARTBEAT_INTERVAL = 15000; // 15 seconds

export function GlobalPresence() {
  const heartbeat = useMutation(api.presence.heartbeat);
  const removePresence = useMutation(api.presence.removePresence);
  const currentUser = useQuery(api.auth.current);

  useEffect(() => {
    if (currentUser === undefined || currentUser === null) return;

    const ping = () => {
      heartbeat({ connectionId: CONNECTION_ID }).catch(console.error);
    };

    ping();

    const intervalId = setInterval(ping, HEARTBEAT_INTERVAL);

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

  return null;
}
