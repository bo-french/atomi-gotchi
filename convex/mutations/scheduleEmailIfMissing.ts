import { mutation } from "../../convex/_generated/server";
import { v } from "convex/values";

export default mutation({
args: { petId: v.id("pets") },
handler: async ({ db }, { petId }) => {
    const pet = await db.get(petId);
    if (!pet) throw new Error("Pet not found");

    const now = new Date();
    console.log("scheduleEmailIfMissing: current pet.nextEmailAt:", pet.nextEmailAt);

    if (pet.nextEmailAt) {
    const scheduledDate = new Date(pet.nextEmailAt);
    if (scheduledDate > now) {
        return {
        scheduled: false,
        reason: "already has future schedule",
        nextEmailAt: pet.nextEmailAt,
        };
    }
    }

    // 2–4 hour delay with jitter
    const minHours = 2;
    const maxHours = 4;
    const delayMs =
    minHours * 60 * 60 * 1000 +
    Math.random() * ((maxHours - minHours) * 60 * 60 * 1000);
    const nextEmailAt = new Date(now.getTime() + delayMs).toISOString();

    await db.patch(petId, { nextEmailAt });

    console.log("scheduleEmailIfMissing: new nextEmailAt set to", nextEmailAt);

    return { scheduled: true, nextEmailAt };
},
});
