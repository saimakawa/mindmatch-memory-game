import { createDeck, chooseNextDifficulty, formatTime } from "./game-logic.js";

const board = document.querySelector("#board");
const movesEl = document.querySelector("#moves");
const pairsEl = document.querySelector("#pairs");
const timerEl = document.querySelector("#timer");
const levelEl = document.querySelector("#level");
const statusEl = document.querySelector("#status");
const ruleText = document.querySelector("#ruleText");
const restartBtn = document.querySelector("#restart");
const newRoundBtn = document.querySelector("#newRound");
const exportBtn = document.querySelector("#export");
const viewResultsBtn = document.querySelector("#viewResults");
const resultsPanel = document.querySelector("#resultsPanel");
const resultsBody = document.querySelector("#resultsBody");
const resultsCount = document.querySelector("#resultsCount");
const resultsEmpty = document.querySelector("#resultsEmpty");

let deck = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let difficulty = "easy";
let startedAt = null;
let elapsedSeconds = 0;
let timerId = null;
let mismatchTimeout = null;
let roundOver = false;
let roundNumber = 0;
const results = JSON.parse(localStorage.getItem("mindmatch-results") || "[]");

function renderBoard() {
  board.replaceChildren();
  deck.forEach((card, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "card hidden-card";
    button.textContent = "✦";
    button.setAttribute("aria-label", `Hidden card ${index + 1}`);
    button.dataset.index = String(index);
    button.addEventListener("click", () => revealCard(index));
    board.append(button);
  });
  updateStats();
}

function updateStats() {
  movesEl.textContent = String(moves);
  pairsEl.textContent = `${matchedPairs} / 8`;
  timerEl.textContent = formatTime(elapsedSeconds);
  levelEl.textContent = `${difficulty.toUpperCase()} ROUND`;
}

function startTimer() {
  if (timerId || startedAt !== null) return;
  startedAt = Date.now();
  timerId = window.setInterval(() => {
    elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
    timerEl.textContent = formatTime(elapsedSeconds);
  }, 250);
}

function stopTimers() {
  if (timerId) window.clearInterval(timerId);
  if (mismatchTimeout) window.clearTimeout(mismatchTimeout);
  timerId = null;
  mismatchTimeout = null;
}

function revealCard(index) {
  if (lockBoard || roundOver) return;
  const card = deck[index];
  if (card.matched || card.revealed) return;
  startTimer();
  card.revealed = true;
  const button = board.querySelector(`[data-index="${index}"]`);
  button.textContent = card.symbol;
  button.className = "card revealed";
  button.setAttribute("aria-label", `Card ${index + 1}: ${card.symbol}`);
  if (!firstCard) {
    firstCard = { ...card, index };
    return;
  }
  secondCard = { ...card, index };
  moves += 1;
  updateStats();
  if (firstCard.pairId === secondCard.pairId) {
    deck[firstCard.index].matched = true;
    deck[secondCard.index].matched = true;
    [firstCard.index, secondCard.index].forEach((matchedIndex) => {
      const matchedButton = board.querySelector(
        `[data-index="${matchedIndex}"]`,
      );
      matchedButton.className = "card matched";
      matchedButton.disabled = true;
      matchedButton.setAttribute(
        "aria-label",
        `Matched card: ${deck[matchedIndex].symbol}`,
      );
    });
    matchedPairs += 1;
    firstCard = null;
    secondCard = null;
    updateStats();
    if (matchedPairs === 8) finishRound();
    else statusEl.textContent = "Nice match! Find another pair.";
  } else {
    lockBoard = true;
    statusEl.textContent = "Not a match — remember the cards.";
    mismatchTimeout = window.setTimeout(
      () => {
        [firstCard.index, secondCard.index].forEach((hiddenIndex) => {
          deck[hiddenIndex].revealed = false;
          const hiddenButton = board.querySelector(
            `[data-index="${hiddenIndex}"]`,
          );
          hiddenButton.textContent = "✦";
          hiddenButton.className = "card hidden-card";
          hiddenButton.setAttribute(
            "aria-label",
            `Hidden card ${hiddenIndex + 1}`,
          );
        });
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        mismatchTimeout = null;
        statusEl.textContent = "Choose two cards to find a pair.";
      },
      difficulty === "hard" ? 500 : 850,
    );
  }
}

function renderResults() {
  resultsBody.replaceChildren();
  const completedResults = results.filter((result) => result.completed);
  resultsCount.textContent = `${completedResults.length} ${completedResults.length === 1 ? "round" : "rounds"}`;
  resultsEmpty.hidden = completedResults.length > 0;

  completedResults.forEach((result) => {
    const row = document.createElement("tr");
    const values = [
      result.round,
      String(result.difficulty || "easy").toUpperCase(),
      result.moves,
      formatTime(result.elapsedSeconds),
      `${result.matchedPairs} / 8`,
      String(result.nextDifficulty || "easy").toUpperCase(),
    ];
    values.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = String(value);
      row.append(cell);
    });
    resultsBody.append(row);
  });
}

function finishRound() {
  roundOver = true;
  stopTimers();
  elapsedSeconds =
    startedAt === null ? 0 : Math.floor((Date.now() - startedAt) / 1000);
  const next = chooseNextDifficulty({
    moves,
    elapsedSeconds,
    currentDifficulty: difficulty,
  });
  results.push({
    round: roundNumber,
    moves,
    elapsedSeconds,
    difficulty,
    matchedPairs,
    completed: true,
    nextDifficulty: next.difficulty,
    savedAt: new Date().toISOString(),
  });
  localStorage.setItem("mindmatch-results", JSON.stringify(results));
  renderResults();
  ruleText.textContent = next.reason;
  statusEl.textContent = `You won in ${moves} moves and ${formatTime(elapsedSeconds)}! ${next.reason}`;
  difficulty = next.difficulty;
  updateStats();
  newRoundBtn.textContent = "Play next round";
}

function startRound({ keepDifficulty = false, seed = null } = {}) {
  stopTimers();
  if (!keepDifficulty && roundOver) {
    // Difficulty was selected by the previous round's performance.
  }
  roundNumber += 1;
  deck = createDeck(seed);
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  moves = 0;
  matchedPairs = 0;
  startedAt = null;
  elapsedSeconds = 0;
  roundOver = false;
  renderBoard();
  statusEl.textContent = "Choose any card to begin.";
  newRoundBtn.textContent = "Start new round";
  updateStats();
}

function exportResults() {
  const blob = new Blob([JSON.stringify(results, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "mindmatch-session-results.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

restartBtn.addEventListener("click", () =>
  startRound({ keepDifficulty: true }),
);
newRoundBtn.addEventListener("click", () =>
  startRound({ keepDifficulty: true }),
);
exportBtn.addEventListener("click", exportResults);
viewResultsBtn.addEventListener("click", () => {
  const shouldShow = resultsPanel.hidden;
  resultsPanel.hidden = !shouldShow;
  viewResultsBtn.textContent = shouldShow ? "Hide results" : "View results";
  viewResultsBtn.setAttribute("aria-expanded", String(shouldShow));
  if (shouldShow) renderResults();
});
renderResults();
startRound();
