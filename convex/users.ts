import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const syncUser = mutation({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Called syncUser without authentication present');
    }

    // Clerk's id is stored in the subject field
    const clerkId = identity.subject;

    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', q => q.eq('clerkId', clerkId))
      .unique();

    const name = identity.name || identity.nickname || `user_${clerkId.slice(-5)}`;
    const defaultUsername = identity.nickname || name.toLowerCase().replace(/\s+/g, '') || `user_${clerkId.slice(-5)}`;

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        // We purposefully DO NOT overwrite username here so custom usernames stick
        name,
        email: identity.email ?? '',
        avatarUrl: identity.pictureUrl,
      });
      return existingUser._id;
    }

    return await ctx.db.insert('users', {
      clerkId,
      username: defaultUsername,
      name,
      email: identity.email ?? '',
      avatarUrl: identity.pictureUrl,
    });
  },
});

export const updateUsername = mutation({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    // Strip whitespace and lower
    const sanitizedUsername = args.username.toLowerCase().trim();

    if (sanitizedUsername.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }

    // Additional check: ensure username isn't already taken by someone else
    const existingUsername = await ctx.db
      .query('users')
      .withIndex('by_username', q => q.eq('username', sanitizedUsername))
      .unique();

    if (existingUsername && existingUsername._id !== user._id) {
      throw new Error('Username is already taken');
    }

    await ctx.db.patch(user._id, { username: sanitizedUsername });
    return sanitizedUsername;
  },
});

export const getUsers = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }

    // Get all users
    const users = await ctx.db.query('users').collect();

    // Filter out the current user
    return users.filter(user => user.clerkId !== identity.subject);
  },
});
