// Proxy voor de assistent op Theorie Oefenen.
//
// De browser praat met deze Worker alsof het de Anthropic API is (POST /v1/messages, met streaming).
// De Worker:
//   - accepteert alleen verzoeken vanaf de eigen site (ALLOWED_ORIGINS),
//   - beperkt het aantal vragen per bezoeker (LIMITER, op IP-adres),
//   - neemt van de browser alleen het gesprek over: model, systeemprompt en lengte legt hij zelf vast,
//     zodat de proxy niet als gratis algemene Claude-toegang te misbruiken is,
//   - zet de API-sleutel er zelf bij (geheim ANTHROPIC_API_KEY).
import Anthropic from "@anthropic-ai/sdk";
import CONTEXT from "./context.js";

const MODEL = "claude-haiku-5-5";
const MAX_TOKENS = 2000;
const MAX_MESSAGES = 12;
const MAX_CHARS = 2000;

function corsHeaders(origin, request) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers") || "content-type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

// Foutmeldingen in dezelfde vorm als de Anthropic API, zodat de SDK in de browser ze herkent.
function apiError(status, type, message, headers = {}) {
  return new Response(JSON.stringify({ type: "error", error: { type, message } }), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

// Alleen een gewoon gesprek: afwisselend user/assistant, tekst, begint en eindigt bij de gebruiker.
function cleanMessages(messages) {
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > MAX_MESSAGES) return null;
  const out = [];
  for (const [i, m] of messages.entries()) {
    const role = i % 2 === 0 ? "user" : "assistant";
    if (!m || m.role !== role || typeof m.content !== "string") return null;
    const content = m.content.trim();
    if (!content || content.length > MAX_CHARS) return null;
    out.push({ role, content });
  }
  return out[out.length - 1].role === "user" ? out : null;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
    if (!allowed.includes(origin)) return apiError(403, "permission_error", "Niet toegestaan vanaf deze website.");
    const headers = corsHeaders(origin, request);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST" || new URL(request.url).pathname !== "/v1/messages") {
      return apiError(404, "not_found_error", "Onbekend adres.", headers);
    }

    const ip = request.headers.get("CF-Connecting-IP") || "onbekend";
    const { success } = await env.LIMITER.limit({ key: ip });
    if (!success) {
      return apiError(429, "rate_limit_error", "Je hebt veel vragen achter elkaar gesteld. Probeer het over een minuut opnieuw.", headers);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return apiError(400, "invalid_request_error", "Ongeldig verzoek.", headers);
    }
    const messages = cleanMessages(body && body.messages);
    if (!messages) return apiError(400, "invalid_request_error", "Ongeldig gesprek. Begin eventueel een nieuw gesprek.", headers);

    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    try {
      // De systeemprompt (wetteksten en leerstof) is elke keer gelijk en wordt dus gecachet.
      const upstream = await client.messages
        .create({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: [{ type: "text", text: CONTEXT, cache_control: { type: "ephemeral" } }],
          messages,
          output_config: { effort: "low" },
          stream: true,
        })
        .asResponse();
      return new Response(upstream.body, {
        status: upstream.status,
        headers: { ...headers, "Content-Type": "text/event-stream", "Cache-Control": "no-store" },
      });
    } catch (err) {
      if (err instanceof Anthropic.RateLimitError) {
        return apiError(429, "rate_limit_error", "De assistent is even druk. Probeer het zo opnieuw.", headers);
      }
      if (err instanceof Anthropic.APIError) {
        console.error("Anthropic API-fout", err.status, err.message);
        return apiError(502, "api_error", "De assistent is nu niet bereikbaar. Probeer het later opnieuw.", headers);
      }
      throw err;
    }
  },
};
