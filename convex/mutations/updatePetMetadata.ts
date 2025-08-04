import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const updatePetEmailMetadata = mutation({
args: {
    petId: v.id("pets"),
    lastEmail: v.string(),
    pendingEmailAction: v.optional(v.string()),
},
handler: async (ctx, { petId, lastEmail, pendingEmailAction }) => {
    const patch: any = { lastEmail };
    if (pendingEmailAction !== undefined) {
    patch.pendingEmailAction = pendingEmailAction;
    }
    await ctx.db.patch(petId, patch);
    return { success: true };
},
});
