# MindMatch — Adaptive Memory Matching Game (PS09)

**Candidate:** Saima Kawal  
**Roll number:** 2311981447
**Branch:** CSE  
**Assessment:** Cerevyn Solutions — Software Developer Trainee, Round 1

## Problem
A browser-based 4×4 memory matching game with eight pairs. It tracks moves and active time, prevents invalid card interactions, and chooses the next round's difficulty using a documented performance rule.

## Tech stack
- HTML5 and CSS3
- Vanilla JavaScript ES modules
- Node.js built-in test runner (`node:test`)
- GitHub Actions for automated tests
- Azure Static Web Apps deployment plan

## Run locally
No package installation is needed to play the game. Because ES modules are used, serve the folder with a local static server. For example, with Python installed:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Run automated tests
Install Node.js 20 or newer, then run:

```bash
npm test
```

The tests cover deck size/pairs, reproducible seeded shuffle, seed variation, adaptive difficulty, time formatting and invalid negative time.

## Rules and adaptive logic
- The board has 16 cards: eight symbols, each appearing twice.
- A move is counted after the second card is selected.
- Matched cards stay visible and cannot be selected again.
- While two unmatched cards are being resolved, additional selections are blocked.
- Restart clears the old mismatch timeout and timer before starting a fresh round.
- Easy gives players 850 ms to view a mismatched pair; Hard gives 500 ms. If an Easy round finishes in 18 moves or fewer and within 90 seconds, the next round becomes Hard. Otherwise the next round is Easy. The reason is displayed after winning.
- The game stores anonymous completed-round summaries in localStorage and allows JSON export.

## Sample expected behaviour
- A seeded deck created with seed `42` has the same card order every time.
- A round completed in 18 moves and 90 seconds on Easy selects Hard for the next round.
- A round completed in 25 moves selects Easy for the next round.
- Timer `125` seconds displays as `02:05`.

## Demo checklist (3–5 minutes)
1. Start a round and reveal two cards.
2. Show a matching pair that stays visible.
3. Show a mismatch and quickly try selecting a third card; it should be blocked until the mismatch resolves.
4. Restart while a mismatch is pending; confirm the old timer/action does not affect the new round.
5. Complete a round or demonstrate the adaptive rule with the included test cases.
6. Export session results to JSON.

## Azure deployment
See [`docs/azure-plan.md`](docs/azure-plan.md). Live deployment is optional; the deployment plan is required.

## Repository checklist
- [ ] Replace the roll-number placeholder with your actual roll number.
- [ ] Confirm candidate name, branch and problem ID.
- [ ] Run `npm test` and confirm all tests pass.
- [ ] Capture screenshots and a 3–5 minute demo.
- [ ] Push all files to GitHub and make the repository public or grant evaluator access.
- [ ] Record the final commit hash in your submission notes.
- [ ] Submit the repository URL through the university form.

## Limitations
- Difficulty is a rule-based prototype, not a trained AI model.
- Scores are saved locally in the current browser; they are not synced across devices.
- The interface uses emoji symbols and does not use a remote backend.
