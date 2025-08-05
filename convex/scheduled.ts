import { sendEmail } from "./sendEmail";


// Internal function to send an email (replace with logic to get logged-in user)

async function sendEmailToUser(ctx: any) {
  // Query all users from the "users" table and send each an email
  console.log("Scheduled email job running...");
  try{
  const users = await ctx.db.query("users").collect();
  for (const user of users) {
    if (user.email) {
      await ctx.runAction(sendEmail, {
        email: user.email,
        subject: "Scheduled Email",
        message: "FEED YO PET",
        emailEnabled: true,
      });
    }
    }
  }catch (error){
      console.error("Error sending email to user:", error);
    }
}

// Export Convex scheduled intervals
export const intervals = {
  sendScheduledEmails: {
    interval: { minutes: 1 },
    handler: sendEmailToUser,
  },
};