import { BackToHome } from "@/components/BackToHome";
import { Panel } from "@/components/Panel";
import { Pet } from "@/components/Pet";
import { PetMood, ANIMATION_TIME } from "@/types/pet";
import { Box, Stack, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

const squares = [
  { id: 1, color: "#ff4444", activeColor: "#ff8888" }, // Red
  { id: 2, color: "#44ff44", activeColor: "#88ff88" }, // Green
  { id: 3, color: "#4444ff", activeColor: "#8888ff" }, // Blue
  { id: 4, color: "#ffff44", activeColor: "#ffff88" }, // Yellow
];

const NUM_ROUNDS = 6;
const MAX_HEALTH = 100;
const WRONG_PENALTY = 20;

const deriveMoodFromHealth = (health: number): PetMood => {
  if (health < 33) return PetMood.SAD;
  if (health < 66) return PetMood.NEUTRAL;
  return PetMood.HAPPY;
};

export const SimonSaysPage = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedSquare, setDisplayedSquare] = useState<string>("");
  const [canClickSquares, setCanClickSquares] = useState(false);

  const [petMood, setPetMood] = useState<PetMood>(PetMood.HAPPY);
  const [health, setHealth] = useState<number>(MAX_HEALTH);
  const [showDeadModal, setShowDeadModal] = useState(false);
  const [pet, setPet] = useState<any | null>(null);
  const getPet = useMutation(api.mutations.getPet.getPet);
  const updateHealth = useMutation(api.mutations.updateHealth.updateHealth);

  const navigate = useNavigate();

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
  const loadPet = async () => {
    const currentUserRaw = localStorage.getItem("currentUser");
    if (!currentUserRaw) return;
    try {
      const user = JSON.parse(currentUserRaw);
      if (!user?.email) return;
      const res = await getPet({ email: user.email });
      if (res.success && res.pet) {
        setPet(res.pet);
        setHealth(res.pet.health ?? MAX_HEALTH);
        setPetMood(deriveMoodFromHealth(res.pet.health ?? MAX_HEALTH));
        localStorage.setItem("currentPet", JSON.stringify(res.pet));
      }
    } catch {
      // ignore parse errors
    }
  };
  void loadPet();
}, [getPet]);

  useEffect(() => {
    addRandomSquareToSequence();
  }, []);

  useEffect(() => {
    if (sequence.length > 0) {
      repeatSequence();
    }
  }, [sequence]);

  useEffect(() => {
    setPetMood(deriveMoodFromHealth(health));
    if (health <= 0) {
      setShowDeadModal(true);
    }
  }, [health]);

  const checkInputtedSequence = (squareId: number) => {
    if (!isPlaying || health <= 0) return;
    const correctSquare = sequence[currentIndex];

if (squareId === correctSquare) {
  // heal locally first for snappiness
  setHealth((prev) => Math.min(MAX_HEALTH, prev + HEAL_ON_CORRECT));
  const newIndex = currentIndex + 1;
  setCurrentIndex(newIndex);

  if (newIndex === sequence.length) {
    setPetMood(PetMood.EXCITED);

    if (sequence.length !== NUM_ROUNDS) {
      setTimeout(() => {
        setPetMood(deriveMoodFromHealth(Math.min(MAX_HEALTH, health + HEAL_ON_CORRECT)));
        setCurrentIndex(0);
        addRandomSquareToSequence();
      }, ANIMATION_TIME * 2);
    } else {
      // win: restore to max on backend too
      if (pet) {
        const deltaToMax = MAX_HEALTH - health;
        if (deltaToMax > 0) {
          void updateHealth({ petId: pet.id, delta: deltaToMax }).then((result) => {
            if (result.success) {
              const updatedPet = { ...pet, health: result.health };
              setPet(updatedPet);
              localStorage.setItem("currentPet", JSON.stringify(updatedPet));
              setPetMood(deriveMoodFromHealth(result.health));
            }
          });
        }
      }
      setHealth(MAX_HEALTH);
      setTimeout(() => {
        setPetMood(deriveMoodFromHealth(MAX_HEALTH));
      }, ANIMATION_TIME);
      setIsPlaying(false);
      setCanClickSquares(false);
    }
  }

  // persist the heal to backend for non-final correct (optional: batch or debounce if too chatty)
  if (newIndex !== sequence.length && pet) {
    void updateHealth({ petId: pet.id, delta: HEAL_ON_CORRECT }).then((result) => {
      if (result.success) {
        const updatedPet = { ...pet, health: result.health };
        setPet(updatedPet);
        localStorage.setItem("currentPet", JSON.stringify(updatedPet));
        // mood will sync via effect on health
      }
    });
  }
} else {
  // wrong: penalize
  setHealth((prev) => Math.max(0, prev - WRONG_PENALTY));
  setPetMood(PetMood.SAD);

  if (pet) {
    void updateHealth({ petId: pet.id, delta: -WRONG_PENALTY }).then((result) => {
      if (result.success) {
        const updatedPet = { ...pet, health: result.health };
        setPet(updatedPet);
        localStorage.setItem("currentPet", JSON.stringify(updatedPet));
        if (result.health <= 0) setShowDeadModal(true);
      }
    });
  }

  setTimeout(() => {
    setPetMood(deriveMoodFromHealth(Math.max(0, health - WRONG_PENALTY)));
    setCurrentIndex(0);
    repeatSequence();
  }, ANIMATION_TIME * 2);
}
  };

  let healthColor = "#4caf50";
  if (health <= 30) healthColor = "#f44336";
  else if (health <= 60) healthColor = "#ff9800";

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
      <Dialog open={showDeadModal} onClose={() => {}} disableEscapeKeyDown>
        <DialogTitle>Game Over</DialogTitle>
        <DialogContent>Your pet has died. Refresh or go home to restart.</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              // reset state for a fresh start
              setHealth(MAX_HEALTH);
              setSequence([]);
              setCurrentIndex(0);
              setIsPlaying(true);
              setShowDeadModal(false);
              addRandomSquareToSequence();
            }}
            autoFocus
          >
            Restart
          </Button>
          <Button
            onClick={() => {
              navigate("/");
            }}
          >
            Back Home
          </Button>
        </DialogActions>
      </Dialog>

      {/* Health bar */}
      <Box sx={{ width: "100%", mb: 1 }}>
        <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
          ❤️ Health:
        </Typography>
        <Box
          sx={{
            position: "relative",
            height: 20,
            width: "100%",
            backgroundColor: "#ddd",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: `${health}%`,
              backgroundColor: healthColor,
              transition: "width 0.5s ease",
            }}
          />
          <Typography
            variant="body2"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontWeight: "bold",
              color: "#000",
              userSelect: "none",
            }}
          >
            {health}%
          </Typography>
        </Box>
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        sx={{ width: "100%", position: "relative" }}
      >
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Pet mood={petMood} />
        </Box>
        <Box
          sx={{
            position: "absolute",
            right: 150,
          }}
        >
          <Typography variant="h4">{displayedSquare || "\u00A0"}</Typography>
        </Box>
      </Stack>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 2,
          width: 350,
          height: 350,
          position: "relative",
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
        {!isPlaying && health > 0 && (
          <Panel
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 250,
            }}
          >
            <Typography variant="h1" sx={{ mb: 2, textAlign: "center" }}>
              You Win!
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <BackToHome />
            </Box>
          </Panel>
        )}
      </Box>
    </Panel>
  );
};
