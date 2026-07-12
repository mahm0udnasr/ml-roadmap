import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getItems = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("roadmapItems")
      .withIndex("by_order")
      .order("asc")
      .collect();
  },
});

export const createItem = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    refs: v.array(
      v.object({
        title: v.string(),
        link: v.string(),
      }),
    ),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("roadmapItems", {
      title: args.title,
      description: args.description,
      refs: args.refs,
      order: args.order,
    });
  },
});

export const updateItem = mutation({
  args: {
    id: v.id("roadmapItems"),
    title: v.string(),
    description: v.string(),
    refs: v.array(
      v.object({
        title: v.string(),
        link: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
      refs: args.refs,
    });
  },
});

export const deleteItem = mutation({
  args: { id: v.id("roadmapItems") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) {
      throw new Error("Item not found");
    }

    await ctx.db.delete(args.id);

    // Compact order values after deletion
    const remaining = await ctx.db
      .query("roadmapItems")
      .withIndex("by_order")
      .order("asc")
      .collect();

    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].order !== i) {
        await ctx.db.patch(remaining[i]._id, { order: i });
      }
    }
  },
});

export const reorderItem = mutation({
  args: {
    id: v.id("roadmapItems"),
    direction: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("roadmapItems")
      .withIndex("by_order")
      .order("asc")
      .collect();

    const index = items.findIndex((item) => item._id === args.id);
    if (index === -1) {
      throw new Error("Item not found");
    }

    const swapIndex = args.direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) {
      return;
    }

    const current = items[index];
    const neighbor = items[swapIndex];

    await ctx.db.patch(current._id, { order: neighbor.order });
    await ctx.db.patch(neighbor._id, { order: current.order });
  },
});
