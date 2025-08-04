import { mutation } from "../_generated/server";
import { v } from "convex/values";

function generateRandomTimesForDay(date: Date, count: number, startHour = 8, endHour = 20) {
const times: Date[] = [];
const start = new Date(date);
start.setUTCHours(startHour, 0, 0, 0);
const end = new Date(date);
end.setUTCHours(endHour, 0, 0, 0);
for (let i = 0; i < count; i++) {
    const rand = Math.random();
    const millis = start.getTime() + Math.floor(rand * (end.getTime() - start.getTime()));
    times.push(new Date(millis));
}
times.sort((a, b) => a.getTime() - b.getTime());
return times.map(d => d.toISOString());
}

export const scheduleDailyEmails = mutation({
args: {
    userId: v.id("users"),
    email: v.string(),
    types: v.array(v.string()),
    countPerType: v.number(),
    payloadPerType: v.optional(v.any()), // optional common payload
},
handler: async (ctx, args) => {
    const today = new Date();
    for (const type of args.types) {
    const times = generateRandomTimesForDay(today, args.countPerType);
    for (const sendAt of times) {
        await ctx.db.insert("emailSchedules", {
        userId: args.userId,
        email: args.email,
        type,
        sendAt,
        payload: args.payloadPerType || {},
        sent: false,
        createdAt: new Date().toISOString(),
        attemptCount: 0,
        });
    }
    }
    return { success: true };
},
});
