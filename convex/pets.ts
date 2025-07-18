import { v } from "convex/values";
import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

// Pet species with different characteristics
const PET_SPECIES = {
  cat: { name: "Cat", hungerRate: 1.2, happinessRate: 1.0, energyRate: 0.8 },
  dog: { name: "Dog", hungerRate: 1.5, happinessRate: 0.8, energyRate: 1.2 },
  dragon: { name: "Dragon", hungerRate: 2.0, happinessRate: 1.5, energyRate: 1.0 },
  rabbit: { name: "Rabbit", hungerRate: 1.8, happinessRate: 1.2, energyRate: 0.9 },
};

// Get user's current pet
export const getCurrentPet = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    
    const pet = await ctx.db
      .query("pets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isAlive"), true))
      .first();
    
    return pet;
  },
});

// Create a new pet
export const createPet = mutation({
  args: {
    name: v.string(),
    species: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");
    
    // Check if user already has a living pet
    const existingPet = await ctx.db
      .query("pets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isAlive"), true))
      .first();
    
    if (existingPet) {
      throw new Error("You already have a living pet!");
    }
    
    if (!PET_SPECIES[args.species as keyof typeof PET_SPECIES]) {
      throw new Error("Invalid species");
    }
    
    const now = Date.now();
    const petId = await ctx.db.insert("pets", {
      userId,
      name: args.name,
      species: args.species,
      hunger: 50,
      happiness: 80,
      energy: 70,
      health: 100,
      age: 0,
      level: 1,
      experience: 0,
      lastFed: now,
      lastPlayed: now,
      lastSlept: now,
      lastUpdate: now,
      isAlive: true,
      mood: "happy",
    });
    
    // Schedule first status email
    await ctx.scheduler.runAfter(
      5 * 60 * 1000, // 5 minutes
      internal.petSystem.sendStatusUpdate,
      { petId }
    );
    
    return petId;
  },
});

// Get pet's recent actions
export const getPetActions = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    return await ctx.db
      .query("gameActions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(args.limit ?? 10);
  },
});

// Internal function to update pet stats based on time
export const updatePetStats = internalMutation({
  args: { petId: v.id("pets") },
  handler: async (ctx, args) => {
    const pet = await ctx.db.get(args.petId);
    if (!pet || !pet.isAlive) return;
    
    const now = Date.now();
    const timeDiff = (now - pet.lastUpdate) / (1000 * 60 * 60); // hours
    
    if (timeDiff < 0.1) return; // Don't update if less than 6 minutes
    
    const species = PET_SPECIES[pet.species as keyof typeof PET_SPECIES];
    
    // Calculate stat decay
    const hungerDecay = timeDiff * species.hungerRate * 2;
    const happinessDecay = timeDiff * species.happinessRate * 1.5;
    const energyDecay = timeDiff * species.energyRate * 1;
    
    // Update stats
    let newHunger = Math.max(0, pet.hunger - hungerDecay);
    let newHappiness = Math.max(0, pet.happiness - happinessDecay);
    let newEnergy = Math.max(0, pet.energy - energyDecay);
    let newHealth = pet.health;
    
    // Health decreases if other stats are low
    if (newHunger < 20 || newHappiness < 20 || newEnergy < 10) {
      newHealth = Math.max(0, newHealth - timeDiff * 3);
    }
    
    // Determine mood
    let mood = "happy";
    if (newHealth < 30) mood = "sick";
    else if (newHunger < 30) mood = "hungry";
    else if (newEnergy < 20) mood = "tired";
    else if (newHappiness < 30) mood = "sad";
    else if (newHappiness > 80 && newEnergy > 70) mood = "excited";
    
    // Check if pet dies
    let isAlive = pet.isAlive;
    if (newHealth <= 0) {
      isAlive = false;
      mood = "dead";
    }
    
    // Age the pet
    const newAge = pet.age + timeDiff;
    
    await ctx.db.patch(args.petId, {
      hunger: newHunger,
      happiness: newHappiness,
      energy: newEnergy,
      health: newHealth,
      age: newAge,
      mood,
      isAlive,
      lastUpdate: now,
    });
    
    return { isAlive, mood, health: newHealth };
  },
});

