import React, { useState } from "react";
import { Panel } from "@/components/Panel";
import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Fruit {
  emoji: string;
  name: string;
}

interface Treat {
  emoji: string;
  name: string;
}

const fruits: Fruit[] = [
  { emoji: "🍎", name: "Apple" },
  { emoji: "🍌", name: "Banana" },
  { emoji: "🍇", name: "Grapes" },
  { emoji: "🍓", name: "Strawberry" },
  { emoji: "🍍", name: "Pineapple" },
];

const combinations: Record<string, Treat> = {
  "🍎🍌": { emoji: "🍰", name: "Fruit Cake" },
  "🍇🍓": { emoji: "🍧", name: "Berry Ice" },
  "🍍🍌": { emoji: "🍹", name: "Tropical Smoothie" },
  // Add more combinations as desired
};

export default function CookingPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<Treat | null>(null);
  const navigate = useNavigate();

  const handleSelect = (fruit: Fruit) => {
    if (selected.length < 2 && !selected.includes(fruit.emoji)) {
      setSelected([...selected, fruit.emoji]);
    }
  };

  const handleCombine = () => {
    const key = [...selected].sort().join("");
    setResult(combinations[key] || { emoji: "❓", name: "Unknown Treat" });
  };

  const handleFeedPet = () => {
    navigate("/home");
  };

  return (
    <Panel>
      <Stack gap={2} alignItems="center">
        <Typography variant="h4">Cooking Minigame</Typography>
        <Typography>Select two fruits to combine into a treat!</Typography>
        <Stack direction="row" gap={2}>
          {fruits.map((fruit) => (
            <span
              key={fruit.emoji}
              style={{
                cursor: "pointer",
                opacity: selected.includes(fruit.emoji) ? 0.5 : 1,
                fontSize: 40,
                margin: "0 10px",
                transition: "opacity 0.2s",
              }}
              onClick={() => handleSelect(fruit)}
            >
              {fruit.emoji}
            </span>
          ))}
        </Stack>
        <Typography>Selected: {selected.join(" ")}</Typography>
        {selected.length === 2 && !result && (
          <Button variant="contained" onClick={handleCombine}>
            Combine
          </Button>
        )}
        {result && (
          <Stack alignItems="center" gap={1}>
            <Typography variant="h2">{result.emoji}</Typography>
            <Typography variant="h6">{result.name}</Typography>
            <Button variant="outlined" onClick={handleFeedPet}>
              Feed Your Pet
            </Button>
          </Stack>
        )}
      </Stack>
    </Panel>
  );
}
