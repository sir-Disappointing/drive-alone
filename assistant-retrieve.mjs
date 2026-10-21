// Zoekt bij een vraag de best passende stukken uit de kennisbank van de assistent,
// zodat niet de hele leerstof en wet met elke vraag mee hoeft.
// Gebruikt door de browser (eigen sleutel) en de proxy (worker/src/retrieve.js is een kopie).
//
// Werkwijze: simpele BM25-score met Nederlandse normalisatie. Woorden matchen ook als deel van
// een samenstelling ("voorrang" in "voorrangsweg"). Synoniemen vertalen spreektaal naar de
// woorden uit de wet. Bordcodes ("B6") en artikelnummers ("art. 15") gaan altijd mee.

const MAX_CHUNKS = 10;
const MAX_CHARS = 7000;
const K1 = 1.2;
const B = 0.75;

const STOP = new Set(
  ("de het een en of in op van voor naar met bij als dan dat die dit is zijn je jij ik mij me mijn mag mogen moet moeten " +
    "wat wie wanneer hoe waar welke welk er niet wel ook nog al om te tot uit aan door over na zo kan kun kunt kunnen heb " +
    "hebt heeft hebben wordt worden word was u we wij ze zij hun hem haar men iets elk elke geen meer veel waarom precies " +
    "eigenlijk gewoon even toch nou dus hier daar zou zouden ga gaat gaan doe doet doen krijg krijgt sta staat staan zit zitten " +
    "jullie onze ons hoeveel hoe lang regel regels betekent betekenen betekenis bedoeld bord borden bordje altijd nooit soms vaak andere ander anders iemand niemand alles niets eens graag vraag").split(" ")
);

// Spreektaal → woorden uit de wet en de leerstof.
const SYNONYMS = {
  stoplicht: ["verkeerslicht"],
  stoplichten: ["verkeerslicht"],
  snelweg: ["autosnelweg"],
  zebra: ["voetgangersoversteekplaats", "zebrapad"],
  zebrapad: ["voetgangersoversteekplaats"],
  oversteekplaats: ["voetgangersoversteekplaats"],
  brommer: ["bromfiets"],
  scooter: ["bromfiets", "snorfiets"],
  snorscooter: ["snorfiets"],
  alcohol: ["promille", "alcoholhoudende"],
  drank: ["alcohol", "promille"],
  bier: ["alcohol", "promille"],
  biertje: ["alcohol", "promille"],
  drinken: ["alcohol", "promille"],
  telefoon: ["mobiel"],
  mobiel: ["telefoon"],
  bellen: ["telefoon"],
  appen: ["telefoon"],
  ambulance: ["voorrangsvoertuig", "zwaailicht", "sirene"],
  politie: ["voorrangsvoertuig", "zwaailicht", "verkeersregelaar"],
  brandweer: ["voorrangsvoertuig", "zwaailicht"],
  sirene: ["voorrangsvoertuig", "tweetonige"],
  zwaailicht: ["voorrangsvoertuig"],
  agent: ["verkeersregelaar", "aanwijzingen"],
  trein: ["overweg", "spoorvoertuig"],
  spoor: ["overweg"],
  spoorwegovergang: ["overweg"],
  woonerf: ["erf"],
  caravan: ["aanhangwagen", "aanhanger"],
  aanhanger: ["aanhangwagen"],
  kind: ["kinderbeveiligingssysteem", "kinderzitje"],
  kinderen: ["kinderbeveiligingssysteem", "kinderzitje"],
  zitje: ["kinderbeveiligingssysteem", "kinderzitje"],
  gordel: ["autogordel"],
  hard: ["maximumsnelheid", "snelheid"],
  kmh: ["maximumsnelheid", "snelheid"],
  snelheid: ["maximumsnelheid"],
  stoppen: ["stilstaan", "stoppen"],
  stilstaan: ["stilstaan"],
  rechtsaf: ["afslaan"],
  linksaf: ["afslaan"],
  afslaan: ["afslaan"],
  mistlamp: ["mistachterlicht", "mistlicht"],
  mistlampen: ["mistachterlicht", "mistlicht"],
  grootlicht: ["groot licht"],
  koplampen: ["dimlicht"],
  toeteren: ["geluidssignalen"],
  claxon: ["geluidssignalen"],
  toeter: ["geluidssignalen"],
  bus: ["autobus", "bushalte"],
  halte: ["bushalte"],
  file: ["fileverkeer", "files"],
  pech: ["vluchtstrook", "gevarendriehoek", "waarschuwingslicht"],
  ongeluk: ["ongeval", "verkeersongeval"],
  aanrijding: ["ongeval", "verkeersongeval"],
  boete: ["boete"],
  rijbewijs: ["rijbewijs"],
  beginner: ["beginnend", "rijbewijs"],
  invoegen: ["invoegstrook"],
  uitvoegen: ["uitrijstrook"],
  wegwerkzaamheden: ["werk in uitvoering"],
};

