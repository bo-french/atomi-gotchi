import { Pet } from "@/components/Pet";
import { PetMood } from "@/types/pet";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useAction, useMutation } from "convex/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../convex/_generated/api";

interface PetCreationFormData {
  petName: string;
}

interface Props {
  user: any; // TODO: this should be typed
}

export const PetCreationForm = (props: Props) => {
  const [loading, setLoading] = useState(false);

  const createPetMutation = useMutation(api.mutations.createPet.createPet);
  const sendEmailAction = useAction(api.sendEmail.sendEmail);

  const { register, handleSubmit, watch, setValue } =
    useForm<PetCreationFormData>({
      defaultValues: {
        petName: "",
      },
    });

  const petName = watch("petName");
  const isFormValid = petName.trim() !== "";

  // TODO: This email should get sent when the pet is created
  const handleSendEmail = async () => {
    if (!props.user?.email) {
      return;
    }

    try {
      await sendEmailAction({ email: props.user?.email });
    } catch (error) {
      console.error(error);
    }
  };

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

      /**
       * TODO: Show them a message to verify if the pet creation was successful with a callback to the PanelCard on the HomePage with the message prop. Send an email with handleSendEmail.Tell them that should have recieved an email. There should be a button to go back to the HomePage (this form is already on the HomePage, so only a reload is needed).
       */
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
        <Pet mood={PetMood.HAPPY} />
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
    "Geoff",
    "Bloo",
  ];

  return petNames[Math.floor(Math.random() * petNames.length)];
};
