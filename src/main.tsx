import { ConvexAuthProvider } from "@convex-dev/auth/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ConvexReactClient } from "convex/react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const theme = createTheme({
  palette: {
    primary: {
      main: "#9333ea",
    },
    secondary: {
      main: "#4F46E5",
    },
  },
  typography: {
    h2: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
  },
});

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ConvexAuthProvider client={convex}>
        <App />
      </ConvexAuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);