export function normalize(text) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function words(text) {
  return normalize(text).match(/[a-z0-9]+/g) || [];
}

// Varianten van een woord, zodat "parkeren" ook "parkeer" vindt en "inhalen" ook "inhaal".
function variants(w) {
  const out = new Set([w]);
  for (const suf of ["en", "e", "s", "je", "tje"]) {
    if (w.length - suf.length >= 4 && w.endsWith(suf)) {
      const stem = w.slice(0, -suf.length);
      out.add(stem);
      // Dubbele medeklinker: remmen → rem.
      if (/([bcdfgklmnprst])\1$/.test(stem)) out.add(stem.slice(0, -1));
      // Open lettergreep: parker → parkeer, inhal → inhaal.
      const m = stem.match(/^(.*[^aeiou])([aeiou])([^aeiou])$/);
      if (m) out.add(m[1] + m[2] + m[2] + m[3]);
    }
  }
  return [...out].filter((v) => v.length >= 3);
}

function queryTerms(text) {
  const terms = new Map(); // term → gewicht
  const add = (t, w) => terms.set(t, Math.max(terms.get(t) || 0, w));
  for (const raw of words(text)) {
    if (STOP.has(raw) || raw.length < 2) continue;
    if (/^\d+$/.test(raw) && raw.length < 2) continue;
    for (const v of variants(raw)) add(v, 1);
    for (const syn of SYNONYMS[raw] || []) for (const v of variants(normalize(syn))) add(v, 0.8);
  }
  // "Wie gaat voor?" bestaat alleen uit stopwoorden, maar gaat over voorrang.
  if (/\b(ga|gaat|gaan|mag|mogen) (er )?(eerst|voor)\b|\bvoor (laten )?gaan\b|\bvoorgaan\b/.test(normalize(text))) add("voorrang", 1);
  return terms;
}

const indexCache = new WeakMap();

function index(knowledge) {
  let idx = indexCache.get(knowledge);
  if (idx) return idx;
  const docs = knowledge.chunks.map((c) => {
    // De titel telt dubbel mee.
    const text = ` ${words(c.title).join(" ")} ${words(c.title).join(" ")} ${words(c.text).join(" ")} `;
    return { chunk: c, text, len: text.split(" ").length };
  });
  const avgLen = docs.reduce((n, d) => n + d.len, 0) / docs.length;
  idx = { docs, avgLen, df: new Map() };
  indexCache.set(knowledge, idx);
  return idx;
}

function count(haystack, needle) {
  let n = 0;
  for (let i = haystack.indexOf(needle); i !== -1; i = haystack.indexOf(needle, i + needle.length)) n++;
  return n;
}

// Woorden van 3 of 4 letters matchen alleen als heel woord of als begin van een woord,
// anders vindt "rem" ook "extreem". Langere woorden mogen overal in een samenstelling staan.
function occurrences(text, term) {
  return term.length <= 4 ? count(text, ` ${term}`) : count(text, term);
}

