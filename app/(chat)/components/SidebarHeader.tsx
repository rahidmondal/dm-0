"use client";

import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";

export function SidebarHeader() {
  return (
    <div className="flex items-center justify-between border-b border-border p-4 bg-card/80 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="dm-0" width={32} height={32} />
        <span className="font-bold tracking-tight text-primary">dm-0</span>
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "h-8 w-8"
            }
          }}
        />
      </div>
    </div>
  );
}
