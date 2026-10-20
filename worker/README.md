# Proxy for the assistant

A small Cloudflare Worker that lets "Vraag het" on the site use your Anthropic API key, without that key ever appearing in the page.

The Worker:

- only accepts requests from the origins in `ALLOWED_ORIGINS` (in `wrangler.toml`);
- allows at most 10 questions per minute per visitor (IP address);
- takes only the conversation from the browser and sets everything else itself: the model (`claude-haiku-5-5`), the system prompt with the course material and law text, and the maximum answer length. The proxy can't be misused as a general-purpose Claude endpoint;
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

In the [Anthropic Console](https://console.anthropic.com) under Limits, set a monthly spending limit for the key (for example $5). With Haiku, one question costs about $0.0006 to $0.003, so that covers thousands of questions. Even if the site gets shared widely, you'll never pay more than the limit.

## Settings

- **Your own domain later:** add it to `ALLOWED_ORIGINS`, comma-separated, e.g. `"https://sir-disappointing.github.io,https://www.example.nl"`, then run `npx wrangler deploy` again.
- **Rate limit:** `limit` and `period` (in seconds) under `[[ratelimits]]` in `wrangler.toml`.
- **Course material changed:** run `node tools/build-assistant-context.js <theorie-mcp-package>` in the root of the site. That updates both `assistant-context.js` and `worker/src/context.js`. Then run `npx wrangler deploy` again.

## Without a proxy

If `proxyUrl` is empty, the assistant asks visitors for their own API key. It's stored only in their browser and sent directly to Anthropic.
