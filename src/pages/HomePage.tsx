import { Button, Stack, Typography } from "@mui/material";
import { useAction, useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Panel } from "@/components/Panel";

export const HomePage = () => {
  const [user, setUser] = useState<any>(null);
  const [hasExistingPet, setHasExistingPet] = useState(false);

  const sendEmailAction = useAction(api.sendEmail.sendEmail);
  const navigate = useNavigate();

  const checkForExistingPetMutation = useMutation(
    api.mutations.checkForExistingPet.checkForExistingPet
  );

  useEffect(() => {
    const checkForExistingPet = async () => {
      const result = await checkForExistingPetMutation({
        email: user?.email,
      });

      setHasExistingPet(result?.success);
    };

    void checkForExistingPet();
  }, []);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

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

  const handleSettings = () => {
    // TODO: create a settings page to navigate to
  };

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    void navigate("/login");
  };

  return (
    <Panel>
      <Stack sx={{ alignItems: "center", gap: 1 }}>
        <Typography variant="h6" sx={{ color: "primary.main" }}>
          Welcome back 👋
        </Typography>
        <Typography variant="h6" sx={{ color: "primary.main" }}>
          {user?.email}
        </Typography>
      </Stack>
      {hasExistingPet ? (
        <Button variant="contained" onClick={() => void handleSettings()}>
          Settings
        </Button>
      ) : (
        <Button variant="contained" onClick={() => void handleSendEmail()}>
          Send Email
        </Button>
      )}
      <Button variant="outlined" onClick={handleSignOut}>
        Sign Out
      </Button>
    </Panel>
  );
};
