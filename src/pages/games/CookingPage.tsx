import React, { useState } from "react";
import { BackToHome } from "@/components/BackToHome";
import { Panel } from "@/components/Panel";
import { Button, Stack, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";

interface Fruit {
  key: string;
  name: string;
  img: string;
}

interface Treat {
  key: string;
  name: string;
  img: string;
}

const fruits: Fruit[] = [
  { key: "apple", name: "Apple", img: "/food/apple.png" },
  { key: "coconut", name: "Coconut", img: "/food/coconut.png" },
  { key: "orange", name: "Orange", img: "/food/orange.png" },
  { key: "grapes", name: "Grapes", img: "/food/grapes.png" },
  { key: "cherry", name: "Cherry", img: "/food/cherry.png" },
  { key: "pineapple", name: "Pineapple", img: "/food/pineapple.png" },
];

const combinations: Record<string, Treat> = {
  "applecoconut": { key: "applecoconut", name: "Tropical Apple Candy", img: "/food/brownorange.png" },
  "appleorange": { key: "appleorange", name: "Opposites Candy", img: "/food/redorange.png" },
  "applegrapes": { key: "applegrapes", name: "Grapple Candy", img: "/food/redpurple.png" },
  "applecherry": { key: "applecherry", name: "Chapped Candy", img: "/food/redbrown.png" },
  "applepineapple": { key: "applepineapple", name: "Apple Overload Candy", img: "/food/redyellow.png" },
  "coconutorange": { key: "coconutorange", name: "Coconut Citrus Candy", img: "/food/brownorange.png" },
  "coconutgrapes": { key: "coconutgrapes", name: "Coconut Grape Candy", img: "/food/purplebrown.png" },
  "coconutcherry": { key: "coconutcherry", name: "Coconut Cherry Candy", img: "/food/redbrown.png" },
  "coconutpineapple": { key: "coconutpineapple", name: "Tropical Candy", img: "/food/brownyellow.png" },
  "orangegrapes": { key: "orangegrapes", name: "Orange Grape Candy", img: "/food/purpleorange.png" },
  "orangecherry": { key: "orangecherry", name: "Sunset Candy", img: "/food/redorange.png" },
  "orangepineapple": { key: "orangepineapple", name: "Citrus Pineapple Candy", img: "/food/redyellow.png" },
  "cherrygrapes": { key: "grapescherry", name: "Berry Grape Candy", img: "/food/redpurple.png" },
  "grapespineapple": { key: "grapespineapple", name: "Complementary Candy", img: "/food/purpleyellow.png" },
  "cherrypineapple": { key: "cherrypineapple", name: "Cherry Pineapple Candy", img: "/food/redyellow.png" },
};

export function CookingPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<Treat | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (fruit: Fruit) => {
    if (selected.length < 2 && !selected.includes(fruit.key)) {
      setSelected([...selected, fruit.key]);
    }
  };

  const handleCombine = () => {
    const key = [...selected].sort().join("");
    setResult(combinations[key] || { key: "unknown", name: "Unknown Treat", img: "/food/coconut.png" });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const handleFeedPet = () => {
    navigate("/home");
  };

  return (
    <Panel
      sx={{
        width: 600,
        minHeight: 500,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        background: "white",
        boxShadow: 3,
        position: "relative",
      }}
    >
      {showConfetti && <Confetti width={600} height={500} recycle={false} numberOfPieces={400} gravity={0.2} />}
      <Typography variant="h4" fontWeight={700} color="#1976d2" mt={2} mb={1}>
        Cooking Minigame
      </Typography>
      <Typography fontSize={18} color="#1976d2" mb={1}>
        Select two fruits to combine into a treat!
      </Typography>
      <Typography fontSize={16} color="#1976d2" mb={2}>Try to figure out your pet's favorite</Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
          width: 350,
          minHeight: 160,
          position: "relative",
          mb: 2,
        }}
      >
        {fruits.map((fruit) => (
          <Box
            key={fruit.key}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: selected.includes(fruit.key) ? "not-allowed" : "pointer",
              opacity: selected.includes(fruit.key) ? 0.5 : 1,
              transition: "all 0.2s ease",
              borderRadius: 2,
              border: selected.includes(fruit.key) ? '2px solid #1976d2' : '2px solid transparent',
              boxShadow: selected.includes(fruit.key) ? '0 0 8px #1976d2' : undefined,
              background: '#f5faff',
              p: 1,
              m: 1,
              '&:hover': {
                background: '#e3f2fd',
                transform: selected.includes(fruit.key) ? undefined : 'scale(1.05)',
              },
            }}
            onClick={() => handleSelect(fruit)}
          >
            <img src={fruit.img} alt={fruit.name} style={{ width: 48, height: 48, borderRadius: 8 }} />
            <Typography fontSize={14} textAlign="center" color="#1976d2">{fruit.name}</Typography>
          </Box>
        ))}
      </Box>
      <Typography fontSize={16} color="#1976d2" mb={2}>
        Selected: {selected.map(key => fruits.find(f => f.key === key)?.name).join(" ")}
      </Typography>
      {selected.length === 2 && !result && (
        <Button variant="contained" onClick={handleCombine} sx={{ background: "#1976d2", color: "#fff", fontWeight: 700, boxShadow: 3, mb: 2 }}>
          Combine
        </Button>
      )}
      {result && (
        <Box
          sx={{
            mt: 2,
            mb: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: '#f5faff',
            borderRadius: 3,
            boxShadow: 2,
            p: 2,
            zIndex: 2,
          }}
        >
          <img src={result.img} alt={result.name} style={{ width: 64, height: 64, borderRadius: 12, boxShadow: '0 0 12px #1976d2', background: '#f5faff' }} />
          <Typography variant="h6" color="#1976d2" mt={1}>{result.name}</Typography>
          <Button variant="outlined" onClick={handleFeedPet} sx={{ border: "2px solid #1976d2", color: "#1976d2", fontWeight: 700, background: "#fff", mt: 1 }}>
            Feed Your Pet
          </Button>
        </Box>
      )}
      <Box mt={2}>
        <BackToHome />
      </Box>
    </Panel>
  );
}
