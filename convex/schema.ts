import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    password: v.string(),
  }).index("by_email", ["email"]),
  
  pets: defineTable({
    email: v.string(),
  }).index("by_email", ["email"]),
});
