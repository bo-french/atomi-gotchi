import { Panel } from "@/components/Panel";
import { PetCreationForm } from "@/components/PetCreationForm";
import { PetInfoCard } from "@/components/PetInfoCard";
import { Button, Stack } from "@mui/material";
import { useAction, useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export const HomePage = () => {
  const [user, setUser] = useState<any>(null);
  const [pet, setPet] = useState<{ id: Id<"pets">; name: string } | undefined>(
    undefined
  );

  const sendEmailAction = useAction(api.sendEmail.sendEmail);
  const navigate = useNavigate();

  const checkForExistingPetMutation = useMutation(
    api.mutations.checkForExistingPet.checkForExistingPet
  );

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  useEffect(() => {
    const checkForExistingPet = async () => {
      if (!user?.email) return;

      const result = await checkForExistingPetMutation({
        email: user.email,
      });

      setPet(result?.pet);
    };

    void checkForExistingPet();
  }, [user, checkForExistingPetMutation]);

  const handleSendEmail = async () => {
    if (!user?.email) {
      return;
    }

    try {
      await sendEmailAction({ email: user?.email });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    void navigate("/login");
  };

  return (
    <Panel>
      {pet ? (
        <Stack gap={1}>
          <PetInfoCard
            petInfo={{
              name: pet.name,
              mood: "Sparky seems happy!",
              health: 9,
              hunger: 6,
            }}
          />
          <Button variant="outlined" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Stack>
      ) : (
        <PetCreationForm />
      )}
    </Panel>
  );
};
