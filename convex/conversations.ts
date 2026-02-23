import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const getOrCreateConversation = mutation({
  args: { otherUserId: v.id('users') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser) throw new Error('User not found');

    if (currentUser._id === args.otherUserId) {
      throw new Error('Cannot create a conversation with yourself');
    }

    // Sort IDs to ensure a consistent directKey
    const sortedIds = [currentUser._id, args.otherUserId].sort();
    const directKey = `${sortedIds[0]}_${sortedIds[1]}`;

    // Check if conversation already exists
    const existing = await ctx.db
      .query('conversations')
      .withIndex('by_directKey', q => q.eq('directKey', directKey))
      .unique();

    if (existing) {
      return existing._id;
    }

    // Create new conversation
    const conversationId = await ctx.db.insert('conversations', {
      isGroup: false,
      directKey,
      updatedAt: Date.now(),
    });

    // Create member entries
    await ctx.db.insert('members', {
      conversationId,
      userId: currentUser._id,
    });

    await ctx.db.insert('members', {
      conversationId,
      userId: args.otherUserId,
    });

    return conversationId;
  },
});

export const getMyConversations = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser) return [];

    const memberships = await ctx.db
      .query('members')
      .withIndex('by_userId', q => q.eq('userId', currentUser._id))
      .collect();

    const conversations = await Promise.all(
      memberships.map(async membership => {
        const conversation = await ctx.db.get(membership.conversationId);
        if (!conversation) return null;

        // Since it's a 1-on-1, find the other member
        const otherMember = await ctx.db
          .query('members')
          .withIndex('by_conversationId', q => q.eq('conversationId', conversation._id))
          .filter(q => q.neq(q.field('userId'), currentUser._id))
          .first();

        const otherUser = otherMember ? await ctx.db.get(otherMember.userId) : null;

        // Get preview of last message
        const lastMessage = conversation.lastMessageId ? await ctx.db.get(conversation.lastMessageId) : null;

        return {
          _id: conversation._id,
          updatedAt: conversation.updatedAt,
          otherUser,
          lastMessage,
          unreadCount: 0, // placeholder for future
        };
      }),
    );

    return conversations.filter(c => c !== null).sort((a, b) => b!.updatedAt - a!.updatedAt);
  },
});

export const getConversation = query({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser) return null;

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) return null;

    const membership = await ctx.db
      .query('members')
      .withIndex('by_userId_and_conversationId', q =>
        q.eq('userId', currentUser._id).eq('conversationId', args.conversationId),
      )
      .unique();

    if (!membership) return null;

    const otherMember = await ctx.db
      .query('members')
      .withIndex('by_conversationId', q => q.eq('conversationId', conversation._id))
      .filter(q => q.neq(q.field('userId'), currentUser._id))
      .first();

    const otherUser = otherMember ? await ctx.db.get(otherMember.userId) : null;

    return {
      _id: conversation._id,
      isGroup: conversation.isGroup,
      otherUser,
    };
  },
});
