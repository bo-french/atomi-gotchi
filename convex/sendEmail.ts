"use node";

import { v } from "convex/values";
import { Resend } from "resend";
import { action } from "./_generated/server";

export const sendEmail = action({
  args: {
    email: v.string(),
    subject: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    messageId: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      const { data, error } = await resend.emails.send({
        from: "Virtual Pet <onboarding@resend.dev>", // Replace with your verified domain
        to: [args.email],
        subject: args.subject || "Hello from your Virtual Pet! 🐾",
        html:
          args.message ||
          `
          <h1>🐾 Your Virtual Pet Says Hello!</h1>
          <p>Welcome to the Virtual Pet Email Game!</p>
          <p>Your virtual pet is excited to meet you and can't wait to start this adventure together.</p>
          <p>Take good care of your pet by feeding, playing, and keeping them happy!</p>
          <br>
          <p>Happy gaming! 🎮</p>
        `,
      });

      if (error) {
        console.error("Resend error:", error);
        return {
          success: false,
          error: error.message || "Failed to send email",
        };
      }

      return {
        success: true,
        messageId: data?.id,
      };
    } catch (error) {
      console.error("Email sending failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});
