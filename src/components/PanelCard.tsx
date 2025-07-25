import { Logo } from "@/components/Logo";
import { Panel } from "@/components/Panel";
import { LoginMessage } from "@/types/login";
import { Alert, SxProps } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  showLogo?: boolean;
  message?: LoginMessage;
  panelSx?: SxProps;
}

export const PanelCard = (props: Props) => {
  const { showLogo = false } = props;

  return (
    <Panel sx={{ width: 450, ...props.panelSx }}>
      {showLogo && <Logo />}
      {props.message && (
        <Alert severity={props.message.type} sx={{ width: "100%" }}>
          {props.message.text}
        </Alert>
      )}
      {props.children}
    </Panel>
  );
};
