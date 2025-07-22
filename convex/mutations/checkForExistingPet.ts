import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const checkForExistingPet = mutation({
  args: {
    email: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const existingPet = await ctx.db
        .query("pets")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();

      return {
        success: existingPet !== null,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error checking for existing pets",
      };
    }
  },
});
