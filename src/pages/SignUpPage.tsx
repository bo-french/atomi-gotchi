import { AuthFormBox } from "@/components/AuthFormBox";
import { SignUpForm } from "@/components/SignUpForm";
import { LoginMessage } from "@/types/login";
import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

export const SignUpPage = () => {
  const [message, setMessage] = useState<LoginMessage | undefined>(undefined);

  return (
    <Stack
      height="100vh"
      justifyContent="center"
      sx={{ backgroundColor: "primary.main" }}
    >
      <AuthFormBox message={message}>
        <SignUpForm onSubmit={setMessage} />
      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account?
        <Button
          component={Link}
          to="/login"
          variant="text"
          sx={{ textTransform: "none" }}
        >
          Sign in here
          </Button>
        </Typography>
      </AuthFormBox>
    </Stack>
  );
};
