'use client';

import { UserButton } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/ThemeToggle';
import Image from 'next/image';
import { UserPen } from 'lucide-react';
import { useState } from 'react';
import { UserProfileDialog } from '@/components/ui/UserProfileDialog';

export function SidebarHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <div className="border-border bg-card/80 relative flex items-center justify-between overflow-hidden border-b p-4 backdrop-blur-md">
        {/* Subtle gradient accent */}
        <div className="from-primary/5 to-primary/5 pointer-events-none absolute inset-0 bg-linear-to-r via-transparent" />
        <div className="relative z-10 flex items-center gap-2">
          <Image src="/logo.svg" alt="dm-0" width={32} height={32} className="drop-shadow-sm" />
          <span className="text-primary text-lg font-bold tracking-tight">DM-0</span>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setIsProfileOpen(true)}
            className="border-border bg-background hover:bg-muted hover:text-foreground inline-flex h-9 w-9 items-center justify-center rounded-md border p-2 text-sm font-medium transition-colors"
            title="Change Username"
            aria-label="Change Username"
          >
            <UserPen className="h-4 w-4" />
          </button>
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'h-8 w-8',
              },
            }}
          />
        </div>
      </div>

      <UserProfileDialog isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}
