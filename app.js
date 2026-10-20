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
  // Bij tapvragen worden de antwoorden de voertuigen uit de tekening.
  function prepare(q) {
    const type = q.type || "choice";
    if (type === "tap") {
      const ids = q.scene.vehicles.map((v) => v.id);
      const label = (v) => (v.me ? "Jij" : v.name ? `${v.id} (${v.name})` : v.id);
      return { ...q, optionIds: ids, options: q.scene.vehicles.map(label), answer: ids.indexOf(q.answer) };
    }
    if (type === "number" || type === "order" || q.fixedOrder) return q;
    const order = shuffle(q.options.map((_, i) => i));
    const options = order.map((i) => q.options[i]);
    if (type === "multi") return { ...q, options, answer: q.answer.map((a) => order.indexOf(a)).sort() };
    return { ...q, options, answer: order.indexOf(q.answer) };
  }

  function el(tag, className, text) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function show(id) {
    ["menu", "learn", "signs", "quiz", "result"].forEach((s) => $(s).classList.toggle("hidden", s !== id));
    $("site-head").classList.toggle("hidden", id === "quiz" || id === "result");
    document.querySelectorAll(".tabs a").forEach((a) => {
      const active = a.dataset.view === id;
      a.classList.toggle("active", active);
      if (active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
  }

  // #leren toont het leergedeelte, #borden (of #borden/B6) de borden, al het andere het oefenmenu.
  function route() {
    if (!$("quiz").classList.contains("hidden")) return; // tijdens een quiz niet wegnavigeren
    const [page, code] = location.hash.slice(1).split("/");
    if (page === "leren") {
      closeSign();
      renderLearn();
      show("learn");
    } else if (page === "borden") {
      if ($("signs").classList.contains("hidden")) {
        renderSigns();
        show("signs");
      }
      if (code) openSign(decodeURIComponent(code));
      else closeSign();
    } else {
      closeSign();
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

  // ------------------------------------------------------------ vraagtypen
  // choice: één antwoord (standaard). multi: meerdere antwoorden kunnen goed zijn. number: getal invullen.
  // tap: kies een voertuig in de tekening. order: zet de voertuigen in de volgorde waarin ze mogen rijden.

  const HINTS = {
    multi: "Meerdere antwoorden kunnen goed zijn.",
    number: "Typ het getal.",
    tap: "Tik op het voertuig in de tekening, of kies hieronder.",
    order: "Tik de weggebruikers aan in de volgorde waarin ze mogen rijden.",
  };

  const typeOf = (q) => q.type || "choice";
  // Bij oefenen worden choice- en tapvragen direct nagekeken; de rest na "Controleer".
  const instant = (q) => typeOf(q) === "choice" || typeOf(q) === "tap";

  function vehicleLabel(q, id) {
    const v = q.scene && q.scene.vehicles.find((x) => x.id === id);
    if (!v) return id;
    if (v.me) return "Jij";
    return v.name ? `${v.id} (${v.name})` : v.id;
  }

  const orderIds = (q) => q.scene.vehicles.map((v) => v.id).filter((id) => q.answer.includes(id));

  function answered(q, pick) {
    if (pick === null || pick === undefined) return false;
    switch (typeOf(q)) {
      case "multi":
        return pick.length > 0;
      case "number":
        return pick !== "" && !Number.isNaN(Number(String(pick).replace(",", ".")));
      case "order":
        return pick.length === q.answer.length;
      default:
        return true;
    }
  }

  function isCorrect(q, pick) {
    if (!answered(q, pick)) return false;
    switch (typeOf(q)) {
      case "multi":
        return pick.length === q.answer.length && q.answer.every((i) => pick.includes(i));
      case "number":
        return Number(String(pick).replace(",", ".")) === q.answer;
      case "order":
        return pick.join() === q.answer.join();
      default:
        return pick === q.answer;
    }
  }

  function answerText(q, pick) {
    switch (typeOf(q)) {
      case "multi":
        return pick.map((i) => q.options[i]).join(", ");
      case "number":
        return `${pick}${q.unit ? " " + q.unit : ""}`;
      case "order":
        return pick.map((id) => vehicleLabel(q, id)).join(" → ");
      default:
        return q.options[pick];
    }
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
      else if (state.mode === "exam") cls = answered(q, state.picks[i]) ? "given" : "";
      else if (state.locked[i]) cls = isCorrect(q, state.picks[i]) ? "right" : "wrong";

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
    const type = typeOf(q);

    $("qnum").innerHTML = `${state.index + 1} <small>/ ${state.queue.length}</small>`;
    $("topic").textContent = q.topic;

    const sign = $("sign");
    sign.innerHTML = q.sign ? signMarkup(q.sign) : "";
    sign.classList.toggle("hidden", !sign.innerHTML);

    const scene = $("scene");
    scene.innerHTML = q.scene ? SCENES.render(q.scene) : "";
    scene.classList.toggle("hidden", !q.scene);
    const clickable = q.scene && (type === "tap" || type === "order");
    scene.classList.toggle("clickable", Boolean(clickable));
    if (clickable) {
      scene.querySelectorAll(".scene-vehicle, .scene-label").forEach((g) =>
        g.addEventListener("click", () => {
          if (type === "tap") choose(q.optionIds.indexOf(g.dataset.id));
          else addOrder(g.dataset.id);
        })
      );
    }

    $("question").textContent = q.question;
    $("qhint").textContent = HINTS[type] || "";
    $("feedback").classList.add("hidden");
    $("prev").disabled = state.index === 0;

    renderAnswerInput(q);
    updateNext();
    renderSteps();
    $("question").focus({ preventScroll: true });
  }

  function renderAnswerInput(q) {
    const type = typeOf(q);
    const wrap = $("options");
    wrap.innerHTML = "";
    wrap.className = `options type-${type}`;

    if (type === "number") {
      const box = el("label", "number-input");
      const input = el("input");
      input.type = "text";
      input.inputMode = "decimal";
      input.id = "number-answer";
      input.autocomplete = "off";
      input.setAttribute("aria-label", "Je antwoord");
      input.value = state.picks[state.index] === null ? "" : state.picks[state.index];
      input.addEventListener("input", () => {
        const v = input.value.trim();
        state.picks[state.index] = v === "" ? null : v;
        updateNext();
        renderSteps();
      });
      box.appendChild(input);
      if (q.unit) box.appendChild(el("span", "unit", q.unit));
      wrap.appendChild(box);
      return;
    }

    if (type === "order") {
      const slots = el("div", "order-slots");
      slots.id = "order-slots";
      const chips = el("div", "order-chips");
      orderIds(q).forEach((id) => {
        const b = el("button", "order-chip", vehicleLabel(q, id));
        b.type = "button";
        b.dataset.id = id;
        b.addEventListener("click", () => addOrder(id));
        chips.appendChild(b);
      });
      const reset = el("button", "link order-reset", "Opnieuw kiezen");
      reset.type = "button";
      reset.id = "order-reset";
      reset.addEventListener("click", resetOrder);
      wrap.append(slots, chips, reset);
      paintOrder();
      return;
    }

    q.options.forEach((text, i) => {
      const b = el("button", "option");
      b.type = "button";
      if (type === "multi") b.setAttribute("aria-pressed", "false");
      b.append(el("span", "letter", LETTERS[i]), el("span", "text", text));
      b.addEventListener("click", () => choose(i));
      wrap.appendChild(b);
    });
    paintSelection();
  }

  function paintSelection() {
    const q = state.queue[state.index];
    const pick = state.picks[state.index];
    const multi = typeOf(q) === "multi";
    $("options").querySelectorAll(".option").forEach((b, n) => {
      const on = multi ? (pick || []).includes(n) : n === pick;
      b.classList.toggle("selected", on);
      if (multi) b.setAttribute("aria-pressed", String(on));
    });
    if (typeOf(q) === "tap") {
      $("scene").querySelectorAll(".scene-label").forEach((l) =>
        l.classList.toggle("is-picked", pick !== null && l.dataset.id === q.optionIds[pick])
      );
    }
  }

  function updateNext() {
    const q = state.queue[state.index];
    const i = state.index;
    const btn = $("next");
    if (state.mode !== "exam" && !state.locked[i] && !instant(q)) {
      btn.textContent = "Controleer";
      btn.disabled = !answered(q, state.picks[i]);
      return;
    }
    btn.textContent = i === state.queue.length - 1 ? "Afronden" : "Volgende";
    btn.disabled = state.mode !== "exam" && !state.locked[i];
  }

  function choose(n) {
    const i = state.index;
    const q = state.queue[i];
    const type = typeOf(q);
    if (state.locked[i] || n < 0 || n >= (q.options || []).length || type === "number" || type === "order") return;

    if (type === "multi") {
      const pick = state.picks[i] ? state.picks[i].slice() : [];
      const at = pick.indexOf(n);
      if (at >= 0) pick.splice(at, 1);
      else pick.push(n);
      state.picks[i] = pick.length ? pick.sort() : null;
      paintSelection();
      updateNext();
      renderSteps();
      return;
    }

    state.picks[i] = n;
    if (state.mode === "exam") {
      paintSelection();
      renderSteps();
      return;
    }
    check();
  }

  function addOrder(id) {
    const i = state.index;
    const q = state.queue[i];
    if (state.locked[i] || !q.answer.includes(id)) return;
    const pick = state.picks[i] ? state.picks[i].slice() : [];
    if (pick.includes(id) || pick.length >= q.answer.length) return;
    pick.push(id);
    state.picks[i] = pick;
    paintOrder();
    updateNext();
    renderSteps();
  }

  function resetOrder() {
    if (state.locked[state.index]) return;
    state.picks[state.index] = null;
    paintOrder();
    updateNext();
    renderSteps();
  }

  function paintOrder() {
    const i = state.index;
    const q = state.queue[i];
    const pick = state.picks[i] || [];
    const slots = $("order-slots");
    slots.innerHTML = "";
    q.answer.forEach((_, n) => {
      const slot = el("span", `order-slot${pick[n] ? " filled" : ""}`);
      slot.append(el("small", null, String(n + 1)), document.createTextNode(pick[n] ? vehicleLabel(q, pick[n]) : ""));
      slots.appendChild(slot);
    });
    $("options").querySelectorAll(".order-chip").forEach((b) => (b.disabled = state.locked[i] || pick.includes(b.dataset.id)));
    $("order-reset").disabled = state.locked[i] || !pick.length;
    $("scene").querySelectorAll(".scene-label").forEach((l) => l.classList.toggle("is-picked", pick.includes(l.dataset.id)));
  }

  // Nakijken in de oefenmodus.
  function check() {
    const i = state.index;
    const q = state.queue[i];
    const pick = state.picks[i];
    if (state.locked[i] || !answered(q, pick)) return;
    state.locked[i] = true;
    const correct = isCorrect(q, pick);
    record([{ id: q.id, correct }]);
    markAnswer(q, pick);

    const fb = $("feedback");
    fb.className = `feedback ${correct ? "ok" : "bad"}`;
    fb.innerHTML = "";
    const title = el("div", "feedback-title");
    title.innerHTML = correct ? BADGE_OK : BADGE_BAD;
    title.appendChild(el("span", null, correct ? "Goed!" : "Fout"));
    fb.appendChild(title);
    if (!correct && !instant(q) && typeOf(q) !== "multi") {
      fb.appendChild(el("p", "feedback-answer", `Juiste antwoord: ${answerText(q, q.answer)}`));
    }
    fb.appendChild(el("p", null, q.explanation));

    updateNext();
    renderSteps();
    $("next").focus({ preventScroll: true });
  }

  function markAnswer(q, pick) {
    const type = typeOf(q);
    if (type === "number") {
      const input = $("number-answer");
      input.disabled = true;
      input.parentElement.classList.add(isCorrect(q, pick) ? "correct" : "wrong");
      return;
    }
    if (type === "order") {
      paintOrder();
      $("order-slots").classList.add(isCorrect(q, pick) ? "correct" : "wrong");
      return;
    }
    $("options").querySelectorAll(".option").forEach((b, n) => {
      b.disabled = true;
      b.classList.remove("selected");
      const right = type === "multi" ? q.answer.includes(n) : n === q.answer;
      const picked = type === "multi" ? pick.includes(n) : n === pick;
      if (right) {
        b.classList.add("correct");
        b.insertAdjacentHTML("beforeend", ICON_CHECK);
      } else if (picked) {
        b.classList.add("wrong");
        b.insertAdjacentHTML("beforeend", ICON_CROSS);
      } else {
        b.classList.add("dim");
      }
    });
    if (type === "tap") {
      $("scene").querySelectorAll(".scene-label").forEach((l) => l.classList.toggle("is-answer", l.dataset.id === q.optionIds[q.answer]));
    }
  }

  function goTo(i) {
    if (i < 0 || i >= state.queue.length) return;
    state.index = i;
    renderQuestion();
  }

  function next() {
    if ($("next").disabled) return;
    const q = state.queue[state.index];
    if (state.mode !== "exam" && !state.locked[state.index] && !instant(q)) return check();
    if (state.index < state.queue.length - 1) return goTo(state.index + 1);

    if (state.mode === "exam") {
      const open = state.queue.filter((x, i) => !answered(x, state.picks[i])).length;
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
    const anything = state.mode === "exam" ? state.queue.some((q, i) => answered(q, state.picks[i])) : state.locked.some(Boolean);
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
      .map((q, i) => ({
        q,
        chosen: answered(q, state.picks[i]) ? state.picks[i] : null,
        correct: isCorrect(q, state.picks[i]),
        n: i + 1,
      }))
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
        body.appendChild(el("p", "wrong-line", a.chosen === null ? "Niet beantwoord" : `Jouw antwoord: ${answerText(a.q, a.chosen)}`));
      }
      body.appendChild(el("p", "right-line", `Juiste antwoord: ${answerText(a.q, a.q.answer)}`));
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
        if (r.sign) {
          const s = el("div", "rule-sign");
          s.innerHTML = signMarkup(r.sign);
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

  // ------------------------------------------------------------ borden

  const signsView = { series: "all" };
  const noteFor = (code) => SIGN_NOTES[code] || null;
  const seriesOf = (code) => code.match(/^[A-Z]/)[0];
  const signByCode = (code) => SIGN_DATA.find((s) => s.code === code);

  function visibleSigns() {
    const query = $("sign-search").value.trim().toLowerCase();
    const examOnly = $("sign-exam-only").checked;
    return SIGN_DATA.filter((s) => {
      const note = noteFor(s.code);
      if (examOnly && !(note && note.exam)) return false;
      if (query) {
        const text = [s.code, s.name, note && note.short, note && note.meaning].join(" ").toLowerCase();
        return text.includes(query);
      }
      return signsView.series === "all" || seriesOf(s.code) === signsView.series;
    });
  }

  function renderSignChips() {
    const chips = $("sign-chips");
    chips.innerHTML = "";
    [["all", "Alle"]].concat(Object.entries(SIGN_SERIES).map(([k, v]) => [k, v.name])).forEach(([value, label]) => {
      const b = el("button", "chip");
      if (value !== "all") b.appendChild(el("span", "series-code", value));
      b.appendChild(document.createTextNode(label));
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(signsView.series === value));
      b.addEventListener("click", () => {
        signsView.series = value;
        $("sign-search").value = "";
        renderSigns();
      });
      chips.appendChild(b);
    });
  }

  function signCard(s) {
    const note = noteFor(s.code);
    const card = el("a", "sign-card");
    card.href = `#borden/${encodeURIComponent(s.code)}`;
    const img = el("div", "sign-card-img");
    img.innerHTML = signMarkup(s.code);
    card.appendChild(img);
    const label = el("div", "sign-card-label");
    label.appendChild(el("span", "sign-code", s.code));
    if (note && note.exam) {
      const dot = el("span", "exam-dot");
      dot.title = "Examenbelangrijk";
      label.appendChild(dot);
    }
    card.appendChild(label);
    card.appendChild(el("span", "sign-card-name", note ? note.short : s.name));
    return card;
  }

  function renderSigns() {
    renderSignChips();
    const list = $("sign-list");
    list.innerHTML = "";
    const signs = visibleSigns();
    if (!signs.length) {
      list.appendChild(el("p", "empty", "Geen borden gevonden."));
      return;
    }
    const searching = $("sign-search").value.trim() !== "";
    const groups = {};
    signs.forEach((s) => (groups[seriesOf(s.code)] = groups[seriesOf(s.code)] || []).push(s));
    Object.keys(SIGN_SERIES)
      .filter((k) => groups[k])
      .forEach((k) => {
        const section = el("section", "sign-group");
        const head = el("div", "sign-group-head");
        const h2 = el("h2");
        h2.append(el("span", "series-code", k), document.createTextNode(SIGN_SERIES[k].name));
        head.append(h2, el("span", "sign-count", `${groups[k].length}`));
        section.appendChild(head);
        if (!searching) section.appendChild(el("p", "sign-group-intro", SIGN_SERIES[k].intro));
        const grid = el("div", "sign-grid");
        groups[k].forEach((s) => grid.appendChild(signCard(s)));
        section.appendChild(grid);
        list.appendChild(section);
      });
  }

  function openSign(code) {
    const s = signByCode(code);
    if (!s) return;
    const note = noteFor(code);
    const series = SIGN_SERIES[seriesOf(code)];

    $("sd-series").innerHTML = "";
    $("sd-series").append(el("span", "series-code", seriesOf(code)), document.createTextNode(series.name));
    $("sd-image").innerHTML = signMarkup(code);
    $("sd-code").textContent = `Bord ${code}${note && note.exam ? " – examenbelangrijk" : ""}`;
    $("sd-title").textContent = note ? note.short : s.name;
    $("sd-official").textContent = note ? `Officieel: ${s.name}` : "";
    $("sd-meaning").textContent = note ? note.meaning : "Voor dit bord hebben we nog geen extra uitleg. De officiële omschrijving staat hierboven.";

    const tips = $("sd-tips");
    tips.innerHTML = "";
    if (note && note.tips && note.tips.length) {
      const box = el("div", "sd-box sd-warn");
      const h = el("h3");
      h.innerHTML = ICON_WARN;
      h.appendChild(el("span", null, "Let op"));
      const ul = el("ul");
      note.tips.forEach((t) => ul.appendChild(el("li", null, t)));
      box.append(h, ul);
      tips.appendChild(box);
    }

    const confuse = $("sd-confuse");
    confuse.innerHTML = "";
    if (note && note.confuse && note.confuse.length) {
      const box = el("div", "sd-box");
      box.appendChild(el("h3", null, "Niet verwarren met"));
      note.confuse.forEach((c) => {
        const other = signByCode(c.code);
        const a = el("a", "confuse-item");
        a.href = `#borden/${encodeURIComponent(c.code)}`;
        const img = el("div", "confuse-img");
        img.innerHTML = signMarkup(c.code);
        const text = el("div");
        const name = el("strong");
        name.append(el("span", "series-code", c.code), document.createTextNode(noteFor(c.code) ? noteFor(c.code).short : other.name));
        text.append(name, el("p", null, c.diff));
        a.append(img, text);
        box.appendChild(a);
      });
      confuse.appendChild(box);
    }

    const credit = s.credit
      ? `Afbeelding: ${s.credit.author}, ${s.credit.license} (Wikimedia Commons).`
      : "Afbeelding: RVV 1990 bijlage 1, via Wikimedia Commons (publiek domein).";
    $("sd-credit").textContent = credit;

    const dialog = $("sign-dialog");
    dialog.dataset.code = code;
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    $("sd-title").focus({ preventScroll: true });
  }

  function closeSign() {
    const dialog = $("sign-dialog");
    if (dialog.open) dialog.close();
  }

  function stepSign(dir) {
    const list = visibleSigns();
    const i = list.findIndex((s) => s.code === $("sign-dialog").dataset.code);
    const next = list[(i + dir + list.length) % list.length];
    if (!next) return;
    history.replaceState(null, "", `#borden/${encodeURIComponent(next.code)}`);
    openSign(next.code);
  }

  // ------------------------------------------------------------ init

  function onKey(e) {
    if ($("quiz").classList.contains("hidden")) return;
    if (e.target.tagName === "SELECT" || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.tagName === "INPUT") {
      if (e.key === "Enter") {
        e.preventDefault();
        next();
      }
      return;
    }
    const key = e.key.toUpperCase();
    const idx = "1234".includes(key) && key.length === 1 ? "1234".indexOf(key) : LETTERS.indexOf(key);
    if (idx >= 0) {
      e.preventDefault();
      const q = state.queue[state.index];
      if (typeOf(q) === "order") {
        const id = orderIds(q)[idx];
        if (id) addOrder(id);
      } else {
        choose(idx);
      }
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
    $("sign-search").addEventListener("input", renderSigns);
    $("sign-exam-only").addEventListener("change", renderSigns);
    $("sd-close").addEventListener("click", closeSign);
    $("sd-prev").addEventListener("click", () => stepSign(-1));
    $("sd-next").addEventListener("click", () => stepSign(1));
    const dialog = $("sign-dialog");
    // Esc of klikken naast het venster sluit het; de URL gaat terug naar #borden.
    dialog.addEventListener("close", () => {
      if (location.hash.startsWith("#borden/")) history.replaceState(null, "", "#borden");
    });
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") stepSign(-1);
      if (e.key === "ArrowRight") stepSign(1);
    });
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
