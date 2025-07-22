import { fontCSS, SUPERFROG_FONT_FAMILY } from "@/theme/fonts";
import { createTheme } from "@mui/material";

const style = document.createElement("style");
style.textContent = fontCSS;
document.head.appendChild(style);

export const theme = createTheme({
  palette: {
    primary: {
      main: "#31a2f2",
      dark: "#1976d2",
    },
  },
  typography: {
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      color: "#31a2f2",
      fontFamily: SUPERFROG_FONT_FAMILY,
    },
    h6: {
      color: "#000000 !important",
      fontSize: "1.25rem",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
        contained: {
          color: "white",
          boxShadow: "none",
        },
      },
      defaultProps: {
        size: "large",
        fullWidth: true,
      },
    },
  },
});
