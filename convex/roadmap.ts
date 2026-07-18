import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/auth";
import {
  LIMITS,
  validateItemDescription,
  validateItemTitle,
  validateLabelTitle,
  validateRefs,
} from "./lib/validation";

const refValidator = v.object({
  title: v.string(),
  link: v.string(),
  badge: v.optional(v.string()),
});

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
    refs: v.array(refValidator),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const title = validateItemTitle(args.title);
    const description = validateItemDescription(args.description);
    const refs = validateRefs(args.refs);

    const items = await ctx.db
      .query("roadmapItems")
      .withIndex("by_order")
      .order("asc")
      .collect();

    return await ctx.db.insert("roadmapItems", {
      title,
      description,
      refs,
      order: items.length,
    });
  },
});

export const updateItem = mutation({
  args: {
    id: v.id("roadmapItems"),
    title: v.string(),
    description: v.string(),
    refs: v.array(refValidator),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Item not found");
    }

    const title = validateItemTitle(args.title);
    const description = validateItemDescription(args.description);
    const refs = validateRefs(args.refs);

    await ctx.db.patch(args.id, {
      title,
      description,
      refs,
    });
  },
});

export const deleteItem = mutation({
  args: { id: v.id("roadmapItems") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const item = await ctx.db.get(args.id);
    if (!item) {
      throw new Error("Item not found");
    }

    const labels = await ctx.db
      .query("roadmapLabels")
      .withIndex("by_item", (q) => q.eq("itemId", args.id))
      .collect();
    for (const label of labels) {
      await ctx.db.delete(label._id);
    }

    await ctx.db.delete(args.id);

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

export const getLabels = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("roadmapLabels").collect();
  },
});

export const createLabel = mutation({
  args: {
    itemId: v.id("roadmapItems"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const item = await ctx.db.get(args.itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    const title = validateLabelTitle(args.title);

    const existing = await ctx.db
      .query("roadmapLabels")
      .withIndex("by_item", (q) => q.eq("itemId", args.itemId))
      .collect();

    if (existing.length >= LIMITS.maxLabelsPerItem) {
      throw new Error(`At most ${LIMITS.maxLabelsPerItem} labels are allowed`);
    }

    return await ctx.db.insert("roadmapLabels", {
      itemId: args.itemId,
      title,
      order: existing.length,
    });
  },
});

export const updateLabel = mutation({
  args: {
    id: v.id("roadmapLabels"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const label = await ctx.db.get(args.id);
    if (!label) {
      throw new Error("Label not found");
    }

    const title = validateLabelTitle(args.title);
    await ctx.db.patch(args.id, { title });
  },
});

export const deleteLabel = mutation({
  args: { id: v.id("roadmapLabels") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const label = await ctx.db.get(args.id);
    if (!label) {
      throw new Error("Label not found");
    }

    await ctx.db.delete(args.id);

    const remaining = await ctx.db
      .query("roadmapLabels")
      .withIndex("by_item", (q) => q.eq("itemId", label.itemId))
      .collect();

    const sorted = remaining.sort((a, b) => a.order - b.order);
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].order !== i) {
        await ctx.db.patch(sorted[i]._id, { order: i });
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
    await requireAdmin(ctx);

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
