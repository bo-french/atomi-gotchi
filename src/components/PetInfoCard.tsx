import { Pet } from "@/components/Pet";
import { PetMood } from "@/types/pet";
import { PetInfo } from "@/types/petInfo";
import { Box, Stack, Typography } from "@mui/material";

interface Props {
  petInfo: PetInfo;
}

export const PetInfoCard = (props: Props) => {
  return (
    <Stack justifyContent="center" alignItems="center" gap={1}>
      <Typography variant="h1" sx={{ color: "primary.main" }}>
        {props.petInfo.name}
      </Typography>
      {/* TODO: This mood should eventually come from the pet db table */}
      <Pet mood={PetMood.HAPPY} />
      <Typography variant="body1">{getMood(props.petInfo)}</Typography>
      <Stack flexDirection="row" gap={1}>
        <Typography variant="body1">❤️</Typography>
        {getStatusBar(props.petInfo.health)}
      </Stack>
      <Stack flexDirection="row" gap={1}>
        <Typography variant="body1">🍪</Typography>
        {getStatusBar(props.petInfo.hunger)}
      </Stack>
    </Stack>
  );
};

const getMood = (petInfo: PetInfo) => {
  return `${petInfo.name} seems happy!`;
};

const getStatusBar = (stat: number) => {
  const max = 10;
  const percentage = (stat / max) * 100;

  let color = "#4caf50";
  if (percentage <= 30) {
    color = "#f44336";
  } else if (percentage <= 60) {
    color = "#ff9800";
  }

  return (
    <Box
      sx={{
        width: 250,
        height: 20,
        backgroundColor: "#e0e0e0",
        borderRadius: 2,
        overflow: "hidden",
        border: "2px solid #ccc",
      }}
    >
      <Box
        sx={{
          width: `${percentage}%`,
          height: "100%",
          backgroundColor: color,
          transition: "all 0.3s ease",
          borderRadius: 1,
        }}
      />
    </Box>
  );
};
