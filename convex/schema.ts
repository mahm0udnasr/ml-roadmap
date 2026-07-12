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
      }),
    ),
    order: v.number(),
  }).index("by_order", ["order"]),
});
