import { ROUTES } from "@/types/navigation";
import { ArrowBack } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const BackToHome = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="contained"
      onClick={() => void navigate(ROUTES.home)}
      sx={{
        gap: 1,
        width: "fit-content",
      }}
    >
      <ArrowBack />
      <Typography variant="h6">Home</Typography>
    </Button>
  );
};
