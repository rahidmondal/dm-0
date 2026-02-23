# Application Architecture

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Dark/Light mode, Purple/Royal Blue Theme)
- **Authentication**: Clerk
- **Database & Real-time**: Convex

## Implementation Strategy

- **Client/Server Split**: Using React Server Components for initial load where possible, but relying heavily on Client Components for real-time chat interactions powered by Convex hooks.
- **Micro-animations**: Enhanced UI interactions using CSS transitions and simple Framer Motion or Tailwind animations.
- **Routing**: `app/page.tsx` will serve as the main chat interface containing the Sidebar and Chat Area. Authentication routes will be handled by Clerk components or dedicated `/sign-in`, `/sign-up` routes.
- **Responsive Design**: Mobile-first CSS. On small screens, hide the chat area when viewing the conversation list, and vice versa.

## Core Features Flow

1. **User Sign Up**: Clerk handles auth -> Webhook (or client effect) creates a synced `users` record in Convex.
2. **Finding Users**: Client queries `users` via `useQuery` utilizing Convex's `searchIndex`.
3. **Starting a Chat**: Client computes a deterministic `directKey` (e.g., `userA_id_userB_id`), calls a Convex mutation which strictly enforces uniqueness to either get the existing conversation ID or create a new one.
4. **Sending Messages**: Client calls a Convex mutation to insert into `messages`. Convex automatically updates subscriptions for all clients listening to that `conversationId`.
5. **Presence/Online Status**: Client maintains a heartbeat mutation updating the `presence` table, allowing the UI to accurately reflect multi-tab/multi-device online status.
