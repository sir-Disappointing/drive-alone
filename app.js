(function () {
  // Examenformat CBR auto (B) sinds 7 april 2025: 50 vragen, 30 minuten, 44 goed om te slagen.
  const EXAM = { questions: 50, minutes: 30, passScore: 44 };
  const STORE_KEY = "theorie-oefenen.v1";
  const LETTERS = ["A", "B", "C", "D"];

  const $ = (id) => document.getElementById(id);

  const state = {
    mode: null, // "exam" | "practice" | "mistakes"
    queue: [],
    index: 0,
    answers: [], // { q, chosen, correct }
    selected: null, // geselecteerd antwoord in examenmodus, nog niet bevestigd
    locked: false, // antwoord is vastgelegd voor de huidige vraag
    deadline: 0,
    timer: null,
    startedAt: 0,
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

  function record(id, correct) {
    const stats = loadStats();
    const s = stats[id] || { right: 0, wrong: 0 };
    if (correct) s.right++;
    else s.wrong++;
    s.last = correct;
    stats[id] = s;
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

  function show(id) {
    ["menu", "quiz", "result"].forEach((s) => $(s).classList.toggle("hidden", s !== id));
    window.scrollTo(0, 0);
  }

  function el(tag, className, text) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function formatTime(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  // ------------------------------------------------------------ menu

  function renderMenu() {
    const topics = [...new Set(QUESTIONS.map((q) => q.topic))];
    const select = $("topic-select");
    const current = select.value;
    select.innerHTML = "";
    const all = el("option", null, "Alle onderwerpen");
    all.value = "";
    select.appendChild(all);
    topics.forEach((t) => {
      const o = el("option", null, `${t} (${QUESTIONS.filter((q) => q.topic === t).length})`);
      o.value = t;
      select.appendChild(o);
    });
    select.value = current;

    const examCount = Math.min(EXAM.questions, QUESTIONS.length);
    $("exam-desc").textContent =
      `${examCount} vragen · ${EXAM.minutes} minuten · geslaagd bij ${EXAM.passScore} goed`;

    const mistakes = mistakeIds().length;
    $("mistakes-count").textContent =
      mistakes === 0 ? "Nog geen fouten om te herhalen" : `${mistakes} ${mistakes === 1 ? "vraag" : "vragen"} om te herhalen`;
    $("start-mistakes").disabled = mistakes === 0;

    const stats = loadStats();
    const seen = QUESTIONS.filter((q) => stats[q.id]).length;
    const lastRight = QUESTIONS.filter((q) => stats[q.id] && stats[q.id].last).length;
    $("stat-seen").textContent = `${seen} / ${QUESTIONS.length}`;
    $("stat-right").textContent = seen ? `${Math.round((lastRight / seen) * 100)}%` : "–";
    $("reset").classList.toggle("hidden", seen === 0);
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
    state.answers = [];
    state.startedAt = Date.now();

    clearInterval(state.timer);
    $("timer").classList.toggle("hidden", mode !== "exam");
    if (mode === "exam") {
      state.deadline = Date.now() + EXAM.minutes * 60 * 1000;
      tick();
      state.timer = setInterval(tick, 500);
    }

    renderQuestion();
    show("quiz");
  }

  function tick() {
    const left = state.deadline - Date.now();
    $("timer").textContent = formatTime(left);
    $("timer").classList.toggle("urgent", left < 5 * 60 * 1000);
    if (left <= 0) finish(true);
  }

  function renderQuestion() {
    const q = state.queue[state.index];
    state.selected = null;
    state.locked = false;

    $("qnum").textContent = `Vraag ${state.index + 1} van ${state.queue.length}`;
    $("topic").textContent = q.topic;
    $("bar").style.width = `${(state.index / state.queue.length) * 100}%`;

    const sign = $("sign");
    sign.innerHTML = q.sign && SIGNS[q.sign] ? SIGNS[q.sign] : "";
    sign.classList.toggle("hidden", !sign.innerHTML);

    $("question").textContent = q.question;
    $("feedback").classList.add("hidden");
    $("next").disabled = true;
    $("next").textContent = state.index === state.queue.length - 1 ? "Afronden" : "Volgende";

    const wrap = $("options");
    wrap.innerHTML = "";
    q.options.forEach((text, i) => {
      const b = el("button", "option");
      b.type = "button";
      b.append(el("span", "letter", LETTERS[i]), el("span", "text", text));
      b.addEventListener("click", () => choose(i));
      wrap.appendChild(b);
    });
    $("question").focus();
  }

  function choose(i) {
    if (state.locked) return;
    const buttons = Array.from($("options").children);
    if (i >= buttons.length) return;

    if (state.mode === "exam") {
      // In examenmodus kun je van antwoord wisselen tot je op Volgende drukt.
      state.selected = i;
      buttons.forEach((b, n) => b.classList.toggle("selected", n === i));
      $("next").disabled = false;
      return;
    }

    lock(i);
    const q = state.queue[state.index];
    const correct = i === q.answer;
    buttons.forEach((b) => (b.disabled = true));
    buttons[q.answer].classList.add("correct");
    if (!correct) buttons[i].classList.add("wrong");

    const fb = $("feedback");
    fb.className = `feedback ${correct ? "ok" : "bad"}`;
    fb.innerHTML = "";
    fb.append(el("strong", null, correct ? "Goed!" : "Helaas, dat is fout."), el("p", null, q.explanation));
    $("next").disabled = false;
    $("next").focus();
  }

  function lock(i) {
    const q = state.queue[state.index];
    const correct = i === q.answer;
    state.locked = true;
    state.answers.push({ q, chosen: i, correct });
    record(q.id, correct);
  }

  function next() {
    if (state.mode === "exam") {
      if (state.selected === null) return;
      lock(state.selected);
    }
    if (!state.locked) return;
    if (state.index < state.queue.length - 1) {
      state.index++;
      renderQuestion();
    } else {
      finish(false);
    }
  }

  function quit() {
    const msg =
      state.mode === "exam"
        ? "Weet je zeker dat je het examen wilt stoppen? Je ziet dan de uitslag van wat je tot nu toe hebt beantwoord."
        : "Stoppen en je resultaat bekijken?";
    if (!confirm(msg)) return;
    if (state.answers.length) finish(false);
    else {
      clearInterval(state.timer);
      renderMenu();
      show("menu");
    }
  }

  // ------------------------------------------------------------ resultaat

  function finish(timedOut) {
    clearInterval(state.timer);

    // Bij het examen tellen onbeantwoorde vragen als fout.
    const total = state.mode === "exam" ? state.queue.length : state.answers.length;
    const right = state.answers.filter((a) => a.correct).length;
    const wrong = total - right;

    const verdict = $("verdict");
    if (state.mode === "exam") {
      const fullLength = state.queue.length === EXAM.questions;
      const passed = fullLength && right >= EXAM.passScore;
      verdict.className = `verdict ${passed ? "ok" : "bad"}`;
      verdict.textContent = passed ? "Geslaagd" : "Gezakt";
      const used = formatTime(Math.min(Date.now() - state.startedAt, EXAM.minutes * 60 * 1000));
      const notes = [];
      if (timedOut) notes.push("De tijd is op.");
      if (state.answers.length < total) notes.push(`${total - state.answers.length} vragen niet beantwoord (tellen als fout).`);
      notes.push(`Tijd gebruikt: ${used}. Nodig om te slagen: ${EXAM.passScore} van ${EXAM.questions} goed.`);
      $("result-note").textContent = notes.join(" ");
    } else {
      verdict.className = "verdict";
      verdict.textContent = "Klaar";
      $("result-note").textContent = "";
    }

    $("score").textContent = `${right} van ${total} goed`;
    $("score-detail").textContent = `${wrong} ${wrong === 1 ? "fout" : "fouten"} · ${total ? Math.round((right / total) * 100) : 0}%`;
    $("bar").style.width = "100%";

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
      review.appendChild(el("p", "muted", onlyWrong ? "Geen fouten. Goed gedaan!" : "Geen vragen beantwoord."));
      return;
    }
    items.forEach((a) => {
      const item = el("article", `review-item ${a.correct ? "is-right" : "is-wrong"}`);
      const n = state.answers.indexOf(a) + 1;
      item.appendChild(el("p", "review-q", `${n}. ${a.q.question}`));
      if (!a.correct) item.appendChild(el("p", "wrong-line", `Jouw antwoord: ${a.q.options[a.chosen]}`));
      item.appendChild(el("p", "right-line", `Juiste antwoord: ${a.q.options[a.q.answer]}`));
      item.appendChild(el("p", "muted", a.q.explanation));
      review.appendChild(item);
    });
  }

  // ------------------------------------------------------------ init

  function onKey(e) {
    if ($("quiz").classList.contains("hidden")) return;
    if (e.target.tagName === "SELECT" || e.metaKey || e.ctrlKey || e.altKey) return;
    const key = e.key.toUpperCase();
    const idx = "1234".indexOf(key) >= 0 ? "1234".indexOf(key) : LETTERS.indexOf(key);
    if (idx >= 0) {
      e.preventDefault();
      choose(idx);
    } else if (e.key === "Enter" && !$("next").disabled && e.target.tagName !== "BUTTON") {
      e.preventDefault();
      next();
    }
  }

  function init() {
    $("start-exam").addEventListener("click", () => start("exam"));
    $("start-practice").addEventListener("click", () => start("practice"));
    $("start-mistakes").addEventListener("click", () => start("mistakes"));
    $("next").addEventListener("click", next);
    $("quit").addEventListener("click", quit);
    $("only-wrong").addEventListener("change", renderReview);
    $("again").addEventListener("click", () => start(state.mode === "mistakes" && !mistakeIds().length ? "practice" : state.mode));
    $("to-menu").addEventListener("click", () => {
      renderMenu();
      show("menu");
    });
    $("reset").addEventListener("click", () => {
      if (!confirm("Al je opgeslagen voortgang wissen?")) return;
      saveStats({});
      renderMenu();
    });
    document.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", (e) => {
      if (state.mode === "exam" && !$("quiz").classList.contains("hidden")) e.preventDefault();
    });
    $("year").textContent = new Date().getFullYear();
    renderMenu();
  }

  init();
})();
