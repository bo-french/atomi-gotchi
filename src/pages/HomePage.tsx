import { PanelCard } from "@/components/PanelCard";
import { PetCreationForm } from "@/components/PetCreationForm";
import { PetInfoCard } from "@/components/PetInfoCard";
import { PetInfo } from "@/types/petInfo";
import { Button, Stack } from "@mui/material";
import { useAction, useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";

export const HomePage = () => {
  const [user, setUser] = useState<any>(null);
  const [pet, setPet] = useState<PetInfo | undefined>(undefined);
  const [isLoadingPet, setIsLoadingPet] = useState(false);

  const sendEmailAction = useAction(api.sendEmail.sendEmail);
  const navigate = useNavigate();

  const getPetMutation = useMutation(api.mutations.getPet.getPet);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  useEffect(() => {
    const getPet = async () => {
      if (!user?.email) return;

      setIsLoadingPet(true);
      const result = await getPetMutation({
        email: user.email,
      });

      setPet(result?.pet);
      setIsLoadingPet(false);
    };

    void getPet();
  }, [user, getPetMutation]);

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

  const handleSettings = () => {};

  return (
    <PanelCard>
      {isLoadingPet ? (
        <></>
      ) : pet ? (
        <Stack gap={2}>
          <PetInfoCard
            petInfo={{
              name: pet.name,
              health: pet.health,
              hunger: pet.hunger,
            }}
          />
          <Stack direction="row" gap={1}>
            <Button variant="contained" onClick={handleSettings}>
              Settings
            </Button>
            <Button variant="outlined" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Stack>
        </Stack>
      ) : (
        <PetCreationForm />
      )}
    </PanelCard>
  );
};
