// Controleert de vragenbank op fouten. Gebruik: node tools/check-questions.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const ctx = {};
vm.createContext(ctx);
for (const file of ["questions.js", "signs-data.js", "signs.js", "sign-notes.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), ctx, { filename: file });
}
const { QUESTIONS, SIGNS, SIGN_DATA, SIGN_NOTES } = vm.runInContext("({ QUESTIONS, SIGNS, SIGN_DATA, SIGN_NOTES })", ctx);
const signCodes = new Set(SIGN_DATA.map((s) => s.code));

const problems = [];
const ids = new Set();
for (const q of QUESTIONS) {
  const where = `vraag ${q.id}`;
  if (!Number.isInteger(q.id)) problems.push(`${where}: id moet een geheel getal zijn`);
  if (ids.has(q.id)) problems.push(`${where}: dubbel id`);
  ids.add(q.id);
  for (const field of ["topic", "question", "explanation"]) {
    if (typeof q[field] !== "string" || !q[field].trim()) problems.push(`${where}: ${field} ontbreekt`);
  }
  const type = q.type || "choice";
  const vehicleIds = q.scene ? (q.scene.vehicles || []).map((v) => v.id) : [];
  if (q.scene) {
    if (new Set(vehicleIds).size !== vehicleIds.length) problems.push(`${where}: dubbele voertuig-id's in de tekening`);
    if (!q.scene.alt) problems.push(`${where}: tekening mist een beschrijving (alt)`);
  }
  if (type === "choice" || type === "multi") {
    if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 4) {
      problems.push(`${where}: options moet 2 tot 4 antwoorden hebben`);
    } else {
      if (new Set(q.options).size !== q.options.length) problems.push(`${where}: dubbele antwoorden`);
      const answers = type === "multi" ? q.answer : [q.answer];
      if (!Array.isArray(answers) || !answers.length || answers.some((a) => !Number.isInteger(a) || a < 0 || a >= q.options.length)) {
        problems.push(`${where}: answer verwijst niet naar een bestaand antwoord`);
      }
    }
  } else if (type === "number") {
    if (typeof q.answer !== "number") problems.push(`${where}: answer moet een getal zijn`);
  } else if (type === "tap") {
    if (!q.scene || !vehicleIds.includes(q.answer)) problems.push(`${where}: answer moet een voertuig uit de tekening zijn`);
  } else if (type === "order") {
    if (!q.scene || !Array.isArray(q.answer) || q.answer.length < 2 || q.answer.some((id) => !vehicleIds.includes(id)) || new Set(q.answer).size !== q.answer.length) {
      problems.push(`${where}: answer moet een volgorde van voertuigen uit de tekening zijn`);
    }
  } else {
    problems.push(`${where}: onbekend type "${type}"`);
  }
  if (q.sign && !signCodes.has(q.sign) && !SIGNS[q.sign]) problems.push(`${where}: onbekend bord "${q.sign}"`);
}

// Uitleg bij borden: alleen bestaande codes, en verwijzingen naar bestaande borden.
for (const [code, note] of Object.entries(SIGN_NOTES)) {
  if (!signCodes.has(code)) problems.push(`bordnotitie ${code}: bord bestaat niet`);
  for (const c of note.confuse || []) {
    if (!signCodes.has(c.code)) problems.push(`bordnotitie ${code}: verwijst naar onbekend bord ${c.code}`);
  }
}

const topics = {};
QUESTIONS.forEach((q) => (topics[q.topic] = (topics[q.topic] || 0) + 1));
console.log(`${QUESTIONS.length} vragen`);
for (const [t, n] of Object.entries(topics)) console.log(`  ${t}: ${n}`);

if (problems.length) {
  console.error(`\n${problems.length} probleem/problemen:`);
  problems.forEach((p) => console.error(`  - ${p}`));
  process.exit(1);
}
console.log("\nGeen problemen gevonden.");
