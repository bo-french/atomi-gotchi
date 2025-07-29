import { Stack, SxProps } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  sx?: SxProps;
}

export const Panel = (props: Props) => {
  return (
    <Stack
      gap={2}
      alignItems="center"
      justifyContent="center"
      padding={4}
      margin="0 auto"
      borderRadius={4}
      sx={{ backgroundColor: "white", boxShadow: 3, ...props.sx }}
    >
      {props.children}
    </Stack>
  );
};
