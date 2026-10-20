// Controleert of de assistent bij gewone vragen de juiste bronnen vindt.
// Gebruik: node tools/check-retrieval.mjs
//
// Per vraag moet minstens één verwacht stuk meekomen. Een verwachting die op ":" eindigt,
// telt voor alle stukken die zo beginnen (bijvoorbeeld "leren:Inhalen:").
import KNOWLEDGE from "../worker/src/knowledge.js";
import { retrieve } from "../assistant-retrieve.mjs";

const CASES = [
  ["Heeft een tram voorrang op een gelijkwaardig kruispunt?", ["rvv:15", "leren:Voorrang:Trams"]],
  ["Wanneer mag ik mijn mistachterlicht aan doen?", ["rvv:34", "leren:Verlichting:Mistachterlicht"]],
  ["Mag ik rechts inhalen op de snelweg?", ["rvv:11", "rvv:13", "leren:Inhalen:Rechts"]],
  ["Hoe dicht bij een kruispunt mag ik parkeren?", ["rvv:24", "leren:Stilstaan en parkeren:"]],
  ["Hoe hard mag je op een erf?", ["rvv:45", "rvv:1:erf", "leren:Stilstaan en parkeren:Blauwe zone en erf"]],
  ["Wie gaat voor?", ["leren:Voorrang:"]],
  ["Wie mag er eerst bij een kruispunt zonder borden?", ["leren:Voorrang:Rechts gaat voor", "rvv:15"]],
  ["Wat betekent bord B6?", ["bord:B6"]],
  ["Wat betekent B6 precies?", ["bord:B6"]],
  ["Mag ik bellen met mijn telefoon in de hand?", ["leren:Alcohol en afleiding:Telefoon", "rvv:61a"]],
  ["Hoeveel mag ik drinken als beginnend bestuurder?", ["leren:Alcohol en afleiding:", "wvw:8"]],
  ["Er komt een ambulance met sirene achter me, wat moet ik doen?", ["rvv:51", "leren:Voorrang:Voorrangsvoertuigen"]],
  ["Wie gaat voor op een rotonde?", ["leren:Voorrang:Rotonde", "rvv:15"]],
  ["Hoe hard mag ik met een caravan op de snelweg?", ["leren:Snelheid:Met aanhanger", "rvv:22", "leren:Autosnelweg:Caravan"]],
  ["Wat is het verschil tussen stilstaan en parkeren?", ["leren:Stilstaan en parkeren:Stilstaan of parkeren?", "rvv:1:parkeren"]],
  ["Wat moet ik doen bij pech op de snelweg?", ["leren:Autosnelweg:Pech", "rvv:43"]],
  ["Mag een kind voorin zitten zonder kinderzitje?", ["leren:Kinderen en gordels:", "rvv:59"]],
  ["Wat doe je bij een oranje stoplicht?", ["leren:Verkeerstekens:Geel licht", "rvv:68"]],
  ["Wanneer gebruik je grootlicht?", ["leren:Verlichting:Grootlicht", "rvv:32"]],
  ["Hoe groot moet mijn volgafstand zijn?", ["leren:Afstand en remmen:Volgafstand"]],
  ["Wie heeft voorrang als ik uit een uitrit kom?", ["leren:Voorrang:Uitrit", "rvv:54"]],
  ["Mag ik keren op een autosnelweg?", ["rvv:43", "leren:Autosnelweg:Verboden"]],
  ["Wat betekenen haaientanden?", ["leren:Verkeerstekens:Haaientanden", "rvv:80", "bord:B6"]],
  ["Moet ik een bus voor laten gaan die van de halte wegrijdt?", ["leren:Voorrang:Bus", "rvv:50"]],
  ["Wat zijn de regels bij een overweg?", ["rvv:52", "leren:Voorrang:Overweg"]],
  ["Wat betekent een gele streep op de stoeprand?", ["leren:Verkeerstekens:Gele strepen", "rvv:24"]],
  ["Hoe lang is mijn rijbewijs geldig?", ["leren:Rijbewijs en voertuig:"]],
  ["Wat moet ik doen na een aanrijding?", ["leren:Gedrag en ongevallen:", "wvw:7"]],
  ["Waar moet ik op letten bij fietsers?", ["leren:Andere weggebruikers:Fietsers"]],
  ["Mag ik een witte doorgetrokken streep overschrijden?", ["leren:Verkeerstekens:Witte strepen", "rvv:76"]],
];

let failed = 0;
let chars = 0;
let pieces = 0;
for (const [q, expected] of CASES) {
  const got = retrieve(KNOWLEDGE, q);
  const ids = got.map((c) => c.id);
  const ok = expected.some((e) => ids.some((id) => (e.endsWith(":") ? id.startsWith(e) : id === e || id.startsWith(e))));
  chars += got.reduce((n, c) => n + c.title.length + c.text.length, 0);
  pieces += got.length;
  if (!ok) {
    failed++;
    console.log(`MIS  ${q}\n     verwacht: ${expected.join(", ")}\n     gevonden: ${ids.join(", ") || "(niets)"}`);
  }
}

// Een vervolgvraag zonder onderwerp moet het onderwerp van de vorige vraag houden.
const follow = retrieve(KNOWLEDGE, "En binnen de bebouwde kom?", "Hoe hard mag ik met een caravan op de snelweg?").map((c) => c.id);
if (!follow.some((id) => id.startsWith("leren:Snelheid:") || id === "rvv:21" || id === "rvv:22")) {
  failed++;
  console.log(`MIS  vervolgvraag\n     gevonden: ${follow.join(", ")}`);
}

const kern = Math.round(KNOWLEDGE.core.length / 3.6);
const bronnen = Math.round(chars / CASES.length / 3.6);
console.log(`${CASES.length + 1 - failed}/${CASES.length + 1} goed. Gemiddeld ${(pieces / CASES.length).toFixed(1)} stukken, ~${bronnen} tokens bronnen per vraag (kern ~${kern}).`);
process.exit(failed ? 1 : 0);
