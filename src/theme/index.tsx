import { fontCSS, SUPERFROG_FONT_FAMILY } from "@/theme/fonts";
import { createTheme } from "@mui/material";

const style = document.createElement("style");
style.textContent = fontCSS;
document.head.appendChild(style);

export const theme = createTheme({
  palette: {
    primary: {
      main: "#31a2f2",
    },
  },
  typography: {
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      color: "#31a2f2",
      fontFamily: SUPERFROG_FONT_FAMILY,
    },
  },
});
