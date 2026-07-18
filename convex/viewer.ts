import { query } from "./_generated/server";
import { v } from "convex/values";
import { getViewerAuth } from "./lib/auth";

export const getViewer = query({
  args: {},
  returns: v.object({
    isAuthenticated: v.boolean(),
    isAdmin: v.boolean(),
  }),
  handler: async (ctx) => {
    return await getViewerAuth(ctx);
  },
});
