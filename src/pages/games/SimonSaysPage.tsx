import { Panel } from "@/components/Panel";
import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const squares = [
  { id: 1, color: "#ff4444", activeColor: "#ff8888" }, // Red
  { id: 2, color: "#44ff44", activeColor: "#88ff88" }, // Green
  { id: 3, color: "#4444ff", activeColor: "#8888ff" }, // Blue
  { id: 4, color: "#ffff44", activeColor: "#ffff88" }, // Yellow
];

export const SimonSaysPage = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [displayedSquare, setDisplayedSquare] = useState<string>("");
  const [canClickSquares, setCanClickSquares] = useState(false);

  const addRandomSquareToSequence = () => {
    const randomSquare = Math.floor(Math.random() * squares.length) + 1;
    setSequence((prev) => [...prev, randomSquare]);
  };

  const repeatSequence = () => {
    setCanClickSquares(false);

    sequence.forEach((squareId, index) => {
      setTimeout(() => {
        switch (squareId) {
          case 1:
            setDisplayedSquare("🟥");
            break;
          case 2:
            setDisplayedSquare("🟩");
            break;
          case 3:
            setDisplayedSquare("🟦");
            break;
          case 4:
            setDisplayedSquare("🟨");
            break;
        }

        setTimeout(() => {
          setDisplayedSquare("");
        }, 800);

        if (index === sequence.length - 1) {
          setTimeout(() => {
            setCanClickSquares(true);
          }, 800);
        }
      }, index * 1000);
    });
  };

  useEffect(() => {
    if (!gameStarted) {
      addRandomSquareToSequence();
      setGameStarted(true);
    }
  }, [gameStarted]);

  useEffect(() => {
    if (sequence.length > 0) {
      repeatSequence();
    }
  }, [sequence]);

  const checkInputtedSequence = (squareId: number) => {
    const correctSquare = sequence[currentIndex];

    if (squareId === correctSquare) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);

      if (newIndex === sequence.length) {
        setCurrentIndex(0);
        addRandomSquareToSequence();
      }
    } else {
      setCurrentIndex(0);
      repeatSequence();
    }
  };

  return (
    <Panel
      sx={{
        width: 600,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
      >
        <img
          src="/gifs/pet.gif"
          alt="Virtual Pet"
          style={{ width: 100, height: 100 }}
        />
        <Typography
          variant="h4"
          sx={{
            minHeight: "2.125rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "3rem",
          }}
        >
          {displayedSquare || "\u00A0"}
        </Typography>
      </Stack>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 2,
          width: 300,
          height: 300,
        }}
      >
        {squares.map((square) => (
          <Box
            key={square.id}
            sx={{
              backgroundColor: square.color,
              borderRadius: 2,
              cursor: canClickSquares ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
              opacity: canClickSquares ? 1 : 0.6,
              pointerEvents: canClickSquares ? "auto" : "none",
              ...(canClickSquares && {
                "&:hover": {
                  backgroundColor: square.activeColor,
                  transform: "scale(1.05)",
                },
                "&:active": {
                  transform: "scale(0.95)",
                },
              }),
            }}
            onClick={() => canClickSquares && checkInputtedSequence(square.id)}
          />
        ))}
      </Box>
    </Panel>
  );
};