// Internal function to perform pet action
export const performPetAction = internalMutation({
  args: {
    petId: v.id("pets"),
    action: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const pet = await ctx.db.get(args.petId);
    if (!pet || !pet.isAlive) {
      return { success: false, result: "Pet is not available or has passed away." };
    }
    
    // Update stats first
    await ctx.runMutation(internal.pets.updatePetStats, { petId: args.petId });
    
    // Get updated pet
    const updatedPet = await ctx.db.get(args.petId);
    if (!updatedPet || !updatedPet.isAlive) {
      return { success: false, result: "Pet has passed away." };
    }
    
    const now = Date.now();
    let result = "";
    let success = false;
    let statChanges: Partial<typeof updatedPet> = {};
    
    switch (args.action.toLowerCase()) {
      case "feed":
        if (updatedPet.hunger > 80) {
          result = `${updatedPet.name} is already full and doesn't want to eat right now.`;
        } else {
          const hungerIncrease = Math.min(40, 100 - updatedPet.hunger);
          statChanges = {
            hunger: updatedPet.hunger + hungerIncrease,
            health: Math.min(100, updatedPet.health + 5),
            lastFed: now,
          };
          result = `You fed ${updatedPet.name}! They seem satisfied and their health improved slightly.`;
          success = true;
        }
        break;
        
      case "play":
        if (updatedPet.energy < 20) {
          result = `${updatedPet.name} is too tired to play right now. Maybe let them sleep first?`;
        } else {
          const happinessIncrease = Math.min(30, 100 - updatedPet.happiness);
          const energyDecrease = Math.min(25, updatedPet.energy);
          statChanges = {
            happiness: updatedPet.happiness + happinessIncrease,
            energy: updatedPet.energy - energyDecrease,
            experience: updatedPet.experience + 10,
            lastPlayed: now,
          };
          result = `You played with ${updatedPet.name}! They had a great time and gained some experience.`;
          success = true;
        }
        break;
        
      case "sleep":
        if (updatedPet.energy > 80) {
          result = `${updatedPet.name} is not tired and doesn't want to sleep right now.`;
        } else {
          const energyIncrease = Math.min(50, 100 - updatedPet.energy);
          statChanges = {
            energy: updatedPet.energy + energyIncrease,
            health: Math.min(100, updatedPet.health + 3),
            lastSlept: now,
          };
          result = `${updatedPet.name} took a nice nap and feels refreshed!`;
          success = true;
        }
        break;
        
      case "medicine":
        if (updatedPet.health > 80) {
          result = `${updatedPet.name} is healthy and doesn't need medicine right now.`;
        } else {
          const healthIncrease = Math.min(30, 100 - updatedPet.health);
          statChanges = {
            health: updatedPet.health + healthIncrease,
          };
          result = `You gave ${updatedPet.name} some medicine. They're feeling much better!`;
          success = true;
        }
        break;
        
      default:
        result = `Unknown command. Try: feed, play, sleep, or medicine.`;
    }
    
    // Apply stat changes
    if (success && Object.keys(statChanges).length > 0) {
      await ctx.db.patch(args.petId, statChanges);
    }
    
    // Log the action
    await ctx.db.insert("gameActions", {
      userId: args.userId,
      petId: args.petId,
      action: args.action,
      timestamp: now,
      success,
      result,
    });
    
    return { success, result };
  },
});

// Get pet status for email
export const getPetStatus = internalQuery({
  args: { petId: v.id("pets") },
  handler: async (ctx, args) => {
    const pet = await ctx.db.get(args.petId);
    if (!pet) return null;
    
    // Update stats first
    await ctx.runMutation(internal.pets.updatePetStats, { petId: args.petId });
    
    // Get updated pet
    const updatedPet = await ctx.db.get(args.petId);
    return updatedPet;
  },
});
