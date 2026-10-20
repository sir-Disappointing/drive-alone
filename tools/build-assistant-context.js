// Bouwt de systeemprompt van de assistent uit de leerstof, de borden en de wettekst.
// Gebruik: node tools/build-assistant-context.js <pad-naar-@ribba/theorie-mcp-pakket>
//
// Schrijft dezelfde tekst naar twee plekken:
//   assistant-context.js      voor de browser (eigen sleutel)
//   worker/src/context.js     voor de proxy (Cloudflare Worker)
// De wetteksten hebben geen auteursrecht (Auteurswet art. 11).
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const pkg = process.argv[2];
if (!pkg) {
  console.error("Gebruik: node tools/build-assistant-context.js <pad-naar-theorie-mcp-pakket>");
  process.exit(1);
}

const ctx = {};
vm.createContext(ctx);
for (const file of ["learn.js", "signs-data.js", "sign-notes.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), ctx, { filename: file });
}
const { LEARN, SIGN_DATA, SIGN_NOTES } = vm.runInContext("({ LEARN, SIGN_DATA, SIGN_NOTES })", ctx);
const law = JSON.parse(fs.readFileSync(path.join(pkg, "data", "wetsartikelen.json"), "utf8"));

const parts = [];

parts.push(`Je bent de assistent van Theorie Oefenen, een gratis oefensite voor het theorie-examen auto (rijbewijs B) in Nederland.

Zo antwoord je:
- In de taal van de vraag, meestal Nederlands. Kort, duidelijk en in gewone taal. Spreek de gebruiker aan met "je".
- Baseer je antwoord op de bronnen hieronder: de leerstof van de site, de uitleg bij de borden en de wetteksten. Noem het artikel als je een regel uit de wet haalt, bijvoorbeeld "RVV 1990 art. 15".
- Staat iets niet in de bronnen of twijfel je, zeg dat eerlijk en verwijs naar cbr.nl of wetten.overheid.nl. Verzin geen regels, getallen of boetebedragen.
- Je bent niet het CBR en je kent de echte examenvragen niet.
- Je beantwoordt alleen vragen over verkeer, verkeersregels, verkeersborden, het rijbewijs en het theorie-examen. Bij andere vragen zeg je vriendelijk dat je daar niet voor bent.
- Gebruik geen koppen. Korte alinea's, eventueel een lijstje met "- ". Vetgedrukt met **zo** mag, maar spaarzaam.`);

parts.push(`# Het examen
Sinds 7 april 2025: 50 vragen in 30 minuten, geslaagd met minimaal 44 goed. Vraagtypen: meerkeuze, ja/nee, meerdere antwoorden goed, getal invullen, sleepvragen en aanwijsvragen. Gevaarherkenning gaat met korte animaties (remmen, gas loslaten of niets).`);

const learn = ["# Leerstof van de site"];
for (const g of LEARN.cheatsheet) learn.push(`## ${g.title}\n` + g.rows.map(([a, b]) => `- ${a}: ${b}`).join("\n"));
for (const t of LEARN.topics) {
  const lines = [`## ${t.topic}`];
  if (t.intro) lines.push(t.intro);
  for (const r of t.rules) lines.push(`- ${r.title}: ${r.text}${r.warn ? ` Let op: ${r.warn}` : ""}`);
  for (const s of t.thumbs || []) lines.push(`- Vuistregel: ${s}`);
  learn.push(lines.join("\n"));
}
parts.push(learn.join("\n\n"));

const signs = ["# Verkeersborden (RVV 1990 bijlage 1)"];
for (const s of SIGN_DATA) {
  const n = SIGN_NOTES[s.code];
  let line = `- ${s.code}: ${s.name}`;
  if (n) {
    line += `. ${n.meaning}`;
    if (n.tips) line += " " + n.tips.join(" ");
    if (n.confuse) line += " Niet verwarren met: " + n.confuse.map((c) => `${c.code} (${c.diff})`).join("; ");
  }
  signs.push(line);
}
parts.push(signs.join("\n"));

// Wetteksten. Lege artikelen (alleen een kop) slaan we over; die staan niet goed in de bron.
function articles(key, filter) {
  const out = [];
  for (const [nr, text] of Object.entries(law[key].artikelen)) {
    if (!filter(nr)) continue;
    const t = text.trim();
    if (t.length < 40 || /^(§|Hoofdstuk)/.test(t)) continue;
    out.push(`Art. ${nr}: ${t}`);
  }
  return out.join("\n");
}
const rvvNr = (nr) => {
  const n = parseInt(nr, 10);
  return /^\d+[a-z]?$/.test(nr) && n >= 1 && n <= 98;
};
parts.push(`# Wettekst: ${law.RVV.regeling} (${law.RVV.url})
Artikelen 15a (overwegen), 61a (telefoon), 75 (geel knipperlicht), 84 (rangorde) en 85 ontbreken in deze bron; gebruik daarvoor de leerstof hierboven.
${articles("RVV", rvvNr)}`);
parts.push(`# Wettekst: ${law.WVW.regeling} (${law.WVW.url}), artikelen 5 tot en met 8
${articles("WVW", (nr) => ["5", "6", "7", "8"].includes(nr))}`);

const text = parts.join("\n\n");
const header = "// Gegenereerd door tools/build-assistant-context.js. Niet met de hand aanpassen.\n";
fs.writeFileSync(path.join(root, "assistant-context.js"), `${header}const ASSISTANT_CONTEXT = ${JSON.stringify(text)};\n`);
fs.mkdirSync(path.join(root, "worker", "src"), { recursive: true });
fs.writeFileSync(path.join(root, "worker", "src", "context.js"), `${header}export default ${JSON.stringify(text)};\n`);
console.log(`${text.length} tekens (ongeveer ${Math.round(text.length / 3.6)} tokens) geschreven`);
