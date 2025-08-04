// convex/functions/checkAndDispatchPetEmail.ts
import { mutation } from "../../convex/_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";
import { emailTemplates } from "../emailTemplates"; // adjust path if needed

const GIF_FOLDER = "/assets/gifs";

type TemplateKey = "hungry" | "higherLower" | "rockPaperScissors" | "simonSays";

const subjectTemplates: Record<TemplateKey, string> = {
  hungry: "{{petName}} is hungry! 🍪🐾",
  higherLower: "Play Higher or Lower with {{petName}}! 🎲🐾",
  rockPaperScissors: "{{petName}} just played Rock Paper Scissors! ✂️🪨📄🐾",
  simonSays: "{{petName}} wants to play Simon Says! 🎯🐾",
};

function render(template: string, vars: Record<string, string | number>) {
  return Object.entries(vars).reduce((out, [key, value]) => {
    const re = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    return out.replace(re, String(value));
  }, template);
}

function pickRandomTemplateKey(): TemplateKey {
  const options: TemplateKey[] = ["hungry", "higherLower", "rockPaperScissors", "simonSays"];
  return options[Math.floor(Math.random() * options.length)];
}

export default mutation({
  args: { petId: v.id("pets") },
  handler: async ({ db }, { petId }) => {
    const pet = await db.get(petId);
    if (!pet) throw new Error("Pet not found");

    if (!pet.nextEmailAt) {
      return { dispatched: false, reason: "no nextEmailAt" };
    }
    const now = new Date();
    const scheduled = new Date(pet.nextEmailAt);
    if (scheduled > now) {
      return { dispatched: false, reason: "not due yet", nextEmailAt: pet.nextEmailAt };
    }

    if (!pet.userId) {
      return { dispatched: false, reason: "missing userId on pet" };
    }
    const user = await db.get(pet.userId);
    if (!user) {
      return { dispatched: false, reason: "user not found" };
    }
    if (!user.email) {
      return { dispatched: false, reason: "user email missing" };
    }

    // Pick a template
    const chosenKey: TemplateKey = pickRandomTemplateKey();
    const chosenTemplate = (emailTemplates as any)[chosenKey];

    // Render subject
    const vars: Record<string, string | number> = { petName: pet.name };
    const rawSubject = subjectTemplates[chosenKey];
    const subject = render(rawSubject, vars);

    // Render html with safe defaults
    let html: string;
    switch (chosenKey) {
      case "hungry":
        html = chosenTemplate.html({
          petName: pet.name,
          hungerPercent: Math.round(pet.hunger ?? 0),
          hungerColor: pet.hunger > 50 ? "#4caf50" : "#f44336",
          petGifUrl: `${GIF_FOLDER}/${pet.mood || "happy"}.gif`,
          appLink: "http://localhost:5173/cooking",
        });
        break;
      case "higherLower":
        html = chosenTemplate.html({
          petName: pet.name,
          score: 0,
          highScore: 0,
          triesLeft: 3,
          lastOutcome: "N/A",
          appLink: "http://localhost:5173/higher-lower",
        });
        break;
      case "rockPaperScissors":
        html = chosenTemplate.html({
          petName: pet.name,
          round: 1,
          won: 0,
          lost: 0,
          outcomeSummary: "",
          appLink: "http://localhost:5173/rock-paper-scissors",
        });
        break;
      case "simonSays":
        html = chosenTemplate.html({
          petName: pet.name,
          correctStreak: 0,
          lastSequenceResult: "",
          nextDifficultyHint: "",
          appLink: "http://localhost:5173/simon-says",
        });
        break;
      default:
        html = `<p>Hey! Here's an update about your pet ${pet.name}.</p><a href="http://localhost:5173">Open app</a>`;
    }

    // Send email via Resend (same pattern you know works)
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY missing; cannot send email.");
      return { dispatched: false, reason: "no api key" };
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    let messageId: string | undefined;

    try {
      console.log("Dispatching email to:", user.email, "template:", chosenKey);
      const { data, error } = await resend.emails.send({
        from: "Virtual Pet <yourpet@atomigotchi.atomicobject.com>",
        to: [user.email],
        subject,
        html,
      });

      if (error) {
        console.error("Resend error:", error);
        return {
          dispatched: false,
          reason: "send failed",
          error: error.message || "Unknown resend error",
        };
      }

      messageId = data?.id;
    } catch (e: any) {
      console.error("Exception sending email:", e);
      return {
        dispatched: false,
        reason: "exception",
        error: e instanceof Error ? e.message : String(e),
      };
    }

    // Clear schedule
    await db.patch(petId, {
      lastEmail: pet.nextEmailAt,
      nextEmailAt: undefined,
    });

    return {
      dispatched: true,
      templateUsed: chosenKey,
      messageId,
    };
  },
});
