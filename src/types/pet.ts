export enum PetMood {
  HAPPY = "happy.gif",
  NEUTRAL = "neutral.gif",
  SAD = "sad.gif",
  EXCITED = "excited.gif",
  SLEEPING = "sleeping.gif",
  DEAD = "dead.png",
}

/**
 * Each frame takes up 100ms, and most of the animations take up 6 frames. So the animation time should be 600ms. The only exceptions are the "sleeping" animation which is 18 frames and the "dead" art which is 1 frame.
 */
export const ANIMATION_TIME = 600;

export const getPetAnimation = (mood: PetMood) => {
  return "/gifs/" + mood;
};