// Vaste treffers: bordcodes en artikelnummers die letterlijk in de vraag staan.
function directHits(question, knowledge) {
  const ids = new Set();
  for (const m of question.matchAll(/\b([A-La-l])\s?(\d{1,2}[a-e]?)\b/g)) ids.add(`bord:${m[1].toUpperCase()}${m[2]}`);
  for (const m of question.matchAll(/\bart(?:ikel|\.)?\s*(\d{1,2}[a-z]?)\b/gi)) {
    ids.add(`rvv:${m[1]}`);
    ids.add(`wvw:${m[1]}`);
  }
  return knowledge.chunks.filter((c) => ids.has(c.id));
}

export function retrieve(knowledge, question, previous = "") {
  const idx = index(knowledge);
  const terms = queryTerms(question);
  // Bij een vervolgvraag ("en bij een stopbord?") telt de vorige vraag zwakker mee.
  for (const [t, w] of queryTerms(previous)) if (!terms.has(t)) terms.set(t, w * 0.5);

  const n = idx.docs.length;
  const scores = idx.docs.map(() => 0);
  for (const [term, weight] of terms) {
    let df = idx.df.get(term);
    const tfs = idx.docs.map((d) => occurrences(d.text, term));
    if (df === undefined) {
      df = tfs.filter(Boolean).length;
      idx.df.set(term, df);
    }
    if (!df) continue;
    const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5));
    tfs.forEach((tf, i) => {
      if (!tf) return;
      const d = idx.docs[i];
      scores[i] += weight * idf * ((tf * (K1 + 1)) / (tf + K1 * (1 - B + (B * d.len) / idx.avgLen)));
    });
  }

  // Leerstof is in gewone taal geschreven; bij gelijke score heeft die de voorkeur.
  idx.docs.forEach((d, i) => {
    if (d.chunk.id.startsWith("leren:")) scores[i] *= 1.25;
  });

  const ranked = idx.docs
    .map((d, i) => ({ chunk: d.chunk, score: scores[i] }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
  const top = ranked.length ? ranked[0].score : 0;

  const picked = [];
  let chars = 0;
  const take = (c) => {
    if (picked.includes(c) || picked.length >= MAX_CHUNKS) return;
    const size = c.title.length + c.text.length;
    if (picked.length && chars + size > MAX_CHARS) return;
    picked.push(c);
    chars += size;
  };
  directHits(question, knowledge).forEach(take);
  for (const r of ranked) {
    if (r.score < top * 0.3) break;
    take(r.chunk);
  }
  return picked;
}

// De vaste kern als systeemprompt; die is elke keer gelijk en wordt dus gecachet.
export function systemBlocks(knowledge) {
  return [{ type: "text", text: knowledge.core, cache_control: { type: "ephemeral" } }];
}

// Zet de passende bronnen bij de laatste vraag. Eerdere vragen gaan zonder bronnen mee.
//
// Bij een vervolgvraag krijgt het vorige antwoord een cachemarkering. Alles tot en met dat antwoord
// (kern plus eerdere vragen en antwoorden) is bij de volgende vraag precies hetzelfde en kost dan
// nog maar een tiende. De laatste vraag zelf markeren heeft geen zin: die gaat de volgende keer
// zonder bronnen mee en ziet er dan anders uit.
export function withSources(knowledge, messages) {
  const users = messages.filter((m) => m.role === "user");
  const question = users[users.length - 1].content;
  const previous = users.length > 1 ? users[users.length - 2].content : "";
  const sources = retrieve(knowledge, question, previous);
  const block = sources.length
    ? sources.map((c) => `<bron titel="${c.title.replace(/"/g, "'")}">\n${c.text}\n</bron>`).join("\n")
    : "(geen passende bronnen gevonden)";
  const last = `<bronnen>\n${block}\n</bronnen>\n\n<vraag>\n${question}\n</vraag>`;
  const out = messages.slice(0, -1).concat({ role: "user", content: last });
  if (out.length >= 3) {
    const prev = out[out.length - 2];
    out[out.length - 2] = { role: prev.role, content: [{ type: "text", text: prev.content, cache_control: { type: "ephemeral" } }] };
  }
  return out;
}
