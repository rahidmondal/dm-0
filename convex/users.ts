import { mutation } from './_generated/server';

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
    const username = identity.nickname || name.toLowerCase().replace(/\s+/g, '') || `user_${clerkId.slice(-5)}`;

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
