export enum PetMood {
  HAPPY,
  NEUTRAL,
  SAD,
  EXCITED,
  SLEEPING,
  DEAD,
}

/**
 * Each frame takes up 100ms, and most of the animations take up 6 frames. So the animation time should be 600ms. The only exceptions are the "sleeping" animation which is 18 frames and the "dead" art which is 1 frame.
 */
export const ANIMATION_TIME = 600;

interface Props {
  mood: PetMood;
}

export const Pet = (props: Props) => {
  const cropTop = props.mood !== PetMood.SLEEPING;

  return (
    <img
      src={getPetAnimation(props.mood)}
      alt="atomi-gotchi"
      style={{
        width: cropTop ? 150 : "100%",
        height: cropTop ? 120 : "100%",
        objectFit: "cover",
        objectPosition: "bottom",
      }}
    />
  );
};

export const getPetAnimation = (mood: PetMood) => {
  const filePath = "/gifs/";
  let fileName = "";

  switch (mood) {
    case PetMood.HAPPY:
      fileName = "happy.gif";
      break;
    case PetMood.NEUTRAL:
      fileName = "neutral.gif";
      break;
    case PetMood.SAD:
      fileName = "sad.gif";
      break;
    case PetMood.EXCITED:
      fileName = "excited.gif";
      break;
    case PetMood.SLEEPING:
      fileName = "sleeping.gif";
      break;
    case PetMood.DEAD:
      fileName = "dead.png";
      break;
    default:
      fileName = "happy.gif";
  }

  return filePath + fileName;
};
