# Proxy for the assistant

A small Cloudflare Worker that lets "Vraag het" on the site use your Anthropic API key, without that key ever appearing in the page.

The Worker:

- only accepts requests from the origins in `ALLOWED_ORIGINS` (in `wrangler.toml`);
- allows at most 10 questions per minute per visitor (IP address);
- takes only the conversation from the browser and sets everything else itself: the model (`claude-haiku-5-5`), the system prompt, the sources and the maximum answer length. The proxy can't be misused as a general-purpose Claude endpoint;
- adds only the sources that match the question: a small cached core (about 1k tokens) plus a handful of law articles, rules and signs picked by `src/retrieve.js` (usually around 500 tokens), not the whole book;
- doesn't log or store the conversation. It only sees the IP address, for the rate limit;
- streams the answer straight through to the browser.

## Deploy (once)

You need a free [Cloudflare account](https://dash.cloudflare.com/sign-up) and an API key from [console.anthropic.com](https://console.anthropic.com).

```sh
cd worker
npm install
npx wrangler login                          # opens the browser to sign in to Cloudflare
npx wrangler secret put ANTHROPIC_API_KEY   # paste your key; it's stored encrypted at Cloudflare
npx wrangler deploy
```

`deploy` prints the address, for example `https://theorie-assistent.yourname.workers.dev`. Put it in `assistant-config.js` in the root of the site:

```js
window.ASSISTANT_CONFIG = {
  proxyUrl: "https://theorie-assistent.yourname.workers.dev",
};
```

Commit and push that, and the assistant works for every visitor without their own key.

## Set a spending limit

In the [Anthropic Console](https://console.anthropic.com) under Limits, set a monthly spending limit of $5 for the key. With Haiku and only the matching sources, one question costs roughly $0.0005 to $0.001 (about 2–3k input tokens, mostly uncached sources, plus a short answer). So $5 covers some 5,000 to 10,000 questions a month. When the limit is reached, the assistant shows an error until the next month, and you never pay more. Visitors who enter their own key pay for their own questions; those don't count towards your limit.

## Settings

- **Your own domain later:** add it to `ALLOWED_ORIGINS`, comma-separated, e.g. `"https://sir-disappointing.github.io,https://www.example.nl"`, then run `npx wrangler deploy` again.
- **Rate limit:** `limit` and `period` (in seconds) under `[[ratelimits]]` in `wrangler.toml`.
- **Course material changed:** run `node tools/build-assistant-knowledge.js <theorie-mcp-package>` in the root of the site. That updates `assistant-knowledge.js` and copies the knowledge and search code to `worker/src/knowledge.js` and `worker/src/retrieve.js`. Check the search with `node tools/check-retrieval.mjs`, then run `npx wrangler deploy` again.
- **Search code changed:** edit `assistant-retrieve.mjs` in the root (not `worker/src/retrieve.js`) and run the build again so both stay the same.

## Without a proxy

If `proxyUrl` is empty, the assistant asks visitors for their own API key. It's stored only in their browser and sent directly to Anthropic.
