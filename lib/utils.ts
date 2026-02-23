import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMessageTime(timestamp: number) {
  const date = new Date(timestamp);
  const now = new Date();

  // If it's today, show only time (e.g., 2:30 PM)
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  // If it's from this year, show Month and Day (e.g., Oct 24, 2:30 PM)
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  // Otherwise show full date
  return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
}
