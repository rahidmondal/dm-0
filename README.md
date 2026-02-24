# DM-0

A real-time messaging app built with Next.js, Convex, and Clerk.

## Features

- **Real-time messaging** — instant delivery with live typing indicators
- **Group chats** — create groups, invite members, upload avatars
- **Presence status** — see who's online in real time
- **Emoji reactions** — react to messages with emojis
- **Unread badges** — track unread messages per conversation
- **User profiles** — custom usernames and synced avatars
- **Secure auth** — powered by Clerk with protected routes

## Tech Stack

| Layer         | Technology           |
| ------------- | -------------------- |
| Framework     | Next.js (App Router) |
| Backend / DB  | Convex               |
| Auth          | Clerk                |
| Styling       | Tailwind CSS         |
| UI Components | shadcn/ui            |
| Icons         | Lucide React         |

## Getting Started

```bash
pnpm install
pnpm dev
```

Create a `.env.local` with:
```
CONVEX_DEPLOYMENT=

NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CONVEX_SITE_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_JWT_ISSUER_DOMAIN=
```

## License

© 2026 DM-0. All rights reserved.
