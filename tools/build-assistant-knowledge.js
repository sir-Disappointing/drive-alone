// Maakt de invoer voor de assistent (pocket-rag): de vaste kern en de stukken om in te zoeken.
// Gebruik: node tools/build-assistant-knowledge.js <pad-naar-@ribba/theorie-mcp-pakket>
//
// - assistant/core.md:               examenfeiten, spiekbriefje en borden per serie. Gaat met elke vraag mee.
// - assistant/content/stukken.json:  wetsartikelen, leerstofregels en borden. Per vraag gaan alleen de best
//                                    passende mee. Bordcodes en artikelnummers zijn sleutels ("B6", "art. 15").
//
// Daarna: npx github:sir-Disappointing/pocket-rag#v0.3.0 build assistant/pocket-rag.config.json
// De instructies staan in assistant/instructions.md. De wetteksten hebben geen auteursrecht (Auteurswet art. 11).
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const pkg = process.argv[2];
if (!pkg) {
  console.error("Gebruik: node tools/build-assistant-knowledge.js <pad-naar-theorie-mcp-pakket>");
  process.exit(1);
}

const ctx = {};
vm.createContext(ctx);
for (const file of ["learn.js", "signs-data.js", "sign-notes.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), ctx, { filename: file });
}
const { LEARN, SIGN_DATA, SIGN_NOTES, SIGN_SERIES } = vm.runInContext("({ LEARN, SIGN_DATA, SIGN_NOTES, SIGN_SERIES })", ctx);
const law = JSON.parse(fs.readFileSync(path.join(pkg, "data", "wetsartikelen.json"), "utf8"));

// ------------------------------------------------------------ kern

const core = [
  `# Het examen
Sinds 7 april 2025: 50 vragen in 30 minuten, geslaagd met minimaal 44 goed. Vraagtypen: meerkeuze, ja/nee, meerdere antwoorden goed, getal invullen, sleepvragen en aanwijsvragen. Gevaarherkenning gaat met korte animaties (remmen, gas loslaten of niets).`,
  "# Spiekbriefje\n" + LEARN.cheatsheet.map((g) => `${g.title}: ` + g.rows.map(([a, b]) => `${a} ${b}`).join("; ")).join("\n"),
  "# Borden per serie\n" + Object.entries(SIGN_SERIES).map(([k, v]) => `${k}: ${v.name}. ${v.intro}`).join("\n"),
].join("\n\n");

// ------------------------------------------------------------ stukken

const chunks = [];

for (const t of LEARN.topics) {
  for (const r of t.rules) {
    chunks.push({ id: `leren:${t.topic}:${r.title}`, title: `Leerstof ${t.topic}: ${r.title}`, text: `${r.text}${r.warn ? ` Let op: ${r.warn}` : ""}` });
  }
  if ((t.thumbs || []).length) {
    chunks.push({ id: `leren:${t.topic}:vuistregels`, title: `Leerstof ${t.topic}: vuistregels`, text: t.thumbs.join(" ") });
  }
}

for (const s of SIGN_DATA) {
  const n = SIGN_NOTES[s.code];
  let text = s.name + ".";
  if (n) {
    text += ` ${n.short}. ${n.meaning}`;
    if (n.tips) text += " " + n.tips.join(" ");
    if (n.confuse) text += " Niet verwarren met: " + n.confuse.map((c) => `${c.code}: ${c.diff}`).join(" ");
  }
  chunks.push({ id: `bord:${s.code}`, title: `Bord ${s.code}`, text, keys: [s.code] });
}

// Lege artikelen (alleen een kop) staan niet goed in de bron en slaan we over.
const usable = (t) => t.trim().length >= 40 && !/^(§|Hoofdstuk)/.test(t.trim());
for (const [nr, raw] of Object.entries(law.RVV.artikelen)) {
  const n = parseInt(nr, 10);
  if (!/^\d+[a-z]?$/.test(nr) || n < 1 || n > 98 || !usable(raw)) continue;
  const text = raw.trim();
  if (nr === "1") {
    // Artikel 1 is een lange lijst begripsbepalingen: één stuk per begrip.
    for (const def of text.replace(/^.*?wordt verstaan onder:\s*/, "").split(/;\s+/)) {
      const m = def.match(/^([^:]{2,60}?)\s*:\s*(.+)$/s);
      if (m) chunks.push({ id: `rvv:1:${m[1].trim()}`, title: `RVV 1990 art. 1, begrip "${m[1].trim()}"`, text: m[2].trim().replace(/[.;]$/, "") });
    }
    continue;
  }
  chunks.push({ id: `rvv:${nr}`, title: `RVV 1990 art. ${nr}`, text, keys: [`art ${nr}`, `artikel ${nr}`, `rvv ${nr}`] });
}
for (const nr of ["5", "6", "7", "8"]) {
  chunks.push({ id: `wvw:${nr}`, title: `Wegenverkeerswet 1994 art. ${nr}`, text: law.WVW.artikelen[nr].trim(), keys: [`art ${nr}`, `artikel ${nr}`, `wvw ${nr}`] });
}

// ------------------------------------------------------------ schrijven

const dir = path.join(root, "assistant");
fs.mkdirSync(path.join(dir, "content"), { recursive: true });
fs.writeFileSync(path.join(dir, "core.md"), core + "\n");
fs.writeFileSync(path.join(dir, "content", "stukken.json"), JSON.stringify(chunks, null, 1) + "\n");

const tokens = (chars) => Math.round(chars / 3.6);
const total = chunks.reduce((n, c) => n + c.title.length + c.text.length, 0);
console.log(`kern: ~${tokens(core.length)} tokens, ${chunks.length} stukken (samen ~${tokens(total)} tokens). Nu: pocket-rag build assistant/pocket-rag.config.json`);
