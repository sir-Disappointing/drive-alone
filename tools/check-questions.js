// Controleert de vragenbank op fouten. Gebruik: node tools/check-questions.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const ctx = {};
vm.createContext(ctx);
for (const file of ["questions.js", "signs.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), ctx, { filename: file });
}
const { QUESTIONS, SIGNS } = vm.runInContext("({ QUESTIONS, SIGNS })", ctx);

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
  if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 4) {
    problems.push(`${where}: options moet 2 tot 4 antwoorden hebben`);
  } else {
    if (new Set(q.options).size !== q.options.length) problems.push(`${where}: dubbele antwoorden`);
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) {
      problems.push(`${where}: answer verwijst niet naar een bestaand antwoord`);
    }
  }
  if (q.sign && !SIGNS[q.sign]) problems.push(`${where}: onbekend bord "${q.sign}"`);
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
