// Assistent: stel vragen over de theorie aan Claude Haiku.
//
// Twee manieren om Claude te bereiken:
//   - via de proxy (ASSISTANT_CONFIG.proxyUrl), die de sleutel van de site-eigenaar gebruikt;
//   - met een eigen API-sleutel van de bezoeker, die alleen in deze browser wordt bewaard.
// De SDK en de leerstof (wetteksten) worden pas geladen als iemand de assistent opent.
(function () {
  const MODEL = "claude-haiku-5-5";
  const KEY_STORE = "theorie-oefenen.anthropic-key";
  const MAX_HISTORY = 12; // berichten; de proxy accepteert er niet meer
  const config = window.ASSISTANT_CONFIG || {};
  const viaProxy = Boolean(config.proxyUrl);
  const SUGGESTIONS = [
    "Wie heeft voorrang op een gelijkwaardig kruispunt?",
    "Wat is het verschil tussen stilstaan en parkeren?",
    "Wanneer mag ik rechts inhalen?",
  ];

  const state = { open: false, busy: false, history: [], client: null, Anthropic: null };

  const readKey = () => {
    try {
      return localStorage.getItem(KEY_STORE) || "";
    } catch (e) {
      return "";
    }
  };
  const writeKey = (key) => {
    try {
      if (key) localStorage.setItem(KEY_STORE, key);
      else localStorage.removeItem(KEY_STORE);
    } catch (e) {
      // Geen opslag (privévenster): de sleutel geldt dan alleen voor deze pagina.
    }
    sessionKey = key;
  };
  let sessionKey = readKey();

  function el(tag, className, text) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  // Eenvoudige, veilige weergave: eerst alles escapen, dan **vet**, lijstjes en alinea's.
  function renderText(target, text) {
    const esc = text.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
    const blocks = esc.trim().split(/\n{2,}/).map((block) => {
      const lines = block.split("\n");
      if (lines.every((l) => /^\s*[-•]\s+/.test(l))) {
        return `<ul>${lines.map((l) => `<li>${l.replace(/^\s*[-•]\s+/, "")}</li>`).join("")}</ul>`;
      }
      return `<p>${lines.join("<br>")}</p>`;
    });
    target.innerHTML = blocks.join("").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  // ------------------------------------------------------------ opbouw

  const fab = el("button", "assistant-fab");
  fab.type = "button";
  fab.setAttribute("aria-expanded", "false");
  fab.setAttribute("aria-controls", "assistant-panel");
  fab.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/></svg><span>Vraag het</span>';

  const panel = el("section", "assistant hidden");
  panel.id = "assistant-panel";
  panel.setAttribute("aria-label", "Assistent");
  panel.innerHTML = `
    <header class="assistant-head">
      <div>
        <h2>Vraag het de assistent</h2>
        <p>Antwoorden komen van Claude (AI) en kunnen fouten bevatten.</p>
      </div>
      <button class="icon-btn" type="button" data-action="close" aria-label="Sluiten"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </header>
    <div class="assistant-body" aria-live="polite"></div>
    <form class="assistant-form">
      <label class="visually-hidden" for="assistant-input">Je vraag</label>
      <textarea id="assistant-input" rows="1" maxlength="2000" placeholder="Stel een vraag over de theorie…"></textarea>
      <button class="btn" type="submit">Stuur</button>
    </form>
    <footer class="assistant-foot"></footer>`;

  document.body.append(fab, panel);
  const body = panel.querySelector(".assistant-body");
  const form = panel.querySelector(".assistant-form");
  const input = panel.querySelector("textarea");
  const foot = panel.querySelector(".assistant-foot");

  function renderFoot() {
    foot.innerHTML = "";
    if (state.history.length) {
      const reset = el("button", "link", "Nieuw gesprek");
      reset.type = "button";
      reset.addEventListener("click", () => {
        state.history = [];
        renderWelcome();
      });
      foot.appendChild(reset);
    }
    if (!viaProxy && sessionKey) {
      const change = el("button", "link", "Sleutel wijzigen");
      change.type = "button";
      change.addEventListener("click", () => {
        writeKey("");
        state.client = null;
        renderWelcome();
      });
      foot.appendChild(change);
    }
  }

  function needsKey() {
    return !viaProxy && !sessionKey;
  }

  function renderKeyForm() {
    body.innerHTML = "";
    form.classList.add("hidden");
    const box = el("div", "assistant-key");
    box.appendChild(el("p", null, "De assistent gebruikt Claude van Anthropic. Vul je eigen API-sleutel in om vragen te stellen."));
    const f = el("form");
    const label = el("label", "field", "Anthropic API-sleutel");
    const key = el("input");
    key.type = "password";
    key.autocomplete = "off";
    key.placeholder = "sk-ant-…";
    label.appendChild(key);
    const save = el("button", "btn", "Opslaan");
    save.type = "submit";
    f.append(label, save);
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = key.value.trim();
      if (!v) return;
      writeKey(v);
      state.client = null;
      renderWelcome();
    });
    box.appendChild(f);
    box.appendChild(el("p", "small muted", "Je sleutel blijft in deze browser en gaat alleen naar Anthropic. Een sleutel maak je aan op console.anthropic.com. Stel daar ook een bestedingslimiet in."));
    body.appendChild(box);
    renderFoot();
    key.focus();
  }

  function renderWelcome() {
    if (needsKey()) return renderKeyForm();
    form.classList.remove("hidden");
    body.innerHTML = "";
    const intro = el("div", "assistant-msg from-assistant");
    renderText(intro, "Hoi! Stel me een vraag over verkeersregels, borden of het theorie-examen. Ik baseer me op de leerstof van deze site en de wettekst.");
    body.appendChild(intro);
    const chips = el("div", "assistant-suggestions");
    SUGGESTIONS.forEach((s) => {
      const b = el("button", "chip", s);
      b.type = "button";
      b.addEventListener("click", () => ask(s));
      chips.appendChild(b);
    });
    body.appendChild(chips);
    renderFoot();
  }

  function addMessage(role, text) {
    const m = el("div", `assistant-msg from-${role}`);
    if (role === "user") m.textContent = text;
    else renderText(m, text);
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
    return m;
  }

  // ------------------------------------------------------------ Claude

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error(`Kon ${src} niet laden`));
      document.head.appendChild(s);
    });
  }

  async function getClient() {
    if (state.client) return state.client;
    const mod = await import("./vendor/anthropic-sdk.js");
    state.Anthropic = mod.default;
    if (viaProxy) {
      // De proxy zet de echte sleutel erbij; deze waarde wordt daar genegeerd.
      state.client = new state.Anthropic({ baseURL: config.proxyUrl, apiKey: "via-proxy", dangerouslyAllowBrowser: true, maxRetries: 1 });
    } else {
      if (typeof ASSISTANT_CONTEXT === "undefined") await loadScript("assistant-context.js");
      state.client = new state.Anthropic({ apiKey: sessionKey, dangerouslyAllowBrowser: true });
    }
    return state.client;
  }

  function errorText(err) {
    const A = state.Anthropic;
    if (A && err instanceof A.AuthenticationError) return "Je API-sleutel klopt niet. Kies 'Sleutel wijzigen' en probeer het opnieuw.";
    if (A && err instanceof A.PermissionDeniedError) return "De assistent mag vanaf deze website niet gebruikt worden.";
    if (A && err instanceof A.RateLimitError) return err.error?.error?.message || "Je hebt veel vragen achter elkaar gesteld. Probeer het over een minuut opnieuw.";
    if (A && err instanceof A.APIConnectionError) return "Geen verbinding met de assistent. Controleer je internet en probeer het opnieuw.";
    if (A && err instanceof A.BadRequestError) return "Dit gesprek kon niet worden verwerkt. Begin een nieuw gesprek en probeer het opnieuw.";
    return "Er ging iets mis. Probeer het later opnieuw.";
  }

  async function ask(question) {
    const q = question.trim();
    if (!q || state.busy) return;
    state.busy = true;
    form.querySelector("button").disabled = true;
    body.querySelector(".assistant-suggestions")?.remove();

    state.history.push({ role: "user", content: q });
    addMessage("user", q);
    const answer = addMessage("assistant", "");
    answer.classList.add("is-typing");

    // Houd het gesprek kort: de laatste berichten, beginnend bij een vraag.
    let messages = state.history.slice(-MAX_HISTORY);
    if (messages[0].role !== "user") messages = messages.slice(1);

    let text = "";
    try {
      const client = await getClient();
      const params = { model: MODEL, max_tokens: 2000, output_config: { effort: "low" }, messages };
      // Met een eigen sleutel sturen we de leerstof zelf mee; de proxy doet dat aan zijn kant.
      if (!viaProxy) params.system = [{ type: "text", text: ASSISTANT_CONTEXT, cache_control: { type: "ephemeral" } }];
      const stream = client.messages.stream(params);
      stream.on("text", (delta) => {
        text += delta;
        answer.classList.remove("is-typing");
        renderText(answer, text);
        body.scrollTop = body.scrollHeight;
      });
      const final = await stream.finalMessage();
      if (final.stop_reason === "refusal") text = "Op deze vraag kan ik geen antwoord geven.";
      else if (final.stop_reason === "max_tokens") text += "\n\n(Het antwoord werd afgebroken. Vraag gerust om de rest.)";
      if (!text.trim()) text = "Ik heb hier geen antwoord op kunnen geven. Probeer je vraag anders te stellen.";
      renderText(answer, text);
      state.history.push({ role: "assistant", content: text });
    } catch (err) {
      console.error(err);
      state.history.pop(); // de vraag niet bewaren, zodat hij opnieuw gesteld kan worden
      answer.classList.add("is-error");
      renderText(answer, errorText(err));
    } finally {
      answer.classList.remove("is-typing");
      state.busy = false;
      form.querySelector("button").disabled = false;
      renderFoot();
      body.scrollTop = body.scrollHeight;
    }
  }

  // ------------------------------------------------------------ bediening

  function setOpen(open) {
    state.open = open;
    panel.classList.toggle("hidden", !open);
    fab.setAttribute("aria-expanded", String(open));
    fab.classList.toggle("is-open", open);
    if (open) {
      if (!body.childElementCount) renderWelcome();
      (needsKey() ? panel.querySelector(".assistant-key input") : input)?.focus();
    }
  }

  fab.addEventListener("click", () => setOpen(!state.open));
  panel.querySelector('[data-action="close"]').addEventListener("click", () => {
    setOpen(false);
    fab.focus();
  });
  panel.addEventListener("keydown", (e) => {
    // Toetsen in de assistent niet laten doorgaan naar de quiz (1–4, Enter).
    e.stopPropagation();
    if (e.key === "Escape") {
      setOpen(false);
      fab.focus();
    }
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value;
    input.value = "";
    input.style.height = "";
    ask(q);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
  });
})();
