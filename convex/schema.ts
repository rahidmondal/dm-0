import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    username: v.string(),
    name: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
  })
    .index('by_clerkId', ['clerkId'])
    .index('by_username', ['username'])
    .searchIndex('search_name', { searchField: 'name' }),

  presence: defineTable({
    userId: v.id('users'),
    connectionId: v.string(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_connectionId', ['userId', 'connectionId']),

  conversations: defineTable({
    isGroup: v.boolean(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    directKey: v.optional(v.string()), // Format: sorted `userIdA_userIdB`
    adminId: v.optional(v.id('users')), // Group creator/admin
    lastMessageId: v.optional(v.id('messages')),
    updatedAt: v.number(),
  }).index('by_directKey', ['directKey']),

  members: defineTable({
    conversationId: v.id('conversations'),
    userId: v.id('users'),
    lastReadMessageId: v.optional(v.id('messages')),
    typingUntil: v.optional(v.number()),
  })
    .index('by_conversationId', ['conversationId'])
    .index('by_userId', ['userId'])
    .index('by_userId_and_conversationId', ['userId', 'conversationId']),

  messages: defineTable({
    conversationId: v.id('conversations'),
    senderId: v.id('users'),
    content: v.string(),
    isDeleted: v.boolean(),
  }).index('by_conversationId', ['conversationId']),

  reactions: defineTable({
    messageId: v.id('messages'),
    userId: v.id('users'),
    emoji: v.string(),
  })
    .index('by_messageId', ['messageId'])
    .index('by_messageId_and_userId', ['messageId', 'userId']),
});
