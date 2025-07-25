import { getPetAnimation, PetMood } from "@/types/pet";

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
