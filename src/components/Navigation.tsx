import { useAuthActions } from "@convex-dev/auth/react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useQuery } from "convex/react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";

export const Navigation = () => {
  const user = useQuery(api.auth.loggedInUser);
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    await navigate("/");
  };

  return (
    <AppBar position="sticky" sx={{ mb: 3 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          🐾 Atomi-gochi
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/profile">
                Profile
              </Button>
              <Button color="inherit" onClick={() => void handleSignOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
