import { SignUpForm } from "@/login/SignUpForm";
import { LoginMessage } from "@/types/login";
import { Alert, Stack, Typography } from "@mui/material";
import { useAction } from "convex/react";
import { useState } from "react";
import { api } from "../convex/_generated/api";

export default function App() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<LoginMessage | null>(null);

    const sendEmailAction = useAction(api.sendEmail.sendEmail);

    const handleSignUpSubmit = (message: LoginMessage) => {
        setMessage(message);
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
            <Typography variant="h2">🐾 Atomi-gochi</Typography>
            {message && (
                <Alert severity={message.type} sx={{ width: "100%" }}>
                    {message.text}
                </Alert>
            )}
            <SignUpForm onSubmit={setMessage} />
        </Stack>
    );
}
