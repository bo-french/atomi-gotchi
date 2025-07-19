import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import { useAction } from "convex/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";

export const HomePage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const sendEmailAction = useAction(api.sendEmail.sendEmail);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    void navigate("/login");
  };

  const handleSendEmail = async () => {
    if (!email) {
      setMessage({
        type: "error",
        text: "Please enter an email address",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await sendEmailAction({ email });

      if (result.success) {
        setMessage({
          type: "success",
          text: "Email sent successfully! 🎉",
        });
        setEmail("");
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to send email",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      sx={{
        alignItems: "center",
        padding: 4,
        gap: 3,
        maxWidth: 500,
        margin: "0 auto",
        minHeight: "100vh",
        justifyContent: "center",
      }}
    >
      <Stack sx={{ alignItems: "center", gap: 1 }}>
        <Typography variant="h2">🐾 Atomi-gochi</Typography>
        <Typography variant="h6" sx={{ color: "primary.main" }}>
          Welcome back 👋
        </Typography>
        <Typography variant="h6" sx={{ color: "primary.main" }}>
          {user?.email}
        </Typography>
        <Button
          variant="outlined"
          onClick={handleSignOut}
          size="small"
          sx={{ mt: 1 }}
        >
          Sign Out
        </Button>
      </Stack>

      <Typography
        variant="body1"
        sx={{ textAlign: "center", color: "text.secondary" }}
      >
        Send a welcome email with your virtual pet to any email address!
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ width: "100%" }}>
          {message.text}
        </Alert>
      )}

      <TextField
        label="Recipient Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        variant="outlined"
        placeholder="friend@email.com"
      />

      <Button
        variant="contained"
        onClick={() => void handleSendEmail()}
        disabled={loading}
        fullWidth
        size="large"
      >
        {loading ? "Sending..." : "Send Welcome Email 📧"}
      </Button>
    </Stack>
  );
};
