import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

// Webhook to handle incoming emails (for email reply processing)
http.route({
  path: "/webhook/email",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      
      // Extract email and command from webhook payload
      // This would depend on your email service provider's webhook format
      const userEmail = body.from?.email || body.sender?.email;
      const emailBody = body.text || body.plain || "";
      
      if (!userEmail || !emailBody) {
        return new Response("Invalid email data", { status: 400 });
      }
      
      // Extract command from email body (first word)
      const command = emailBody.trim().split(/\s+/)[0].toLowerCase();
      
      // Process the command
      await ctx.runAction(internal.petSystem.processEmailCommand, {
        userEmail,
        command,
      });
      
      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error("Email webhook error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }),
});

export default http;
