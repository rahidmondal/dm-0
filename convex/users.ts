import { mutation, query } from './_generated/server';

export const syncUser = mutation({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // Clerk's id is stored in the subject field
    const clerkId = identity.subject;

    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', q => q.eq('clerkId', clerkId))
      .unique();

    const username = identity.nickname || `user_${clerkId.slice(-5)}`;
    const name = identity.name || username;

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        // Always sync username from Clerk — Clerk is the single source of truth
        username,
        name,
        email: identity.email ?? '',
        avatarUrl: identity.pictureUrl,
      });
      return existingUser._id;
    }

    return await ctx.db.insert('users', {
      clerkId,
      username,
      name,
      email: identity.email ?? '',
      avatarUrl: identity.pictureUrl,
    });
  },
});

export const getUsers = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }

    // Pagination instead of collect to avoid N+1 and memory issues at scale
    // This requires updating the frontend to handle pagination instead of a simple array
    const users = await ctx.db.query('users').paginate({ numItems: 50, cursor: null });

    // Filter out the current user
    return {
      ...users,
      page: users.page.filter(user => user.clerkId !== identity.subject),
    };
  },
});
