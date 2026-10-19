# Theorie oefenen

A small, free static quiz for practising Dutch driving theory. Open `index.html` in a browser. No install or build step.

## Modes

- **Oefenen**: all questions in random order, with instant feedback and an explanation after each answer.
- **Examen**: a random set of N questions (set the count on the menu), with the score and a review at the end.

## Files

- `questions.js`: the question bank. Each entry has `question`, three `options`, the index of the `answer`, and an `explanation`.
- `app.js`: quiz logic. Answer options are shuffled on every run.
- `index.html`, `style.css`: the page. Supports light and dark mode.

## Adding questions

Append an object to `QUESTIONS` in `questions.js` with a unique `id`. Check every fact against the current RVV 1990 and the official CBR materials.

## Note on content

The questions here are original and written for practice. They are not the official CBR exam questions, which are copyrighted, and they are not guaranteed to match the current rules. Always confirm against official sources before relying on them.
