import { ROUTES } from "@/types/navigation";
import { ArrowBack } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Props {
  onClick?: () => void;
}

export const BackToHome = (props: Props) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="contained"
      onClick={props.onClick ?? (() => void navigate(ROUTES.home))}
      sx={{
        gap: 1,
        width: "fit-content",
      }}
    >
      <ArrowBack />
      Home
    </Button>
  );
};
