export type PetInfo = {
  name: string;
  health: number;
  hunger: number;
  mood: PetMood;
};

export enum PetMood {
  HAPPY = "happy.gif",
  NEUTRAL = "neutral.gif",
  SAD = "sad.gif",
  EXCITED = "excited.gif",
  SLEEPING = "sleeping.gif",
  DEAD = "dead.png",
}

export const mapPetMood = (mood: string) => {
  switch (mood) {
    case "happy":
      return PetMood.HAPPY;
    case "neutral":
      return PetMood.NEUTRAL;
    case "sad":
      return PetMood.SAD;
    case "excited":
      return PetMood.EXCITED;
    case "sleeping":
      return PetMood.SLEEPING;
    case "dead":
      return PetMood.DEAD;
    default:
      return PetMood.HAPPY;
  }
};

/**
 * Each frame takes up 100ms, and most of the animations take up 6 frames. So the animation time should be 600ms. The only exceptions are the "sleeping" animation which is 18 frames and the "dead" art which is 1 frame.
 */
export const ANIMATION_TIME = 600;

export const getPetAnimation = (mood: PetMood) => {
  return "/gifs/" + mood;
};
