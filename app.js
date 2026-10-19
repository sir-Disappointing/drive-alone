(function () {
  const $ = (id) => document.getElementById(id);

  const state = {
    mode: null,
    queue: [],
    index: 0,
    answers: [],
    answered: false,
  };

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function show(id) {
    ["menu", "quiz", "result"].forEach((s) => $(s).classList.toggle("hidden", s !== id));
  }

  // Shuffle the answer options so the correct answer's position varies per run.
  function withShuffledOptions(q) {
    const order = shuffle(q.options.map((_, i) => i));
    return {
      ...q,
      options: order.map((i) => q.options[i]),
      answer: order.indexOf(q.answer),
    };
  }

  function start(mode) {
    const requested = Math.max(1, parseInt($("count").value, 10) || 10);
    const pool = shuffle(QUESTIONS).map(withShuffledOptions);
    state.mode = mode;
    state.queue = mode === "exam" ? pool.slice(0, Math.min(requested, pool.length)) : pool;
    state.index = 0;
    state.answers = [];
    renderQuestion();
    show("quiz");
  }

  function renderQuestion() {
    const q = state.queue[state.index];
    state.answered = false;
    $("qnum").textContent = `Vraag ${state.index + 1} van ${state.queue.length}`;
    $("topic").textContent = q.topic;
    $("question").textContent = q.question;
    $("bar").style.width = `${(state.index / state.queue.length) * 100}%`;
    $("feedback").classList.add("hidden");
    $("next").disabled = true;
    $("next").textContent = state.index === state.queue.length - 1 ? "Afronden" : "Volgende";

    const wrap = $("options");
    wrap.innerHTML = "";
    q.options.forEach((text, i) => {
      const b = document.createElement("button");
      b.className = "option";
      b.textContent = text;
      b.addEventListener("click", () => choose(i));
      wrap.appendChild(b);
    });
  }

  function choose(i) {
    if (state.answered) return;
    state.answered = true;
    const q = state.queue[state.index];
    const correct = i === q.answer;
    state.answers.push({ q, chosen: i, correct });

    const buttons = $("options").children;
    Array.from(buttons).forEach((b) => (b.disabled = true));
    buttons[q.answer].classList.add("correct");
    if (!correct) buttons[i].classList.add("wrong");

    if (state.mode === "practice") {
      const fb = $("feedback");
      fb.className = `feedback ${correct ? "ok" : "bad"}`;
      fb.innerHTML = "";
      const title = document.createElement("strong");
      title.textContent = correct ? "Goed!" : "Helaas, fout.";
      const text = document.createElement("p");
      text.style.margin = "6px 0 0";
      text.textContent = q.explanation;
      fb.append(title, text);
      fb.classList.remove("hidden");
    }
    $("next").disabled = false;
  }

  function next() {
    if (state.index < state.queue.length - 1) {
      state.index++;
      renderQuestion();
    } else {
      finish();
    }
  }

  function finish() {
    const total = state.answers.length;
    const right = state.answers.filter((a) => a.correct).length;
    $("score").textContent = `${right} van ${total} goed (${total ? Math.round((right / total) * 100) : 0}%)`;

    const review = $("review");
    review.innerHTML = "";
    state.answers.forEach((a, n) => {
      const item = document.createElement("div");
      item.className = "review-item";
      const q = document.createElement("p");
      q.style.margin = "0 0 4px";
      q.textContent = `${n + 1}. ${a.q.question}`;
      item.appendChild(q);
      if (!a.correct) {
        const w = document.createElement("p");
        w.className = "wrong-line";
        w.style.margin = "0";
        w.textContent = `Jouw antwoord: ${a.q.options[a.chosen]}`;
        item.appendChild(w);
      }
      const r = document.createElement("p");
      r.className = "right-line";
      r.style.margin = "0";
      r.textContent = `Juiste antwoord: ${a.q.options[a.q.answer]}`;
      const e = document.createElement("p");
      e.className = "muted";
      e.style.margin = "4px 0 0";
      e.textContent = a.q.explanation;
      item.append(r, e);
      review.appendChild(item);
    });

    $("bar").style.width = "100%";
    show("result");
  }

  function init() {
    $("bankInfo").textContent = `${QUESTIONS.length} oefenvragen in de bank.`;
    $("count").max = QUESTIONS.length;

    document.querySelectorAll("[data-mode]").forEach((b) =>
      b.addEventListener("click", () => start(b.dataset.mode))
    );
    $("next").addEventListener("click", next);
    $("quit").addEventListener("click", () => {
      if (state.answers.length) finish();
      else show("menu");
    });
    $("again").addEventListener("click", () => show("menu"));
  }

  init();
})();
