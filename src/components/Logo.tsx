import { Stack, Typography } from "@mui/material";

export const Logo = () => {
  return (
    <Stack alignItems="center" gap={1}>
      <Typography variant="h1">Atomi-gochi</Typography>
      <img
        src="/gifs/pet.gif"
        alt="Virtual Pet"
        style={{
          width: 150,
          height: 120,
          objectFit: "cover",
          objectPosition: "bottom",
        }}
      />
    </Stack>
  );
};
