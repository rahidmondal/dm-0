import { mutation, query } from './_generated/server';

export const syncUser = mutation({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const clerkId = identity.subject;

    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', q => q.eq('clerkId', clerkId))
      .unique();

    const username = identity.nickname || `user_${clerkId.slice(-5)}`;
    const name = identity.name || username;

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
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

    const users = await ctx.db.query('users').paginate({ numItems: 50, cursor: null });

    return {
      ...users,
      page: users.page.filter(user => user.clerkId !== identity.subject),
    };
  },
});
