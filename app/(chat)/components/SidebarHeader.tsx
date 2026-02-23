"use client";

import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import { Settings } from "lucide-react";
import { useState } from "react";
import { UserProfileDialog } from "@/components/ui/UserProfileDialog";

export function SidebarHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b border-border p-4 bg-card/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="dm-0" width={32} height={32} />
          <span className="font-bold tracking-tight text-primary">dm-0</span>
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background p-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Profile Settings"
          >
            <Settings className="h-4 w-4" />
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

