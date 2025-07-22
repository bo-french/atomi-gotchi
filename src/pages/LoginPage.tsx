import { LoginForm } from "@/components/LoginForm";
import { Panel } from "@/components/Panel";
import { LoginMessage } from "@/types/login";
import { ROUTES } from "@/types/navigation";
import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

export const LoginPage = () => {
  const [message, setMessage] = useState<LoginMessage | undefined>(undefined);

  return (
    <Panel message={message} showLogo>
      <LoginForm onSubmit={setMessage} />
      <Stack direction="row" alignItems="center">
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
          Don't have an account?
        </Typography>
        <Button component={Link} to={ROUTES.signup} variant="text">
          Sign up here
        </Button>
      </Stack>
    </Panel>
  );
};
