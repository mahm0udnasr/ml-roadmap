import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  roadmapItems: defineTable({
    title: v.string(),
    description: v.string(),
    refs: v.array(
      v.object({
        title: v.string(),
        link: v.string(),
        badge: v.optional(v.string()),
      }),
    ),
    order: v.number(),
  }).index("by_order", ["order"]),

  roadmapLabels: defineTable({
    itemId: v.id("roadmapItems"),
    title: v.string(),
    order: v.number(),
  }).index("by_item", ["itemId", "order"]),

  admins: defineTable({
    tokenIdentifier: v.string(),
    email: v.optional(v.string()),
  }).index("by_token", ["tokenIdentifier"]),
});
