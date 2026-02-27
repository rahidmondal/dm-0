import { v } from 'convex/values';
import { internalMutation, mutation, query } from './_generated/server';

export const heartbeat = mutation({
  args: { connectionId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return;

    const existing = await ctx.db
      .query('presence')
      .withIndex('by_userId_connectionId', q => q.eq('userId', user._id).eq('connectionId', args.connectionId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { updatedAt: Date.now() });
    } else {
      await ctx.db.insert('presence', {
        userId: user._id,
        connectionId: args.connectionId,
        updatedAt: Date.now(),
      });
    }
  },
});

export const removePresence = mutation({
  args: { connectionId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return;

    const existing = await ctx.db
      .query('presence')
      .withIndex('by_userId_connectionId', q => q.eq('userId', user._id).eq('connectionId', args.connectionId))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const isUserOnline = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const threshold = Date.now() - 30000;

    const activePresence = await ctx.db
      .query('presence')
      .withIndex('by_userId', q => q.eq('userId', args.userId))
      .filter(q => q.gte(q.field('updatedAt'), threshold))
      .first();

    return !!activePresence;
  },
});

export const clearStalePresence = internalMutation({
  args: {},
  handler: async ctx => {
    const threshold = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const staleRecords = await ctx.db
      .query('presence')
      .filter(q => q.lt(q.field('updatedAt'), threshold))
      .collect();

    for (const record of staleRecords) {
      await ctx.db.delete(record._id);
    }
  },
});
