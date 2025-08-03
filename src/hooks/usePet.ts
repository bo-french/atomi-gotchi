import { useCallback, useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { mapPetMood, PetInfo } from "@/types/pet";

interface UsePetResult {
pet: PetInfo | undefined;
loading: boolean;
refresh: () => Promise<void>;
isDead: boolean;
clearPet: () => void;
}

const deriveMoodFromHealth = (health: number) => {
if (health < 33) return "sad";
if (health < 66) return "neutral";
return "happy";
};

export function usePet(): UsePetResult {
const [pet, setPet] = useState<PetInfo | undefined>(undefined);
const [loading, setLoading] = useState(false);
const getPet = useMutation(api.mutations.getPet.getPet);

const loadPet = useCallback(async () => {
    console.log("usePet: loading pet");
    const currentUserRaw = localStorage.getItem("currentUser");
    if (!currentUserRaw) return;
    let user;
    try {
    user = JSON.parse(currentUserRaw);
    } catch {
    return;
    }
    if (!user?.email) return;

    setLoading(true);
    const result = await getPet({ email: user.email });
    console.log("usePet: getPet result", result);
    if (result?.pet) {
    const derivedMood = deriveMoodFromHealth(result.pet.health);
    const petWithMood: PetInfo = {
        ...result.pet,
        mood: mapPetMood(derivedMood),
    };
    if (petWithMood.health === 0) {
        // dead: clear so creation UI shows
        setPet(undefined);
    } else {
        setPet(petWithMood);
    }
    localStorage.setItem("currentPet", JSON.stringify(petWithMood));
    }
    setLoading(false);
}, [getPet]);

useEffect(() => {
    void loadPet();
}, [loadPet]);

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
    const onUpdated = () => {
    console.log("usePet: received pet-updated event");
    void loadPet();
    };
    window.addEventListener("pet-updated", onUpdated);
    return () => window.removeEventListener("pet-updated", onUpdated);
}, [loadPet]);

const clearPet = () => {
    setPet(undefined);
    localStorage.removeItem("currentPet");
};

return {
    pet,
    loading,
    refresh: loadPet,
    isDead: !!pet && pet.health === 0,
    clearPet,
};
}
