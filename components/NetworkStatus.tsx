'use client';

import { useSyncExternalStore } from 'react';
import { WifiOff } from 'lucide-react';

function subscribe(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // Always assume online during SSR
}

export function NetworkStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (isOnline) return null;

  return (
    <div className="bg-destructive text-destructive-foreground animate-in slide-in-from-top fixed top-0 right-0 left-0 z-50 flex items-center justify-center gap-2 py-2 text-sm font-medium shadow-lg duration-300">
      <WifiOff className="h-4 w-4" />
      You are offline — messages will sync when reconnected
    </div>
  );
}
