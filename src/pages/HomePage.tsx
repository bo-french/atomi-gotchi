import { Button, Stack, Typography } from "@mui/material";
import { useAction } from "convex/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";

export const HomePage = () => {
  const [user, setUser] = useState<any>(null);

  const sendEmailAction = useAction(api.sendEmail.sendEmail);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    void navigate("/login");
  };

  const handleSendEmail = async () => {
    if (!user?.email) {
      return;
    }

    try {
      await sendEmailAction({ email: user?.email });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack
      sx={{
        alignItems: "center",
        padding: 4,
        gap: 3,
        maxWidth: 500,
        margin: "0 auto",
        minHeight: "100vh",
        justifyContent: "center",
      }}
    >
      <Stack sx={{ alignItems: "center", gap: 1 }}>
        <Typography variant="h2">🐾 Atomi-gochi</Typography>
        <Typography variant="h6" sx={{ color: "primary.main" }}>
          Welcome back 👋
        </Typography>
        <Typography variant="h6" sx={{ color: "primary.main" }}>
          {user?.email}
        </Typography>
        <Button
          variant="outlined"
          onClick={handleSignOut}
          size="small"
          sx={{ mt: 1 }}
        >
          Sign Out
        </Button>
      </Stack>

      <Typography
        variant="body1"
        sx={{ textAlign: "center", color: "text.secondary" }}
      >
        Send a welcome email with your virtual pet to any email address!
      </Typography>

      <Button
        variant="contained"
        onClick={() => void handleSendEmail()}
        fullWidth
        size="large"
      >
        Send Welcome Email 📧
      </Button>
    </Stack>
  );
};
