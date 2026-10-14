import test from "node:test";
import assert from "node:assert/strict";
import { createDeck, chooseNextDifficulty, formatTime, SYMBOLS } from "../src/game-logic.js";

test("deck contains 16 cards and each of the eight symbols appears twice", () => {
  const deck = createDeck(123);
  assert.equal(deck.length, 16);
  for (const symbol of SYMBOLS) {
    assert.equal(deck.filter(card => card.symbol === symbol).length, 2);
  }
});

test("same seed produces the same deck order", () => {
  assert.deepEqual(createDeck(42).map(c => c.id), createDeck(42).map(c => c.id));
});

test("different seeds can produce different deck orders", () => {
  assert.notDeepEqual(createDeck(42).map(c => c.id), createDeck(99).map(c => c.id));
});

test("strong Easy performance unlocks Hard", () => {
  assert.equal(chooseNextDifficulty({ moves: 18, elapsedSeconds: 90, currentDifficulty: "easy" }).difficulty, "hard");
});

test("weak performance switches next round to Easy", () => {
  const result = chooseNextDifficulty({ moves: 25, elapsedSeconds: 120, currentDifficulty: "hard" });
  assert.equal(result.difficulty, "easy");
  assert.match(result.reason, /not met/i);
});

test("time formatting handles seconds and minutes", () => {
  assert.equal(formatTime(9), "00:09");
  assert.equal(formatTime(125), "02:05");
});

test("negative time is safely clamped to zero", () => {
  assert.equal(formatTime(-3), "00:00");
});
