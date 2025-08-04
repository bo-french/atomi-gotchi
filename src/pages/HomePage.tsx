import { PanelCard } from "@/components/PanelCard";
import { PetCreationForm } from "@/components/PetCreationForm";
import { PetInfoCard } from "@/components/PetInfoCard";
import { RequestMessage } from "@/types/login";
import { mapPetMood, PetInfo } from "@/types/pet";
import { Button, CircularProgress, Stack } from "@mui/material";
import { useMutation } from "convex/react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";

const deriveMoodFromHealth = (health: number) => {
  if (health < 33) return "sad";
  if (health < 66) return "neutral";
  return "happy";
};

export const HomePage = () => {  
  const [user, setUser] = useState<any>(null);
  const [pet, setPet] = useState<PetInfo | undefined>(undefined);
  const [isLoadingPet, setIsLoadingPet] = useState(false);
  const [message, setMessage] = useState<RequestMessage | undefined>(undefined);

  const navigate = useNavigate();
  const getPetMutation = useMutation(api.mutations.getPet.getPet);
  // const getPetMutation = useMutation(api.mutations.getPet.getPet);

  
  const checkAndDispatchEmail = useMutation(api.mutations.checkAndDispatchPetEmail.default);
    console.log("checkAndDispatchPetEmail: full pet object:", pet);



  const loadPet = useCallback(async () => {
    console.log("Loading pet information... (HomePage)");
    if (!user?.email) return;

    setIsLoadingPet(true);
    const result = await getPetMutation({ email: user.email });
    console.log("getPet response on HomePage:", result);

    if (!result?.pet) {
      setIsLoadingPet(false);
      return;
    }

    if (result.pet.health === 0) {
      setPet(undefined);
      setMessage({
        type: "info",
        text: "Your pet has died. Create a new one to continue.",
      });
      localStorage.removeItem("currentPet");
      setIsLoadingPet(false);
      return;
    }

    // Derive mood from health and map it
    const derivedMood = deriveMoodFromHealth(result.pet.health);
    const petWithMood: PetInfo = {
      ...result.pet,
      mood: mapPetMood(derivedMood),
    };

    setPet(petWithMood);
    localStorage.setItem("currentPet", JSON.stringify(petWithMood));
    

    // Lazy dispatch email if it's due
    // try {
    //   const dispatchResult = await api.mutations.checkAndDispatchPetEmail.mutate({
    //     petId: result.pet._id,
    //   });
    //   console.log("checkAndDispatchPetEmail result:", dispatchResult);
    // } catch (e) {
    //   console.warn("Email dispatch check failed:", e);
    // }
    try {
      console.log("About to call checkAndDispatchPetEmail for pet:", result.pet.id, {
        nextEmailAt: result.pet.nextEmailAt,
      });
      const dispatchResult = await checkAndDispatchEmail({
        petId: result.pet.id,
      });
      console.log("checkAndDispatchPetEmail result:", dispatchResult);
    } catch (e) {
      console.warn("Email dispatch check failed:", e);
    }

    setIsLoadingPet(false);
  }, [checkAndDispatchEmail, user, getPetMutation]);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  useEffect(() => {
    if (user?.email) {
      void loadPet();
    }
  }, [user, loadPet]);
    useEffect(() => {
      const onVisibility = () => {
        if (document.visibilityState === "visible") {
          void loadPet();
        }
      };
      window.addEventListener("visibilitychange", onVisibility);
      return () => window.removeEventListener("visibilitychange", onVisibility);
  }, [loadPet]);

  useEffect(() => {
    const handlePetUpdated = () => {
      console.log("Received 'pet-updated' event, reloading pet...");
      void loadPet();
    };

    window.addEventListener("pet-updated", handlePetUpdated);
    return () => {
      window.removeEventListener("pet-updated", handlePetUpdated);
    };
  }, [loadPet]);

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    void navigate("/login");
  };

  const handleSettings = () => {};

  const handleSubmitPetForm = (message: RequestMessage) => {
    setMessage(message);
  };

  return (
    <PanelCard panelSx={{ height: 450 }} message={message}>
      {isLoadingPet ? (
        <CircularProgress />
      ) : pet ? (
        <Stack gap={2}>
          <PetInfoCard
            petInfo={{
              name: pet.name,
              health: pet.health,
              hunger: pet.hunger,
              mood: pet.mood,
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
        <PetCreationForm user={user} onSubmitPetForm={handleSubmitPetForm} />
      )}
    </PanelCard>
  );
};
