import { useState } from "react";
import { BackToHome } from "@/components/BackToHome";
import { Pet } from "@/components/Pet";
import { PetMood, ANIMATION_TIME } from "@/types/pet";
import { Button, Paper, Stack, Typography, Box } from "@mui/material";


const choices = [
  { name: "rock", img: "/rps/rock1.png" },
  { name: "paper", img: "/rps/paper.png" },
  { name: "scissors", img: "/rps/scissors1.png" },
];

const outcomes = ["", "", ""];
var gameNo = 0;

function getResult(player: string, opponent: string, gameNo: number) {
  if (player === opponent) return "It's a tie!";
  if (
    (player === "rock" && opponent === "scissors") ||
    (player === "paper" && opponent === "rock") ||
    (player === "scissors" && opponent === "paper")
  ) {
    return outcomes[gameNo] = "Won";
  }
  return outcomes[gameNo] = "Lost";
}

function getResults(outcomes: string[]) {
  const won = outcomes.filter(o => o === "Won").length;
  const lost = outcomes.filter(o => o === "Lost").length;

  if(won >= 2){
    return "You won Rock Paper Scissors!"
  }
  if(lost >= 2){
    return "You lost Rock Paper Scissors!"
  }
  else{
    return "You tied Rock Paper Scissors!"
  }
}

export const RockPaperScissors = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [opponentChoice, setOpponentChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [petMood, setPetMood] = useState<PetMood>(PetMood.HAPPY);

  const handlePlay = () => {
    setPlayerChoice(null);
    setOpponentChoice(null);
    setResult(null);
    setGameStarted(true);
    gameNo = 0;
    outcomes[0] = outcomes[1] = outcomes[2] = "";

  };

  const handleChoice = (choice: string) => {
    const opponent = choices[Math.floor(Math.random() * choices.length)].name;
    setPlayerChoice(choice);
    setOpponentChoice(opponent);
    const res = getResult(choice, opponent, gameNo);

    let mood: PetMood;
    if (res === "Won") {
      mood = PetMood.HAPPY;
    } else if (res === "It's a tie!") {
      mood = PetMood.NEUTRAL;
    } else {
      mood = PetMood.SAD;
    }
    setPetMood(mood);
    setResult(res);
    gameNo++;
    
    if(outcomes[2] != ""){
        const result = getResults(outcomes);
        let endMood: PetMood;
        if(result.includes("won")){
            endMood = PetMood.EXCITED;
        }
        if(result.includes("lost")){
            endMood = PetMood.SAD;
        }
        else{
            endMood = PetMood.NEUTRAL;
        }
        setPetMood(endMood);
    }
  };

  const handleClose = () => {
    setGameStarted(false);
    setPlayerChoice(null);
    setOpponentChoice(null);
    setResult(null);
    gameNo = 0;
    outcomes[0] = outcomes[1] = outcomes[2] = "";
    setPetMood(PetMood.HAPPY);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <Pet mood={petMood} />
      </Box>
      <h1>Rock Paper Scissors</h1>
      {!gameStarted && (
        <>
          <Button variant="contained" onClick={handlePlay} sx={{ mt: 2, mb: 2 }}>
            Play Game
          </Button>
          <BackToHome />
        </>
      )}
      {gameStarted && (
        <Paper elevation={4} sx={{ maxWidth: 400, mx: "auto", mt: 3, p: 3, borderRadius: 3 }}>
          {gameNo < 3 ? (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>Choose your move:</Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                {choices.map((c) => (
                  <Box
                    key={c.name}
                    onClick={() => handleChoice(c.name)}
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "16px",
                      background: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 36,
                      cursor: "pointer",
                      boxShadow: 2,
                      transition: "background 0.2s",
                      '&:hover': { background: '#e0e0e0' },
                    }}
                  >
                    <img src={c.img} alt={c.name} style={{ width: 40, height: 40 }} />
                  </Box>
                ))}
              </Stack>
              {playerChoice && opponentChoice && (
                <Typography variant="h6" sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    You chose:
                    <img src={choices.find(c => c.name === playerChoice)?.img} alt={playerChoice || ''} style={{ width: 40, height: 40 }} />
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Your pet chose:
                    <img src={choices.find(c => c.name === opponentChoice)?.img} alt={opponentChoice || ''} style={{ width: 40, height: 40 }} />
                  </span>
                  <br />
                  {result && <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>{result} Game number {gameNo} / 3</Typography>}
                  <Button variant="contained" onClick={handleClose}>Close</Button>
                </Typography>
              )}
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>Game over! {getResults(outcomes)} </Typography>
              <Button variant="contained" onClick={handleClose} sx={{ mt: 2 }}>Close</Button>
            </>
          )}
        </Paper>
      )}
    </div>
  );
}
