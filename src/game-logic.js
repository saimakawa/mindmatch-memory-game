export const SYMBOLS = ["🍉", "🚀", "🌻", "🎧", "🐳", "🍄", "⚽", "🪐"];

// Seeded shuffle makes test sessions reproducible. Without a seed, use Math.random.
export function createDeck(seed = null) {
  const cards = SYMBOLS.flatMap((symbol, index) => [
    { id: `${index}-a`, pairId: index, symbol },
    { id: `${index}-b`, pairId: index, symbol }
  ]);
  let random = Math.random;
  if (seed !== null) {
    let state = Number(seed) >>> 0;
    random = () => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export function chooseNextDifficulty({ moves, elapsedSeconds, currentDifficulty }) {
  // Rule: strong Easy performance unlocks Hard; otherwise the next round is Easy.
  const strongPerformance = moves <= 18 && elapsedSeconds <= 90;
  if (currentDifficulty === "easy" && strongPerformance) {
    return { difficulty: "hard", reason: "You finished Easy in 18 moves or fewer and within 90 seconds. Next round: Hard." };
  }
  if (currentDifficulty === "hard" && strongPerformance) {
    return { difficulty: "hard", reason: "You met the performance target again. Stay on Hard." };
  }
  return { difficulty: "easy", reason: "The performance target was not met, so the next round will be Easy." };
}

export function formatTime(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
