import { v } from "convex/values";
import { internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

// Send status update email
export const sendStatusUpdate = internalAction({
  args: { petId: v.id("pets") },
  handler: async (ctx, args) => {
    const pet = await ctx.runQuery(internal.pets.getPetStatus, { petId: args.petId });
    if (!pet) return;
    
    const user = await ctx.runQuery(internal.authHelpers.getUser, { userId: pet.userId });
    if (!user?.email) return;
    
    // Generate status message
    const statusMessage = generateStatusMessage(pet);
    const subject = `${pet.name} the ${pet.species} - Status Update`;
    
    // Send email (using Convex's built-in Resend proxy)
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.CONVEX_RESEND_API_KEY);
      
      const { data, error } = await resend.emails.send({
        from: "Virtual Pet Game <noreply@virtualpet.example.com>",
        to: user.email,
        subject,
        html: statusMessage,
      });
      
      if (error) {
        console.error("Failed to send email:", error);
        return;
      }
      
      // Log the email
      await ctx.runMutation(internal.petSystem.logEmail, {
        userId: pet.userId,
        petId: args.petId,
        type: "status_update",
        subject,
        content: statusMessage,
      });
      
      // Schedule next update if pet is alive
      if (pet.isAlive) {
        const nextUpdateDelay = getNextUpdateDelay(pet);
        await ctx.scheduler.runAfter(
          nextUpdateDelay,
          internal.petSystem.sendStatusUpdate,
          { petId: args.petId }
        );
      }
      
    } catch (error) {
      console.error("Error sending status email:", error);
    }
  },
});

// Process email command
export const processEmailCommand = internalAction({
  args: {
    userEmail: v.string(),
    command: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.runQuery(internal.auth.getUserByEmail, { email: args.userEmail });
    if (!user) return;
    
    // Find user's pet
    const pet = await ctx.runQuery(internal.pets.getCurrentPet, {});
    if (!pet) {
      // Send email about no pet
      await sendNoPetEmail(ctx, user.email);
      return;
    }
    
    // Process the command
    const result = await ctx.runMutation(internal.pets.performPetAction, {
      petId: pet._id,
      action: args.command.trim(),
      userId: user._id,
    });
    
    // Send response email
    await sendCommandResponseEmail(ctx, user.email, pet, args.command, result);
  },
});

// Log email
export const logEmail = internalMutation({
  args: {
    userId: v.id("users"),
    petId: v.id("pets"),
    type: v.string(),
    subject: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("emailLogs", {
      userId: args.userId,
      petId: args.petId,
      type: args.type,
      subject: args.subject,
      content: args.content,
      sentAt: Date.now(),
    });
  },
});

// Helper functions
function generateStatusMessage(pet: any): string {
  const moodEmoji = {
    happy: "😊",
    sad: "😢",
    tired: "😴",
    sick: "🤒",
    excited: "🤩",
    hungry: "😋",
    dead: "💀"
  };
  
  const statusBars = {
    hunger: getStatusBar(pet.hunger, "🍖"),
    happiness: getStatusBar(pet.happiness, "😊"),
    energy: getStatusBar(pet.energy, "⚡"),
    health: getStatusBar(pet.health, "❤️")
  };
  
  let message = `
    <h2>${moodEmoji[pet.mood as keyof typeof moodEmoji]} ${pet.name} the ${pet.species}</h2>
    <p><strong>Age:</strong> ${Math.floor(pet.age)} hours old</p>
    <p><strong>Level:</strong> ${pet.level} (${pet.experience} XP)</p>
    <p><strong>Mood:</strong> ${pet.mood}</p>
    
    <h3>Stats:</h3>
    <p>🍖 Hunger: ${statusBars.hunger} (${Math.round(pet.hunger)}%)</p>
    <p>😊 Happiness: ${statusBars.happiness} (${Math.round(pet.happiness)}%)</p>
    <p>⚡ Energy: ${statusBars.energy} (${Math.round(pet.energy)}%)</p>
    <p>❤️ Health: ${statusBars.health} (${Math.round(pet.health)}%)</p>
    
    <h3>What ${pet.name} needs:</h3>
  `;
  
  const needs = [];
  if (pet.hunger < 40) needs.push("🍖 Food (reply with 'feed')");
  if (pet.happiness < 40) needs.push("🎾 Playtime (reply with 'play')");
  if (pet.energy < 30) needs.push("😴 Sleep (reply with 'sleep')");
  if (pet.health < 60) needs.push("💊 Medicine (reply with 'medicine')");
  
  if (needs.length === 0) {
    message += "<p>✨ Everything looks great! Your pet is doing well.</p>";
  } else {
    message += "<ul>";
    needs.forEach(need => {
      message += `<li>${need}</li>`;
    });
    message += "</ul>";
  }
  
  message += `
    <hr>
    <p><small>Reply to this email with commands: <strong>feed</strong>, <strong>play</strong>, <strong>sleep</strong>, or <strong>medicine</strong></small></p>
  `;
  
  return message;
}

function getStatusBar(value: number, emoji: string): string {
  const bars = Math.round(value / 10);
  const filled = emoji.repeat(bars);
  const empty = "⬜".repeat(10 - bars);
  return filled + empty;
}

function getNextUpdateDelay(pet: any): number {
  // Base delay of 2 hours
  let delay = 2 * 60 * 60 * 1000;
  
  // Send updates more frequently if pet needs attention
  if (pet.hunger < 30 || pet.happiness < 30 || pet.energy < 20 || pet.health < 50) {
    delay = 30 * 60 * 1000; // 30 minutes
  } else if (pet.hunger < 50 || pet.happiness < 50) {
    delay = 60 * 60 * 1000; // 1 hour
  }
  
  return delay;
}

async function sendNoPetEmail(ctx: any, email: string) {
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.CONVEX_RESEND_API_KEY);
    
    await resend.emails.send({
      from: "Virtual Pet Game <noreply@virtualpet.example.com>",
      to: email,
      subject: "No Virtual Pet Found",
      html: `
        <h2>🐾 No Virtual Pet Found</h2>
        <p>You don't currently have a virtual pet. Visit the game website to create one!</p>
        <p>Once you have a pet, you'll receive regular status updates and can reply with commands.</p>
      `,
    });
  } catch (error) {
    console.error("Error sending no pet email:", error);
  }
}

async function sendCommandResponseEmail(ctx: any, email: string, pet: any, command: string, result: any) {
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.CONVEX_RESEND_API_KEY);
    
    const subject = `${pet.name} - Command Response: ${command}`;
    const html = `
      <h2>🐾 ${pet.name} the ${pet.species}</h2>
      <p><strong>Your command:</strong> ${command}</p>
      <p><strong>Result:</strong> ${result.result}</p>
      
      ${result.success ? 
        "<p>✅ Command successful!</p>" : 
        "<p>❌ Command failed or not needed right now.</p>"
      }
      
      <hr>
      <p><small>You'll receive another status update soon. Keep taking good care of ${pet.name}!</small></p>
    `;
    
    await resend.emails.send({
      from: "Virtual Pet Game <noreply@virtualpet.example.com>",
      to: email,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending command response email:", error);
  }
}
