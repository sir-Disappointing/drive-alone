(function () {
  // Examenformat CBR auto (B) sinds 7 april 2025: 50 vragen, 30 minuten, 44 goed om te slagen.
  // Net als op het echte examen kun je terug en antwoorden wijzigen tot de tijd op is.
  const EXAM = { questions: 50, minutes: 30, passScore: 44 };
  const STORE_KEY = "theorie-oefenen.v1";
  const LETTERS = ["A", "B", "C", "D"];
  const MODE_NAMES = { practice: "Oefenen", mistakes: "Fouten herhalen", exam: "Examen" };

  const ICON_CHECK = '<svg class="mark" viewBox="0 0 24 24" role="img" aria-label="Goed"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const ICON_CROSS = '<svg class="mark" viewBox="0 0 24 24" role="img" aria-label="Fout"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const BADGE_OK = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="var(--green)"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const BADGE_BAD = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="var(--red)"/><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>';
  const BADGE_SKIP = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="var(--muted)" stroke-width="2"/><path d="M8 12h8" stroke="var(--muted)" stroke-width="2.4" stroke-linecap="round"/></svg>';
  const ICON_WARN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l10 18H2z"/><path d="M12 10v5"/><path d="M12 18h.01"/></svg>';

  const $ = (id) => document.getElementById(id);

  const state = {
    mode: null, // "exam" | "practice" | "mistakes"
    queue: [],
    index: 0,
    picks: [], // gekozen antwoord per vraag, of null
    locked: [], // oefenmodus: antwoord is nagekeken
    deadline: 0,
    timer: null,
    startedAt: 0,
    answers: [], // na afloop: { q, chosen, correct }
  };

  // ------------------------------------------------------------ opslag

  function loadStats() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveStats(stats) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(stats));
    } catch (e) {
      // Opslag niet beschikbaar (privévenster); de app werkt gewoon zonder.
    }
  }

  function record(results) {
    const stats = loadStats();
    results.forEach(({ id, correct }) => {
      const s = stats[id] || { right: 0, wrong: 0 };
      if (correct) s.right++;
      else s.wrong++;
      s.last = correct;
      stats[id] = s;
    });
    saveStats(stats);
  }

  function mistakeIds() {
    const stats = loadStats();
    return QUESTIONS.filter((q) => stats[q.id] && stats[q.id].last === false).map((q) => q.id);
  }

  // ------------------------------------------------------------ helpers

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Husselt de antwoorden zodat de positie van het juiste antwoord varieert.
  function prepare(q) {
    if (q.fixedOrder) return q;
    const order = shuffle(q.options.map((_, i) => i));
    return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) };
  }

  function el(tag, className, text) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function show(id) {
    ["menu", "learn", "quiz", "result"].forEach((s) => $(s).classList.toggle("hidden", s !== id));
    $("site-head").classList.toggle("hidden", id === "quiz" || id === "result");
    document.querySelectorAll(".tabs a").forEach((a) => {
      const active = a.dataset.view === id;
      a.classList.toggle("active", active);
      if (active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
  }

  // #leren toont het leergedeelte, al het andere het oefenmenu.
  function route() {
    if (!$("quiz").classList.contains("hidden")) return; // tijdens een quiz niet wegnavigeren
    if (location.hash === "#leren") {
      renderLearn();
      show("learn");
    } else {
      renderMenu();
      show("menu");
    }
  }

  function formatTime(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
  }

  const topics = () => [...new Set(QUESTIONS.map((q) => q.topic))];

  // ------------------------------------------------------------ menu

  function renderMenu() {
    const select = $("topic-select");
    const current = select.value;
    select.innerHTML = "";
    const all = el("option", null, "Alle onderwerpen");
    all.value = "";
    select.appendChild(all);
    topics().forEach((t) => {
      const o = el("option", null, `${t} (${QUESTIONS.filter((q) => q.topic === t).length})`);
      o.value = t;
      select.appendChild(o);
    });
    select.value = current;

    const pills = $("exam-pills");
    pills.innerHTML = "";
    [`${Math.min(EXAM.questions, QUESTIONS.length)} vragen`, `${EXAM.minutes} min`, `${EXAM.passScore} goed`].forEach((t) =>
      pills.appendChild(el("span", null, t))
    );

    const mistakes = mistakeIds().length;
    const mc = $("mistakes-count");
    mc.textContent = mistakes === 0 ? "Nog geen fouten om te herhalen" : `${mistakes} ${mistakes === 1 ? "vraag" : "vragen"} te gaan`;
    mc.classList.toggle("none", mistakes === 0);
    $("start-mistakes").disabled = mistakes === 0;

    const stats = loadStats();
    const seen = QUESTIONS.filter((q) => stats[q.id]);
    const lastRight = seen.filter((q) => stats[q.id].last).length;
    $("stat-seen").innerHTML = `${seen.length}<small>/${QUESTIONS.length}</small>`;
    $("stat-right").textContent = seen.length ? `${Math.round((lastRight / seen.length) * 100)}%` : "–";
    $("reset").classList.toggle("hidden", seen.length === 0);

    // Voortgang per onderwerp, zwakste eerst.
    const bars = $("topic-progress");
    bars.innerHTML = "";
    const perTopic = topics()
      .map((t) => {
        const qs = seen.filter((q) => q.topic === t);
        return { t, n: qs.length, pct: qs.length ? Math.round((qs.filter((q) => stats[q.id].last).length / qs.length) * 100) : 0 };
      })
      .filter((x) => x.n > 0)
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 5);
    if (!perTopic.length) {
      bars.appendChild(el("p", "empty-note", "Oefen een paar vragen, dan zie je hier per onderwerp hoe het gaat."));
    }
    perTopic.forEach(({ t, pct }) => {
      const row = el("div", "topic-bar");
      const track = el("div", "track");
      const fill = el("div", `fill${pct < 60 ? " low" : ""}`);
      fill.style.width = `${pct}%`;
      track.appendChild(fill);
      row.append(el("span", "name", t), track, el("span", "pct", `${pct}%`));
      bars.appendChild(row);
    });

    const facts = $("facts");
    facts.innerHTML = "";
    LEARN.highlights.forEach((f) => {
      const box = el("div", "fact");
      box.append(el("div", "fact-value", f.value), el("div", "fact-label", f.label));
      facts.appendChild(box);
    });
  }

  // ------------------------------------------------------------ quiz

  function start(mode) {
    let pool;
    if (mode === "exam") {
      pool = shuffle(QUESTIONS).slice(0, EXAM.questions);
    } else if (mode === "mistakes") {
      const ids = new Set(mistakeIds());
      pool = shuffle(QUESTIONS.filter((q) => ids.has(q.id)));
    } else {
      const topic = $("topic-select").value;
      const count = $("count-select").value;
      pool = shuffle(QUESTIONS.filter((q) => !topic || q.topic === topic));
      if (count !== "all") pool = pool.slice(0, parseInt(count, 10));
    }
    if (!pool.length) return;

    state.mode = mode;
    state.queue = pool.map(prepare);
    state.index = 0;
    state.picks = state.queue.map(() => null);
    state.locked = state.queue.map(() => false);
    state.answers = [];
    state.startedAt = Date.now();

    clearInterval(state.timer);
    const exam = mode === "exam";
    $("timer").classList.toggle("hidden", !exam);
    $("mode-pill").classList.toggle("hidden", exam);
    $("mode-pill").textContent = MODE_NAMES[mode];
    $("prev").classList.toggle("hidden", !exam);
    $("steps").style.gridTemplateColumns = `repeat(${state.queue.length}, minmax(0, 1fr))`;
    if (exam) {
      state.deadline = Date.now() + EXAM.minutes * 60 * 1000;
      tick();
      state.timer = setInterval(tick, 500);
    }

    show("quiz");
    renderQuestion();
  }

  function tick() {
    const left = state.deadline - Date.now();
    $("timer").textContent = formatTime(left);
    $("timer").classList.toggle("urgent", left < 5 * 60 * 1000);
    if (left <= 0) finish(true);
  }

  function renderSteps() {
    const steps = $("steps");
    steps.innerHTML = "";
    state.queue.forEach((q, i) => {
      let cls = "";
      if (i === state.index) cls = "current";
      else if (state.mode === "exam") cls = state.picks[i] !== null ? "given" : "";
      else if (state.locked[i]) cls = state.picks[i] === q.answer ? "right" : "wrong";

      if (state.mode === "exam") {
        const b = el("button", cls);
        b.type = "button";
        b.setAttribute("aria-label", `Ga naar vraag ${i + 1}`);
        b.tabIndex = -1;
        b.addEventListener("click", () => goTo(i));
        steps.appendChild(b);
      } else {
        steps.appendChild(el("span", cls));
      }
    });
  }

  function renderQuestion() {
    const q = state.queue[state.index];
    const last = state.index === state.queue.length - 1;

    $("qnum").innerHTML = `${state.index + 1} <small>/ ${state.queue.length}</small>`;
    $("topic").textContent = q.topic;

    const sign = $("sign");
    sign.innerHTML = q.sign && SIGNS[q.sign] ? SIGNS[q.sign] : "";
    sign.classList.toggle("hidden", !sign.innerHTML);

    $("question").textContent = q.question;
    $("feedback").classList.add("hidden");
    $("prev").disabled = state.index === 0;
    $("next").textContent = last ? "Afronden" : "Volgende";
    $("next").disabled = state.mode !== "exam" && !state.locked[state.index];

    const wrap = $("options");
    wrap.innerHTML = "";
    q.options.forEach((text, i) => {
      const b = el("button", "option");
      b.type = "button";
      b.append(el("span", "letter", LETTERS[i]), el("span", "text", text));
      b.addEventListener("click", () => choose(i));
      wrap.appendChild(b);
    });

    if (state.mode === "exam") paintSelection();
    renderSteps();
    $("question").focus({ preventScroll: true });
  }

  function paintSelection() {
    Array.from($("options").children).forEach((b, n) => b.classList.toggle("selected", n === state.picks[state.index]));
  }

  function choose(i) {
    const q = state.queue[state.index];
    if (i >= q.options.length || state.locked[state.index]) return;
    state.picks[state.index] = i;

    if (state.mode === "exam") {
      paintSelection();
      renderSteps();
      return;
    }

    // Oefenen: direct nakijken.
    state.locked[state.index] = true;
    const correct = i === q.answer;
    record([{ id: q.id, correct }]);

    Array.from($("options").children).forEach((b, n) => {
      b.disabled = true;
      if (n === q.answer) {
        b.classList.add("correct");
        b.insertAdjacentHTML("beforeend", ICON_CHECK);
      } else if (n === i) {
        b.classList.add("wrong");
        b.insertAdjacentHTML("beforeend", ICON_CROSS);
      } else {
        b.classList.add("dim");
      }
    });

    const fb = $("feedback");
    fb.className = `feedback ${correct ? "ok" : "bad"}`;
    fb.innerHTML = "";
    const title = el("div", "feedback-title");
    title.innerHTML = correct ? BADGE_OK : BADGE_BAD;
    title.appendChild(el("span", null, correct ? "Goed!" : "Fout"));
    fb.append(title, el("p", null, q.explanation));

    $("next").disabled = false;
    renderSteps();
    $("next").focus({ preventScroll: true });
  }

  function goTo(i) {
    if (i < 0 || i >= state.queue.length) return;
    state.index = i;
    renderQuestion();
  }

  function next() {
    if ($("next").disabled) return;
    if (state.index < state.queue.length - 1) return goTo(state.index + 1);

    if (state.mode === "exam") {
      const open = state.picks.filter((p) => p === null).length;
      if (open && !confirm(`Je hebt ${open} ${open === 1 ? "vraag" : "vragen"} nog niet beantwoord. Toch afronden?`)) return;
    }
    finish(false);
  }

  function quit() {
    const msg =
      state.mode === "exam"
        ? "Weet je zeker dat je het examen wilt stoppen? Je ziet dan de uitslag; onbeantwoorde vragen tellen als fout."
        : "Stoppen en je resultaat bekijken?";
    if (!confirm(msg)) return;
    const anything = state.mode === "exam" ? state.picks.some((p) => p !== null) : state.locked.some(Boolean);
    if (anything) finish(false);
    else {
      clearInterval(state.timer);
      $("quiz").classList.add("hidden");
      route();
    }
  }

  // ------------------------------------------------------------ resultaat

  function finish(timedOut) {
    clearInterval(state.timer);
    const exam = state.mode === "exam";

    // Examen: alle vragen tellen, onbeantwoord is fout. Oefenen: alleen wat je hebt beantwoord.
    state.answers = state.queue
      .map((q, i) => ({ q, chosen: state.picks[i], correct: state.picks[i] === q.answer, n: i + 1 }))
      .filter((a, i) => exam || state.locked[i]);
    if (exam) record(state.answers.filter((a) => a.chosen !== null).map((a) => ({ id: a.q.id, correct: a.correct })));

    const total = state.answers.length;
    const right = state.answers.filter((a) => a.correct).length;
    const wrong = total - right;

    const verdict = $("verdict");
    const notes = [];
    if (exam) {
      const passed = state.queue.length === EXAM.questions && right >= EXAM.passScore;
      verdict.className = `verdict ${passed ? "ok" : "bad"}`;
      verdict.textContent = passed ? "Geslaagd" : "Gezakt";
      if (timedOut) notes.push("De tijd is op.");
      const open = state.answers.filter((a) => a.chosen === null).length;
      if (open) notes.push(`${open} ${open === 1 ? "vraag" : "vragen"} niet beantwoord (telt als fout).`);
      const used = formatTime(Math.min(Date.now() - state.startedAt, EXAM.minutes * 60 * 1000));
      notes.push(`Tijd gebruikt: ${used}. Nodig om te slagen: ${EXAM.passScore} van ${EXAM.questions} goed.`);
    } else {
      verdict.className = "verdict";
      verdict.textContent = MODE_NAMES[state.mode];
    }
    $("result-note").textContent = notes.join(" ");
    $("score").textContent = `${right} van ${total} goed`;
    $("score-detail").textContent = `${wrong} ${wrong === 1 ? "fout" : "fouten"} · ${total ? Math.round((right / total) * 100) : 0}%`;

    $("only-wrong").checked = wrong > 0;
    renderReview();
    show("result");
  }

  function renderReview() {
    const onlyWrong = $("only-wrong").checked;
    const review = $("review");
    review.innerHTML = "";
    const items = state.answers.filter((a) => !onlyWrong || !a.correct);
    if (!items.length) {
      review.appendChild(el("p", "empty", onlyWrong ? "Geen fouten. Goed gedaan!" : "Geen vragen beantwoord."));
      return;
    }
    items.forEach((a) => {
      const item = el("article", "review-item");
      const icon = el("span", "review-icon");
      icon.innerHTML = a.correct ? BADGE_OK : a.chosen === null ? BADGE_SKIP : BADGE_BAD;
      const body = el("div");
      body.appendChild(el("p", "review-q", `${a.n}. ${a.q.question}`));
      if (!a.correct) {
        body.appendChild(el("p", "wrong-line", a.chosen === null ? "Niet beantwoord" : `Jouw antwoord: ${a.q.options[a.chosen]}`));
      }
      body.appendChild(el("p", "right-line", `Juiste antwoord: ${a.q.options[a.q.answer]}`));
      body.appendChild(el("p", "review-expl", a.q.explanation));
      item.append(icon, body);
      review.appendChild(item);
    });
  }

  // ------------------------------------------------------------ leren

  const learn = { chip: "all" };

  function renderLearnChips() {
    const chips = $("learn-chips");
    chips.innerHTML = "";
    const items = [["all", "Alles"], ["spiek", "Spiekbriefje"]].concat(LEARN.topics.map((t) => [t.topic, t.topic]));
    items.forEach(([value, label]) => {
      const b = el("button", "chip", label);
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(learn.chip === value));
      b.addEventListener("click", () => {
        learn.chip = value;
        $("learn-search").value = "";
        renderLearn();
      });
      chips.appendChild(b);
    });
  }

  function matches(query, ...texts) {
    return !query || texts.some((t) => t && t.toLowerCase().includes(query));
  }

  function renderCheatsheet(query) {
    const groups = LEARN.cheatsheet
      .map((g) => ({ ...g, rows: g.rows.filter(([a, b]) => matches(query, g.title, a, b)) }))
      .filter((g) => g.rows.length);
    if (!groups.length) return null;

    const card = el("section", "cheatsheet");
    const head = el("div", "cheatsheet-head");
    head.append(el("h2", null, "Spiekbriefje"), el("span", null, "Getallen die je zeker moet kennen"));
    card.appendChild(head);
    const grid = el("div", "cheat-grid");
    groups.forEach((g) => {
      const box = el("div", "cheat-group");
      box.appendChild(el("h3", null, g.title));
      const dl = el("dl");
      g.rows.forEach(([label, value]) => {
        const row = el("div", "cheat-row");
        row.append(el("dt", null, label), el("dd", null, value));
        dl.appendChild(row);
      });
      box.appendChild(dl);
      grid.appendChild(box);
    });
    card.appendChild(grid);
    return card;
  }

  function renderTopic(t, query) {
    const rules = t.rules.filter((r) => matches(query, t.topic, r.title, r.text, r.warn));
    const thumbs = (t.thumbs || []).filter((s) => matches(query, t.topic, s));
    if (!rules.length && !thumbs.length) return null;

    const card = el("section", "card topic-card");
    const head = el("div", "topic-card-head");
    head.appendChild(el("h2", null, t.topic));
    if (QUESTIONS.some((q) => q.topic === t.topic)) {
      const b = el("button", "btn btn-soft", `Oefen ${t.topic.toLowerCase()} →`);
      b.type = "button";
      b.addEventListener("click", () => {
        renderMenu();
        $("topic-select").value = t.topic;
        $("count-select").value = "10";
        start("practice");
      });
      head.appendChild(b);
    }
    card.appendChild(head);
    if (t.intro && !query) card.appendChild(el("p", "intro", t.intro));

    if (rules.length) {
      const grid = el("div", "rules");
      rules.forEach((r) => {
        const rule = el("div", "rule");
        if (r.sign && SIGNS[r.sign]) {
          const s = el("div", "rule-sign");
          s.innerHTML = SIGNS[r.sign];
          rule.appendChild(s);
        }
        const body = el("div");
        body.append(el("h3", null, r.title), el("p", null, r.text));
        if (r.warn) {
          const w = el("p", "warn");
          w.innerHTML = ICON_WARN;
          const span = el("span");
          span.append(el("strong", null, "Let op: "), document.createTextNode(r.warn));
          w.appendChild(span);
          body.appendChild(w);
        }
        rule.appendChild(body);
        grid.appendChild(rule);
      });
      card.appendChild(grid);
    }

    if (thumbs.length) {
      const box = el("div", "thumbs");
      box.appendChild(el("h3", null, "Vuistregels"));
      const ul = el("ul");
      thumbs.forEach((s) => ul.appendChild(el("li", null, s)));
      box.appendChild(ul);
      card.appendChild(box);
    }
    return card;
  }

  function renderLearn() {
    renderLearnChips();
    const query = $("learn-search").value.trim().toLowerCase();
    const content = $("learn-content");
    content.innerHTML = "";

    // Bij zoeken doorzoek je alles, ongeacht het gekozen onderwerp.
    const chip = query ? "all" : learn.chip;
    const parts = [];
    if (chip === "all" || chip === "spiek") parts.push(renderCheatsheet(query));
    if (chip !== "spiek") {
      LEARN.topics.filter((t) => chip === "all" || t.topic === chip).forEach((t) => parts.push(renderTopic(t, query)));
    }

    const found = parts.filter(Boolean);
    if (!found.length) {
      content.appendChild(el("p", "empty", `Niets gevonden voor "${$("learn-search").value.trim()}".`));
      return;
    }
    found.forEach((p) => content.appendChild(p));
  }

  // ------------------------------------------------------------ init

  function onKey(e) {
    if ($("quiz").classList.contains("hidden")) return;
    if (e.target.tagName === "SELECT" || e.metaKey || e.ctrlKey || e.altKey) return;
    const key = e.key.toUpperCase();
    const idx = "1234".includes(key) && key.length === 1 ? "1234".indexOf(key) : LETTERS.indexOf(key);
    if (idx >= 0) {
      e.preventDefault();
      choose(idx);
    } else if (e.key === "Enter" && e.target.tagName !== "BUTTON") {
      e.preventDefault();
      next();
    } else if (state.mode === "exam" && e.key === "ArrowLeft") {
      goTo(state.index - 1);
    } else if (state.mode === "exam" && e.key === "ArrowRight") {
      goTo(state.index + 1);
    }
  }

  function init() {
    $("start-exam").addEventListener("click", () => start("exam"));
    $("start-practice").addEventListener("click", () => start("practice"));
    $("start-mistakes").addEventListener("click", () => start("mistakes"));
    $("next").addEventListener("click", next);
    $("prev").addEventListener("click", () => goTo(state.index - 1));
    $("quit").addEventListener("click", quit);
    $("only-wrong").addEventListener("change", renderReview);
    $("again").addEventListener("click", () => start(state.mode === "mistakes" && !mistakeIds().length ? "practice" : state.mode));
    $("to-menu").addEventListener("click", () => {
      history.replaceState(null, "", "#oefenen");
      $("result").classList.add("hidden");
      route();
    });
    $("reset").addEventListener("click", () => {
      if (!confirm("Al je opgeslagen voortgang wissen?")) return;
      saveStats({});
      renderMenu();
    });
    $("learn-search").addEventListener("input", renderLearn);
    window.addEventListener("hashchange", route);
    document.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", (e) => {
      if (state.mode === "exam" && !$("quiz").classList.contains("hidden")) e.preventDefault();
    });
    $("year").textContent = new Date().getFullYear();
    route();
  }

  init();
})();
