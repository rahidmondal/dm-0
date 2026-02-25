'use client';

import { UserButton } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/ThemeToggle';
import Image from 'next/image';
import Link from 'next/link';

export function SidebarHeader() {
  return (
    <div className="border-border bg-card/80 relative flex items-center justify-between overflow-hidden border-b p-4 backdrop-blur-md">
      {/* Subtle gradient accent */}
      <div className="from-primary/5 to-primary/5 pointer-events-none absolute inset-0 bg-linear-to-r via-transparent" />

      {/* Clickable logo → /chat */}
      <Link href="/chat" className="relative z-10 flex items-center gap-2 transition-transform hover:scale-105">
        <Image src="/logo.svg" alt="DM-0" width={32} height={32} className="drop-shadow-sm" />
        <span className="text-primary text-lg font-bold tracking-tight">DM-0</span>
      </Link>

      <div className="relative z-10 flex items-center gap-2">
        <ThemeToggle />
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'h-8 w-8',
            },
          }}
        />
      </div>
    </div>
  );
}
