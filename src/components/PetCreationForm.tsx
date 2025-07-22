import { Box, Button, Stack, TextField, Typography } from "@mui/material";
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

  const { register, handleSubmit, watch, setValue } =
    useForm<PetCreationFormData>({
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
        <Stack flexDirection="row" gap={1} width="100%">
          <Box flex={0.9}>
            <TextField
              label="Pet Name"
              {...register("petName")}
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: petName.length > 0,
                },
              }}
            />
          </Box>
          <Box
            flex={0.1}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="outlined"
              onClick={() => {
                setValue("petName", randomPetName());
              }}
              sx={{ minWidth: "unset", typography: "h5" }}
            >
              🎲
            </Button>
          </Box>
        </Stack>
        <Button variant="contained" disabled={!isFormValid} type="submit">
          {loading ? "Creating your pet..." : "Create"}
        </Button>
      </Stack>
    </form>
  );
};

const randomPetName = () => {
  const petNames = [
    "Pixel",
    "Mochi",
    "Luna",
    "Boba",
    "Gizmo",
    "Echo",
    "Nova",
    "Pico",
    "Milo",
    "Taco",
    "Cosmo",
    "Pebble",
    "Nugget",
    "Waffles",
    "Chai",
    "Nimbus",
    "Blink",
    "Juno",
    "Sprout",
    "Orbit",
    "Doodle",
    "Snap",
    "Froyo",
    "Noodle",
    "Yuzu",
    "Jelly",
    "Twix",
    "Kiwi",
    "Mango",
    "Zephyr",
    "Loaf",
    "Katsu",
    "Crumbs",
    "Pesto",
    "Amino",
    "Sushi",
    "Gloop",
    "Crouton",
  ];

  return petNames[Math.floor(Math.random() * petNames.length)];
};
