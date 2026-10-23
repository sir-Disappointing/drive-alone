// Instellingen voor de assistent.
// proxyUrl: het adres van je Cloudflare Worker (zie worker/README.md), bijvoorbeeld
//   "https://theorie-assistent.jouwnaam.workers.dev".
// Laat leeg om bezoekers hun eigen Anthropic API-sleutel te laten invullen.
// Let op: voeg het proxyadres ook toe aan connect-src in de Content-Security-Policy in index.html,
// anders blokkeert de browser de verbinding.
window.ASSISTANT_CONFIG = {
  proxyUrl: "",
};
