import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Heartbeat mutation: Called by the client every 10-15 seconds
export const heartbeat = mutation({
  args: { connectionId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return; // Ignore if unauthenticated

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return;

    // Check if the presence record for this connection exists
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

// Helper query to check if a specific user is online
export const isUserOnline = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    // A user is "online" if they have pinged within the last 30 seconds
    const threshold = Date.now() - 30000;

    const activePresence = await ctx.db
      .query('presence')
      .withIndex('by_userId', q => q.eq('userId', args.userId))
      .filter(q => q.gte(q.field('updatedAt'), threshold))
      .first();

    return !!activePresence;
  },
});
