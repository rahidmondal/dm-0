import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { paginationOptsValidator } from 'convex/server';

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
      throw new Error('Not a member of this conversation');
    }

    const messages = await ctx.db
      .query('messages')
      .withIndex('by_conversationId', q => q.eq('conversationId', args.conversationId))
      .order('desc')
      .paginate(args.paginationOpts);

    const messagesWithUsers = await Promise.all(
      messages.page.map(async msg => {
        const sender = await ctx.db.get(msg.senderId);
        return {
          ...msg,
          senderName: sender?.name ?? 'Unknown',
          senderAvatar: sender?.avatarUrl,
        };
      }),
    );

    return {
      ...messages,
      page: messagesWithUsers.reverse(),
    };
  },
});
