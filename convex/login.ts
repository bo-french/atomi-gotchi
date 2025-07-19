import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  returns: v.union(
    v.object({
      success: v.boolean(),
      userId: v.optional(v.id("users")),
      error: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    try {
      // Find user by email
      const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();

      if (!user) {
        return {
          success: false,
          error: "No account found with this email",
        };
      }

      // Check password (in a real app, you'd hash/compare properly)
      if (user.password !== args.password) {
        return {
          success: false,
          error: "Invalid password",
        };
      }

      return {
        success: true,
        userId: user._id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  },
});
