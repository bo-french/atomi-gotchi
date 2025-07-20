import { AuthFormBox } from "@/components/AuthFormBox";
import { LoginForm } from "@/components/LoginForm";
import { LoginMessage } from "@/types/login";
import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

export const LoginPage = () => {
  const [message, setMessage] = useState<LoginMessage | undefined>(undefined);

  return (
    <Stack
      height="100vh"
      justifyContent="center"
      sx={{ backgroundColor: "primary.main" }}
    >
      <AuthFormBox message={message}>
        <LoginForm onSubmit={setMessage} />
        <Typography variant="body2">
          Don't have an account?
          <Button
            component={Link}
            to="/sign-up"
            variant="text"
            sx={{ textTransform: "none" }}
          >
            Sign up here
          </Button>
        </Typography>
      </AuthFormBox>
    </Stack>
  );
};
