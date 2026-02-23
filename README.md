# DM-0: Full-Stack Realtime Chat Application

A high-performance, iMessage-inspired real-time chat application built with Next.js App Router, Convex, and Clerk Authentication. Designed with a mobile-first philosophy featuring instant message delivery, live presence indicators, and advanced group chat capabilities.

## 🚀 Features (14 Core Capabilities)

**1. Authentication & Security**

- Secure user signup/login using **Clerk** authentication.
- Private routes blocking unauthenticated connections.

**2. Custom User Profiles**

- Dedicated Profile view utilizing Convex database mutations.
- Users can set custom Usernames and sync avatars.

**3. Direct Messaging Engine**

- Real-time `1-on-1` messaging utilizing **Convex Subscriptions** for instant delivery (<10ms).
- Dynamic creation of conversations without manual page refresh.

**4. Search & Discovery**

- Global sidebar fuzzy-search for querying active users.
- Live-filter updates preventing interface layout shifts.

**5. Relative Timestamp Formatting**

- iMessage-style timestamp parsing logic.
- Dynamically renders "2:30 PM", "Yesterday", or "Oct 24" for messages and active conversations.

**6. Live Presence Indicators**

- Global "Active Heartbeat" presence system.
- Solid green online indicators for users active within the last 30 seconds.

**7. Synchronized Typing Indicators**

- Debounced keystroke events tracking typing states up to 2 seconds into the future.
- Animated CSS bouncing-dot indicators for active typists.

**8. Unread Message Badging**

- Tracks unread messages by slicing timestamps against a `lastReadMessageId` marker.
- Real-time notification badges mapped accurately in the sidebar.

**9. Smart Auto-Scroll Behavior**

- Viewport intersection observers utilizing `useRef` and React `onScroll`.
- Smartly prevents auto-scrolling when users are reading earlier history.
- "↓ New messages" pill for unread active tracking.

**10. Soft Message Deletes**

- Hover-state (desktop) and Long-press (mobile) trash icon actions.
- Cleanly patches messages as `isDeleted: true` to render an italicized placeholder instead of severing the DB record.

**11. Emoji Reaction Engine**

- Click-to-open `ReactionsPopover` mapping 10 core emojis.
- Aggregates Convex array records rendering compact counter bubbles underneath messages.

**12. Skeleton Loading Layouts**

- Highly polished Tailwind `animate-pulse` structure placeholders.
- Maps the exact dimensional geometry of the sidebar and chat header to eliminate layout jumping.

**13. Group Chat Architecture (Creation)**

- State-driven Multi-Select mode allowing users to aggregate multiple members.
- Integrated `shadcn` React Dialog Modals replacing native browser prompts for custom Group Naming.

**14. Group Administration (Avatar Uploads & Deletion)**

- `GroupSettingsModal` accessible via Chat Headers.
- Convex Storage URL generation allowing authorized members to upload custom group Avatars.
- Safe `deleteGroup` DB cascading method sweeping up nested messages and memberships gracefully.

---

## 💻 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database / Backend**: Convex
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (shadcn/ui)
- **Icons**: Lucide React

## 🛠 Getting Started

First, run the development server:

```bash
pnpm install
pnpm dev
```

Ensure your `.env.local` contains your active Clerk Publishable Key, Convex Deployment URL, and your Convex JWT template issuer domain.
