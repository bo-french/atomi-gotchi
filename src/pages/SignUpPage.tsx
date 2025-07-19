import { SignUpForm } from "@/components/SignUpForm";
import { LoginMessage } from "@/types/login";
import { Alert, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

export const SignUpPage = () => {
  const [message, setMessage] = useState<LoginMessage | null>(null);

  return (
    <Stack
      sx={{
        alignItems: "center",
        padding: 4,
        gap: 2,
        maxWidth: 400,
        margin: "0 auto",
        minHeight: "100vh",
        justifyContent: "center",
      }}
    >
      <Typography variant="h2">🐾 Sign Up</Typography>
      <Typography
        variant="body1"
        sx={{ textAlign: "center", color: "text.secondary" }}
      >
        Create your account to start caring for your virtual pet!
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ width: "100%" }}>
          {message.text}
        </Alert>
      )}

      <SignUpForm onSubmit={setMessage} />

      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account?{" "}
        <Button
          component={Link}
          to="/login"
          variant="text"
          sx={{ p: 0, textTransform: "none" }}
        >
          Sign in here
        </Button>
      </Typography>
    </Stack>
  );
};
