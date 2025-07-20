import { Panel } from "@/components/Panel";
import { SignUpForm } from "@/components/SignUpForm";
import { LoginMessage } from "@/types/login";
import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

export const SignUpPage = () => {
  const [message, setMessage] = useState<LoginMessage | undefined>(undefined);
  const [hideSignUpForm, setHideSignUpForm] = useState(false);

  const onSignUp = (message: LoginMessage) => {
    setMessage(message);
    setHideSignUpForm(message.type === "success");
  };

  return (
    <Panel message={message}>
      {!hideSignUpForm && <SignUpForm onSubmit={onSignUp} />}
      <Stack direction="row" alignItems="center">
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
          Already have an account?
        </Typography>
        <Button component={Link} to="/login" variant="text">
          Login here
        </Button>
      </Stack>
    </Panel>
  );
};
