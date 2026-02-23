"use client";

import { Authenticated } from "convex/react";

// This is required to force Next.js to load layout.tsx from the correct root
export default function ChatPage() {
  return (
    <Authenticated>
      {/* For now, just render the overall Chat Layout structure */}
      <div />
    </Authenticated>
  );
}
