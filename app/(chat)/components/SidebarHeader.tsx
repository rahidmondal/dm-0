"use client";

import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import { UserPen } from "lucide-react";
import { useState } from "react";
import { UserProfileDialog } from "@/components/ui/UserProfileDialog";

export function SidebarHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b border-border p-4 bg-card/80 backdrop-blur-md relative overflow-hidden">
        {/* Subtle gradient accent */}
        <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="flex items-center gap-2 relative z-10">
          <Image src="/logo.svg" alt="dm-0" width={32} height={32} className="drop-shadow-sm" />
          <span className="font-bold tracking-tight text-primary text-lg">DM-0</span>
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
          <ThemeToggle />
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background p-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
            title="Change Username"
            aria-label="Change Username"
          >
            <UserPen className="h-4 w-4" />
          </button>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "h-8 w-8"
              }
            }}
          />
        </div>
      </div>

      <UserProfileDialog 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </>
  );
}

