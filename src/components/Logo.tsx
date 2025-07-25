import { Pet, PetMood } from "@/components/Pet";
import { Stack, Typography } from "@mui/material";

export const Logo = () => {
  return (
    <Stack alignItems="center" gap={1}>
      <Typography variant="h1">Atomi-gotchi</Typography>
      <Pet mood={PetMood.HAPPY} />
    </Stack>
  );
};
