import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  pets: defineTable({
    userId: v.id("users"),
    name: v.string(),
    species: v.string(), // "cat", "dog", "dragon", etc.
    
    // Pet stats (0-100)
    hunger: v.number(),
    happiness: v.number(),
    energy: v.number(),
    health: v.number(),
    
    // Game state
    age: v.number(), // in hours
    level: v.number(),
    experience: v.number(),
    
    // Timestamps
    lastFed: v.number(),
    lastPlayed: v.number(),
    lastSlept: v.number(),
    lastUpdate: v.number(),
    
    // Status
    isAlive: v.boolean(),
    mood: v.string(), // "happy", "sad", "tired", "sick", "excited"
  }).index("by_user", ["userId"]),
  
  gameActions: defineTable({
    userId: v.id("users"),
    petId: v.id("pets"),
    action: v.string(), // "feed", "play", "sleep", "medicine"
    timestamp: v.number(),
    success: v.boolean(),
    result: v.string(), // description of what happened
  }).index("by_user", ["userId"])
    .index("by_pet", ["petId"]),
    
  emailLogs: defineTable({
    userId: v.id("users"),
    petId: v.id("pets"),
    type: v.string(), // "status_update", "alert", "death", "birth"
    subject: v.string(),
    content: v.string(),
    sentAt: v.number(),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
