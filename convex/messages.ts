import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { paginationOptsValidator } from 'convex/server';
import { Id } from './_generated/dataModel';

export const sendMessage = mutation({
  args: {
    conversationId: v.id('conversations'),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser) throw new Error('User not found');

    const membership = await ctx.db
      .query('members')
      .withIndex('by_userId_and_conversationId', q =>
        q.eq('userId', currentUser._id).eq('conversationId', args.conversationId),
      )
      .unique();

    if (!membership) throw new Error('Not a member of this conversation');

    const messageId = await ctx.db.insert('messages', {
      conversationId: args.conversationId,
      senderId: currentUser._id,
      content: args.content,
      isDeleted: false,
    });

    // Update conversation last message and timestamp
    await ctx.db.patch(args.conversationId, {
      lastMessageId: messageId,
      updatedAt: Date.now(),
    });

    return messageId;
  },
});

export const getMessages = query({
  args: {
    conversationId: v.id('conversations'),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser) throw new Error('User not found');

    const membership = await ctx.db
      .query('members')
      .withIndex('by_userId_and_conversationId', q =>
        q.eq('userId', currentUser._id).eq('conversationId', args.conversationId),
      )
      .unique();

    if (!membership) {
      return { page: [], isDone: true, continueCursor: '' };
    }

    const messages = await ctx.db
      .query('messages')
      .withIndex('by_conversationId', q => q.eq('conversationId', args.conversationId))
      .order('desc')
      .paginate(args.paginationOpts);

    const messagesWithUsers = await Promise.all(
      messages.page.map(async msg => {
        const sender = await ctx.db.get(msg.senderId);

        // Fetch reactions for this message
        const reactions = await ctx.db
          .query('reactions')
          .withIndex('by_messageId', q => q.eq('messageId', msg._id))
          .collect();

        // Group reactions by emoji into an array to avoid invalid Convex field names
        const reactionMap = reactions.reduce(
          (acc, curr) => {
            if (!acc[curr.emoji]) {
              acc[curr.emoji] = { count: 0, userIds: [] };
            }
            acc[curr.emoji].count += 1;
            acc[curr.emoji].userIds.push(curr.userId);
            return acc;
          },
          {} as Record<string, { count: number; userIds: Id<'users'>[] }>,
        );

        const groupedReactions = Object.entries(reactionMap).map(([emoji, data]) => ({
          emoji,
          count: data.count,
          userIds: data.userIds,
        }));

        return {
          ...msg,
          senderName: sender?.name ?? 'Unknown',
          senderAvatar: sender?.avatarUrl,
          reactions: groupedReactions,
        };
      }),
    );

    return {
      ...messages,
      page: messagesWithUsers.reverse(),
    };
  },
});

export const deleteMessage = mutation({
  args: { messageId: v.id('messages') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser) throw new Error('User not found');

    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error('Message not found');

    if (message.senderId !== currentUser._id) {
      throw new Error('Not authorized to delete this message');
    }

    await ctx.db.patch(args.messageId, { isDeleted: true });
  },
});

export const toggleReaction = mutation({
  args: {
    messageId: v.id('messages'),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser) throw new Error('User not found');

    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error('Message not found');

    // Check if user is member of this conversation
    const membership = await ctx.db
      .query('members')
      .withIndex('by_userId_and_conversationId', q =>
        q.eq('userId', currentUser._id).eq('conversationId', message.conversationId),
      )
      .unique();

    if (!membership) throw new Error('Not authorized to react to this message');

    // Check if the exact reaction already exists
    const existingReaction = await ctx.db
      .query('reactions')
      .withIndex('by_messageId_and_userId', q => q.eq('messageId', args.messageId).eq('userId', currentUser._id))
      .filter(q => q.eq(q.field('emoji'), args.emoji))
      .first();

    if (existingReaction) {
      // Toggle off (remove)
      await ctx.db.delete(existingReaction._id);
    } else {
      // Toggle on (add)
      await ctx.db.insert('reactions', {
        messageId: args.messageId,
        userId: currentUser._id,
        emoji: args.emoji,
      });
    }
  },
});
