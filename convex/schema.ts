import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    password: v.string(),
  }).index("by_email", ["email"]),

  pets: defineTable({
    userId: v.id("users"),
    name: v.string(),
    health: v.number(),
    hunger: v.number(),
    mood: v.string(),
    lastInteractionAt: v.string(),
    pendingEmailAction: v.optional(v.string()),
    emailSentAt: v.optional(v.string()),
    lastEmail: v.optional(v.string()), 
    nextEmailAt: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  emailSchedules: defineTable({
    userId: v.id("users"),
    email: v.string(),
    type: v.string(),
    sendAt: v.string(),
    payload: v.optional(v.any()),
    sent: v.boolean(),
    createdAt: v.string(),
    attemptCount: v.number(),
    messageId: v.optional(v.string()),
  }).index("by_sendAt", ["sendAt"]),

    emailAccessTokens: defineTable({
    userId: v.id("users"),
    type: v.string(),
    token: v.string(),
    createdAt: v.string(),
    expiresAt: v.string(),
    used: v.boolean(),
  }).index("by_token", ["token"]),

});
