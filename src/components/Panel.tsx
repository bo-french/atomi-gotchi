import { Logo } from "@/components/Logo";
import { LoginMessage } from "@/types/login";
import { Alert, Stack } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  showLogo?: boolean;
  message?: LoginMessage;
}

export const Panel = (props: Props) => {
  const { showLogo = false } = props;

  return (
    <Stack
      gap={2}
      alignItems="center"
      justifyContent="center"
      padding={4}
      margin="0 auto"
      width={450}
      borderRadius={4}
      sx={{ backgroundColor: "white", boxShadow: 3 }}
    >
      {showLogo && <Logo />}
      {props.message && (
        <Alert severity={props.message.type} sx={{ width: "100%" }}>
          {props.message.text}
        </Alert>
      )}
      {props.children}
    </Stack>
  );
};
