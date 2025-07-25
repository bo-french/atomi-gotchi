import { useAction, useMutation } from "convex/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PetMood } from "@/types/pet";
import { BackToHome } from "@/components/BackToHome";
import { Pet } from "@/components/Pet";

export const RockPaperScissors = () => {
return(
    <div>
      <h1>Rock Paper Scissors</h1>
      <Pet mood={PetMood.HAPPY} />
      <BackToHome />
    </div>
  );

}
