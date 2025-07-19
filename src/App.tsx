import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import { useAction } from "convex/react";
import { useState } from "react";
import { api } from "../convex/_generated/api";

export default function App() {
    const [email, setEmail] = useState("georgia.martinez@atomicobject.com");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const sendEmailAction = useAction(api.sendEmail.sendEmail);

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
                setEmail(""); // Clear the input
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
                gap: 2,
                maxWidth: 400,
                margin: "0 auto",
            }}
        >
            <Typography variant="h2">🐾 Email Pet</Typography>
            <Typography
                variant="body1"
                sx={{ textAlign: "center", color: "text.secondary" }}
            >
                Enter your email to receive a welcome message from your virtual
                pet!
            </Typography>

            {message && (
                <Alert severity={message.type} sx={{ width: "100%" }}>
                    {message.text}
                </Alert>
            )}

            <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="your@email.com"
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
}
