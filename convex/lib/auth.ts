import type { MutationCtx, QueryCtx } from "../_generated/server";

type ServerCtx = QueryCtx | MutationCtx;

function getAllowlistedEmails(): string[] {
  return (
    process.env.ADMIN_EMAILS?.split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean) ?? []
  );
}

export async function isAdmin(ctx: ServerCtx): Promise<boolean> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return false;
  }

  const adminRecord = await ctx.db
    .query("admins")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier),
    )
    .unique();
  if (adminRecord) {
    return true;
  }

  const email = identity.email?.trim().toLowerCase();
  if (!email) {
    return false;
  }

  return getAllowlistedEmails().includes(email);
}

export async function getViewerAuth(ctx: ServerCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return { isAuthenticated: false, isAdmin: false };
  }

  return {
    isAuthenticated: true,
    isAdmin: await isAdmin(ctx),
  };
}

export async function requireAdmin(ctx: ServerCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  if (!(await isAdmin(ctx))) {
    throw new Error("Unauthorized");
  }

  return identity;
}
