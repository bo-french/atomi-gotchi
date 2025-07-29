// src/pages/HigherLowerPage.tsx
import { BackToHome } from "@/components/BackToHome";
import { Panel } from "@/components/Panel";
import { Pet } from "@/components/Pet";
import { PetMood, ANIMATION_TIME } from "@/types/pet";
import { Box, Button, Stack, Typography, Snackbar, Alert } from "@mui/material";
import { useState } from "react";

// helper to get 1–100
const randomNumber = () => Math.floor(Math.random() * 100) + 1;

export const HigherLowerPage = () => {
    const [current, setCurrent] = useState<number>(randomNumber());
    const [next, setNext] = useState<number | null>(null);
    const [canGuess, setCanGuess] = useState(true);
    const [petMood, setPetMood] = useState<PetMood>(PetMood.HAPPY);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);  
    const [feedback, setFeedback] = useState<{
            message: string;
            severity: "success" | "error";
            open: boolean;
        }>({
            message: "",
            severity: "success",
            open: false,
        });

    const handleGuess = (guessHigher: boolean) => {
        // disable buttons during animation
        setCanGuess(false);

        // draw the next number
        const drawn = randomNumber();
        setNext(drawn);

        // check correctness
        const correct = guessHigher ? drawn > current : drawn < current;

        // update mood
        setPetMood(correct ? PetMood.EXCITED : PetMood.SAD);

        // after a short pause, reset state for the next round
        setTimeout(() => {
        setPetMood(PetMood.HAPPY);
        if (correct) {
            setScore(prev => {
                const newScore = prev + 1;
                if (newScore > highScore) setHighScore(newScore);
                return newScore;
            });

            setCurrent(randomNumber());

        } else {
            setScore(0)
        }

        setNext(null);
        setCanGuess(true);
        }, ANIMATION_TIME * 2);
        setFeedback({
            message: correct ? "Nice! You're right!" : "Oops! Wrong guess.",
            severity: correct ? "success" : "error",
            open: true,
        });
    };

    return (
        <Panel
        sx={{
            width: 500,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
        }}
        >
        <Box sx={{ mb: 1 }}>
            <Pet mood={petMood} />
        </Box>

        <Typography variant="h6">Score: {score} | High Score: {highScore}</Typography>
        <Snackbar
            open={feedback.open}
            autoHideDuration={1500}
            onClose={() => setFeedback(prev => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
            <Alert
                onClose={() => setFeedback(prev => ({ ...prev, open: false }))}
                severity={feedback.severity}
                variant="filled"
                sx={{ width: "100%" }}
            >
                {feedback.message}
            </Alert>
        </Snackbar>

        <Stack direction="row" spacing={4} alignItems="center">
            <Typography variant="h3">{current}</Typography>
            <Typography variant="h3">
            {next !== null ? next : "?"}
            </Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
            <Button
            variant="contained"
            disabled={!canGuess}
            onClick={() => handleGuess(true)}
            >
            Higher
            </Button>
            <Button
            variant="contained"
            disabled={!canGuess}
            onClick={() => handleGuess(false)}
            >
            Lower
            </Button>
        </Stack>


        <Box sx={{ mt: 3 }}>
            <BackToHome />
        </Box>
        </Panel>
    );
    };
