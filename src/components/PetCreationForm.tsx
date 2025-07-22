import { Button, Stack, TextField, Typography } from "@mui/material";
import { useMutation } from "convex/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../convex/_generated/api";

interface PetCreationFormData {
  petName: string;
}

export const PetCreationForm = () => {
  const [loading, setLoading] = useState(false);

  const createPetMutation = useMutation(api.mutations.createPet.createPet);

  const { register, handleSubmit, watch } = useForm<PetCreationFormData>({
    defaultValues: {
      petName: "",
    },
  });

  const petName = watch("petName");
  const isFormValid = petName.trim() !== "";

  const onSubmitForm = async (data: PetCreationFormData) => {
    setLoading(true);

    try {
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) {
        console.error("No user found");
        return;
      }

      const user = JSON.parse(currentUser);

      const result = await createPetMutation({
        petName: data.petName,
        email: user.email,
      });

      if (result?.success) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating pet:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(onSubmitForm)(e)}
      style={{ width: "100%" }}
    >
      <Stack width="100%" alignItems="center" gap={2}>
        <Typography variant="h1">Create Your Pet!</Typography>
        <img src="/gifs/pet.gif" alt="Virtual Pet" />
        <TextField label="Pet Name" {...register("petName")} fullWidth />
        <Button variant="contained" disabled={!isFormValid} type="submit">
          {loading ? "Creating your pet..." : "Create"}
        </Button>
      </Stack>
    </form>
  );
};
