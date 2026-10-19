# Theorie oefenen

A free practice site for the Dutch CBR driving theory exam (car, category B). There are no accounts, no costs and no ads. It is static HTML, CSS and JavaScript with no build step, so it runs on GitHub Pages as is. You can also open `index.html` directly in a browser.

## Features

- **Examen simuleren:** 50 random questions, a 30-minute timer, and a pass at 44 correct, matching the CBR format since 7 April 2025. As in the real exam, you can go back and change answers (Vorige, the arrow keys, or the progress bar). There's no feedback until the end, and unanswered questions count as wrong.
- **Oefenen:** practice by topic, with instant feedback and an explanation after each answer.
- **Fouten herhalen:** repeats the questions you got wrong last time. A question drops off the list once you answer it correctly.
- **Leren:** a cheat sheet with the key numbers, plus rules, warnings ("Let op") and rules of thumb for each topic. It's searchable, and each topic links to practice for that topic.
- Progress is saved in the browser's `localStorage`, including a per-topic overview on the home page. Nothing leaves the device.
- Colours: blue is your selected answer, green is correct, red is wrong. Each also has a tick or cross icon, so it doesn't rely on colour alone.
- Traffic signs are drawn as inline SVG. The Overpass font is self-hosted in `fonts/` (SIL Open Font License), so the site makes no requests to third parties.
- Keyboard shortcuts (1–4 or A–D to answer, Enter for next), light and dark mode, and a mobile layout.

## Files

| File | Purpose |
| --- | --- |
| `questions.js` | The question bank |
| `signs.js` | Simplified traffic signs as SVG |
| `learn.js` | Learning content: cheat sheet, rules per topic, rules of thumb |
| `fonts/` | Overpass and Overpass Mono (woff2) plus the licence |
| `app.js` | Quiz logic, timer and progress storage |
| `index.html`, `style.css`, `favicon.svg` | The page |
| `tools/check-questions.js` | Validates the question bank |
| `.nojekyll` | Tells GitHub Pages to serve the files without Jekyll |

## Adding questions

Add an object to `QUESTIONS` in `questions.js`:

```js
{
  id: 138,                      // unique
  topic: "Voorrang",            // used for the topic filter
  sign: "stop",                 // optional, a key from signs.js
  question: "…",
  options: ["…", "…", "…"],     // 2 to 4 options
  answer: 1,                    // index of the correct option
  fixedOrder: true,             // optional: don't shuffle (yes/no, hazard questions)
  explanation: "…"
}
```

Then run:

```sh
node tools/check-questions.js
```

## About the content

The questions are original. They are not the official CBR questions, which are copyrighted, and the site is not affiliated with the CBR. The facts were checked against public sources (law-text quotes from the RVV 1990 and WVW 1994, Rijksoverheid, ANWB, Rijkswaterstaat, CROW). Rules the sources disagreed on were left out, for example overtaking at a crossing, holding a phone at a red light, and the beginner period after 2toDrive. Rules change, so check new questions against the current [RVV 1990](https://wetten.overheid.nl/BWBR0004825/) and [cbr.nl](https://www.cbr.nl).

The real exam tests hazard perception with short animations. Here those are text scenarios with the choices remmen, gas loslaten or niets.

## Custom domain

The site uses only relative paths, so a custom domain works without code changes. Add a `CNAME` file containing the domain, or set it under Settings → Pages.
