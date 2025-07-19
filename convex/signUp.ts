import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const signUp = mutation({
  args: {
    email: v.string(),
    password: v.string(), // already hashed
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("User already exists");
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      password: args.password,
    });

    return { userId };
  },
});
