# Database Schema (Convex)

This document outlines the database tables, fields, and indices designed for the real-time chat application to ensure scalability and performance.

### `users` table

Stores synced Clerk user data with an editable handle.

- `clerkId` (string) - _Index: `by_clerkId`_
- `username` (string) - _Editable user id/handle, Index: `by_username`_
- `name` (string) - _Search Index: `name` for fuzzy filtering_
- `email` (string)
- `avatarUrl` (string, optional)

### `presence` table

Handles multi-device online status accurately using a heartbeat pattern.

- `userId` (reference to users)
- `connectionId` (string) - _Represents a unique socket/tab session_
- `updatedAt` (number) - _Heartbeat timestamp_
- **Indexes**: `by_userId` to check if a user is online.

### `conversations` table

Represents a chat thread (1-on-1 or Group).

- `isGroup` (boolean)
- `name` (string, optional)
- `directKey` (string, optional) - _For 1-on-1 conversations only. Format: `[userIdA]_[userIdB]` sorted lexicographically.\_
- `lastMessageId` (reference to messages, optional) - _Used purely as an optimization for sidebar previews. If a message is soft-deleted, we fallback to querying the `messages` table ordered by `_creationTime` desc limit 1 to compute the correct preview._
- `updatedAt` (number, system timestamp or manual update for sorting)
- **Indexes**: `by_directKey` (unique index to strictly enforce only **one** 1-on-1 conversation between any two users).

### `members` table

A mapping table to handle the many-to-many relationship between users and conversations efficiently.

- `conversationId` (reference to conversations)
- `userId` (reference to users)
- `lastReadMessageId` (reference to messages, optional)
- `typingUntil` (number, optional)
- **Indexes**:
  - `by_conversationId` (Find all users in a group)
  - `by_userId` (Find all conversations for a user - critical for sidebars)
  - `by_userId_and_conversationId` (Composite index to efficiently check membership)

### `messages` table

Supports cursor-based pagination and real-time subscriptions out of the box with Convex's `_creationTime`.

- `conversationId` (reference to conversations)
- `senderId` (reference to users)
- `content` (string)
- `isDeleted` (boolean) - _For Feature 11 (Soft delete)_
- **Indexes**: `by_conversationId` (Convex will naturally order these by `_creationTime`. This is strictly required for real-time subscription, infinite scroll, and auto-scroll).

### `reactions` table

- `messageId` (reference to messages)
- `userId` (reference to users)
- `emoji` (string)
- **Indexes**:
  - `by_messageId` (Fetch reactions for a message)
  - `by_messageId_and_userId` (Composite to prevent duplicate reactions from the same user).
