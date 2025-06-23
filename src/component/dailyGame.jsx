import React, { useState, useEffect } from "react";

// Mock daily word generator (replace with an API or logic for actual daily word)
const getDailyWord = () => {
  const words = ["apple", "banana", "cherry", "date", "grape"];
  const today = new Date().toISOString().split("T")[0]; // Get today's date
  const hash = today.split("-").reduce((acc, num) => acc + parseInt(num), 0); // Simple hash
  return words[hash % words.length]; // Cyclic word selection
};

const DailyGame = () => {
  const [dailyWord, setDailyWord] = useState("");
  const [guess, setGuess] = useState("");
  const [status, setStatus] = useState("");
  const [hasPlayedToday, setHasPlayedToday] = useState(false);

  useEffect(() => {
    const word = getDailyWord();
    setDailyWord(word);

    // Check if the user has already played today
    const lastPlayed = localStorage.getItem("lastPlayed");
    const today = new Date().toISOString().split("T")[0];
    if (lastPlayed === today) {
      setHasPlayedToday(true);
    }
  }, []);

  const handleGuess = () => {
    if (hasPlayedToday) {
      setStatus("You have already played today!");
      return;
    }

    if (guess.toLowerCase() === dailyWord) {
      setStatus("Congratulations! You guessed it!");
    } else {
      setStatus("Try again tomorrow!");
    }

    // Mark the game as played for today
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("lastPlayed", today);
    setHasPlayedToday(true);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Daily Guessing Game</h1>
      {hasPlayedToday ? (
        <p>You've already played today. Come back tomorrow!</p>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter your guess"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
          />
          <button onClick={handleGuess}>Submit</button>
        </>
      )}
      <p>{status}</p>
    </div>
  );
};

export default DailyGame;
