# Theorie oefenen

A free practice site for the Dutch CBR driving theory exam (car, category B). There are no accounts, no costs and no ads. It is static HTML, CSS and JavaScript with no build step, so it runs on GitHub Pages as is. You can also open `index.html` directly in a browser.

## Features

- **Examen simuleren:** 50 random questions, a 30-minute timer, and a pass at 44 correct, matching the CBR format since 7 April 2025. There's no feedback until the end, and unanswered questions count as wrong.
- **Oefenen:** practice by topic, with instant feedback and an explanation after each answer.
- **Fouten herhalen:** repeats the questions you got wrong last time. A question drops off the list once you answer it correctly.
- Progress is saved in the browser's `localStorage`. Nothing leaves the device.
- Traffic signs are drawn as inline SVG.
- Keyboard shortcuts (1–4 or A–D to answer, Enter for next), light and dark mode, and a mobile layout.

## Files

| File | Purpose |
| --- | --- |
| `questions.js` | The question bank |
| `signs.js` | Simplified traffic signs as SVG |
| `app.js` | Quiz logic, timer and progress storage |
| `index.html`, `style.css`, `favicon.svg` | The page |
| `tools/check-questions.js` | Validates the question bank |
| `.nojekyll` | Tells GitHub Pages to serve the files without Jekyll |

## Adding questions

Add an object to `QUESTIONS` in `questions.js`:

```js
{
  id: 85,                       // unique
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

The questions are original. They are not the official CBR questions, which are copyrighted, and the site is not affiliated with the CBR. The facts were checked against public sources, including Rijksoverheid, ANWB and Rijkswaterstaat. Rules change, so check new questions against the current [RVV 1990](https://wetten.overheid.nl/BWBR0004825/) and [cbr.nl](https://www.cbr.nl).

The real exam tests hazard perception with short animations. Here those are text scenarios with the choices remmen, gas loslaten or niets.

## Custom domain

The site uses only relative paths, so a custom domain works without code changes. Add a `CNAME` file containing the domain, or set it under Settings → Pages.
