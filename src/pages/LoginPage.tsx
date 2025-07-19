import { LoginForm } from "@/components/LoginForm";
import { LoginMessage } from "@/types/login";
import { Alert, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

export const LoginPage = () => {
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
      <Typography variant="h2">🐾 Welcome Back</Typography>
      <Typography
        variant="body1"
        sx={{ textAlign: "center", color: "text.secondary" }}
      >
        Sign in to continue caring for your virtual pet!
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ width: "100%" }}>
          {message.text}
        </Alert>
      )}

      <LoginForm onSubmit={setMessage} />

      <Typography variant="body2">
        Don't have an account?{" "}
        <Button
          component={Link}
          to="/sign-up"
          variant="text"
          sx={{ p: 0, textTransform: "none" }}
        >
          Sign up here
        </Button>
      </Typography>
    </Stack>
  );
};
