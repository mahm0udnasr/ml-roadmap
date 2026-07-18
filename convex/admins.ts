import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const grantAdmin = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("admins")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier),
      )
      .unique();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("admins", {
      tokenIdentifier: args.tokenIdentifier,
      email: args.email,
    });
  },
});

export const revokeAdmin = internalMutation({
  args: {
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier),
      )
      .unique();

    if (admin) {
      await ctx.db.delete(admin._id);
    }
  },
});
