import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const checkForExistingPet = mutation({
  args: {
    email: v.string(),
  },
  returns: v.object({
    pet: v.optional(
      v.object({
        id: v.id("pets"),
        name: v.string(),
      })
    ),
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      // First find the user by email
      const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();

      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      // Then check if the user has any pets
      const existingPet = await ctx.db
        .query("pets")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .first();

      return {
        pet: existingPet
          ? {
              id: existingPet._id,
              name: existingPet.name,
            }
          : undefined,
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
