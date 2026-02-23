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

        // Fetch the active members of this conversation
        const activeMembers = await ctx.db
          .query('members')
          .withIndex('by_conversationId', q => q.eq('conversationId', conversation._id))
          .collect();

        // If it's a 1-on-1, find the other member
        let otherUser = null;
        if (!conversation.isGroup) {
          const otherMember = activeMembers.find(m => m.userId !== currentUser._id);
          otherUser = otherMember ? await ctx.db.get(otherMember.userId) : null;
        }

        // Get preview of last message
        const lastMessage = conversation.lastMessageId ? await ctx.db.get(conversation.lastMessageId) : null;

        // Calculate unread count (capped at 20 for performance)
        let unreadCount = 0;
        if (membership.lastReadMessageId) {
          const lastReadMsg = await ctx.db.get(membership.lastReadMessageId);
          if (lastReadMsg) {
            const newerMessages = await ctx.db
              .query('messages')
              .withIndex('by_conversationId', q => q.eq('conversationId', conversation._id))
              .filter(q => q.gt(q.field('_creationTime'), lastReadMsg._creationTime))
              .take(20);
            unreadCount = newerMessages.length;
          }
        } else {
          // If never read, count up to 20 messages
          const allMessages = await ctx.db
            .query('messages')
            .withIndex('by_conversationId', q => q.eq('conversationId', conversation._id))
            .take(20);
          unreadCount = allMessages.length;
        }

        return {
          _id: conversation._id,
          isGroup: conversation.isGroup,
          name: conversation.name,
          avatarUrl: conversation.avatarUrl,
          memberCount: activeMembers.length,
          updatedAt: conversation.updatedAt,
          otherUser,
          lastMessage,
          unreadCount,
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

    const activeMembers = await ctx.db
      .query('members')
      .withIndex('by_conversationId', q => q.eq('conversationId', conversation._id))
      .collect();

    let otherUser = null;
    let otherMember = null;
    let groupMembers = null;

    if (!conversation.isGroup) {
      otherMember = activeMembers.find(m => m.userId !== currentUser._id) || null;
      otherUser = otherMember ? await ctx.db.get(otherMember.userId) : null;
    } else {
      // For groups, map out all members to return their details
      groupMembers = await Promise.all(
        activeMembers.map(async m => {
          const user = await ctx.db.get(m.userId);
          return {
            _id: user?._id,
            name: user?.name,
            avatarUrl: user?.avatarUrl,
            typingUntil: m.typingUntil,
          };
        }),
      );
    }

    return {
      _id: conversation._id,
      isGroup: conversation.isGroup,
      name: conversation.name,
      avatarUrl: conversation.avatarUrl,
      otherUser,
      otherMember: otherMember ? { typingUntil: otherMember.typingUntil } : null,
      groupMembers,
    };
  },
});

export const setTyping = mutation({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser) return;

    const membership = await ctx.db
      .query('members')
      .withIndex('by_userId_and_conversationId', q =>
        q.eq('userId', currentUser._id).eq('conversationId', args.conversationId),
      )
      .unique();

    if (!membership) return;

    // Set typing status valid for the next 2 seconds
    await ctx.db.patch(membership._id, { typingUntil: Date.now() + 2000 });
  },
});

export const markRead = mutation({
  args: { conversationId: v.id('conversations'), messageId: v.id('messages') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser) return;

    const membership = await ctx.db
      .query('members')
      .withIndex('by_userId_and_conversationId', q =>
        q.eq('userId', currentUser._id).eq('conversationId', args.conversationId),
      )
      .unique();

    if (!membership) return;

    await ctx.db.patch(membership._id, { lastReadMessageId: args.messageId });
  },
});

export const createGroup = mutation({
  args: {
    name: v.string(),
    memberIds: v.array(v.id('users')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser) throw new Error('User not found');

    if (args.memberIds.length < 1) {
      throw new Error('Group must have at least one other member');
    }

    // Create the group conversation
    const conversationId = await ctx.db.insert('conversations', {
      isGroup: true,
      name: args.name,
      updatedAt: Date.now(),
      // directKey is omitted for groups
    });

    // Add the creator
    await ctx.db.insert('members', {
      conversationId,
      userId: currentUser._id,
    });

    // Add all selected members
    for (const memberId of args.memberIds) {
      // Prevent adding the creator twice if they somehow included their own ID
      if (memberId !== currentUser._id) {
        await ctx.db.insert('members', {
          conversationId,
          userId: memberId,
        });
      }
    }

    return conversationId;
  },
});

export const deleteGroup = mutation({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser) throw new Error('User not found');

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || !conversation.isGroup) {
      throw new Error('Group not found');
    }

    // Verify current user is a member of the group
    const membership = await ctx.db
      .query('members')
      .withIndex('by_userId_and_conversationId', q =>
        q.eq('userId', currentUser._id).eq('conversationId', args.conversationId),
      )
      .unique();

    if (!membership) {
      throw new Error('Unauthorized');
    }

    // 1. Delete all messages
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_conversationId', q => q.eq('conversationId', args.conversationId))
      .collect();

    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }

    // 2. Delete all memberships
    const activeMembers = await ctx.db
      .query('members')
      .withIndex('by_conversationId', q => q.eq('conversationId', args.conversationId))
      .collect();

    for (const member of activeMembers) {
      await ctx.db.delete(member._id);
    }

    // 3. Delete the conversation itself
    await ctx.db.delete(args.conversationId);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    return await ctx.storage.generateUploadUrl();
  },
});

export const updateGroupAvatar = mutation({
  args: {
    conversationId: v.id('conversations'),
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser) throw new Error('User not found');

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || !conversation.isGroup) {
      throw new Error('Group not found');
    }

    const membership = await ctx.db
      .query('members')
      .withIndex('by_userId_and_conversationId', q =>
        q.eq('userId', currentUser._id).eq('conversationId', args.conversationId),
      )
      .unique();

    if (!membership) {
      throw new Error('Unauthorized');
    }

    const avatarUrl = await ctx.storage.getUrl(args.storageId);
    if (!avatarUrl) throw new Error('Failed to get URL for storage ID');

    await ctx.db.patch(args.conversationId, { avatarUrl });
  },
});
