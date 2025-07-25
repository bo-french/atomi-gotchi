import { Stack, Typography } from "@mui/material";
import { Pet, PetMood } from "@/components/Pet.tsx";

export const Logo = () => {
  return (
    <Stack alignItems="center" gap={1}>
      <Typography variant="h1">Atomi-gotchi</Typography>
      <Pet mood={PetMood.HAPPY} />
    </Stack>
  );
};
