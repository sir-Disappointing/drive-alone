// Tekent een kruispunt van bovenaf als SVG, voor voorrangsvragen.
//
// Een scène beschrijft de weg en de weggebruikers:
//   {
//     layout: "cross" | "rotonde",
//     arms: ["n", "e", "s", "w"],          // welke wegen er zijn (standaard alle vier)
//     haai: ["e", "w"],                    // haaientanden op deze toeritten
//     signs: { s: "B6" },                  // bord rechts van de toerit (code uit borden/)
//     tram: "ns" | "ew",                   // trambaan midden over de weg
//     unpaved: ["w"],                      // onverharde weg
//     zebra: ["s"],                        // zebrapad over deze toerit
//     cyclepath: true,                     // fietspad langs de oostkant van de noord-zuidweg
//     vehicles: [{ id: "A", kind: "car", from: "s", go: "left", color: "blue", me: true }],
//     alt: "Beschrijving voor schermlezers"
//   }
// Voertuigen: car, truck, bus, tram, bike, ped, ambulance. Richting: straight, left, right.
// Op een rotonde: { kind: "car", ring: "e" } staat op de rotonde, bij de oostelijke toerit (of graden met de klok mee vanaf onder).
// Alles is in het Nederlandse rechtsverkeer: je rijdt rechts, rotondes linksom.
const SCENES = (function () {
  const C = 200; // midden
  const W = 44; // halve wegbreedte (rijstrook = W)
  const R = 104; // buitenstraal rotonde
  const ANGLE = { s: 0, w: 90, n: 180, e: 270 };
  const COLORS = {
    blue: "#2f6fd6",
    red: "#d23b32",
    green: "#2e9b55",
    yellow: "#f2b705",
    white: "#f4f4f4",
    black: "#2a2d33",
    orange: "#ef7d22",
    purple: "#7d4cc2",
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
  const rot = (x, y, a) => {
    const r = (a * Math.PI) / 180;
    const dx = x - C;
    const dy = y - C;
    return [C + dx * Math.cos(r) - dy * Math.sin(r), C + dx * Math.sin(r) + dy * Math.cos(r)];
  };
  const n = (v) => Math.round(v * 10) / 10;

  // ------------------------------------------------------------ weg

  function armRect(arm, layout) {
    const start = layout === "rotonde" ? C + R - 10 : C + W;
    return `<rect x="${C - W}" y="${start}" width="${2 * W}" height="${400 - start}" fill="url(#asphalt)" transform="rotate(${ANGLE[arm]} ${C} ${C})"/>`;
  }

  function armMarkings(arm, spec) {
    const a = ANGLE[arm];
    const start = spec.layout === "rotonde" ? C + R + 4 : C + W + 4;
    let out = "";
    // middenstreep (onderbroken)
    out += `<line x1="${C}" y1="${start + 26}" x2="${C}" y2="400" stroke="#fff" stroke-width="2.5" stroke-dasharray="14 10" transform="rotate(${a} ${C} ${C})"/>`;
    if (spec.unpaved && spec.unpaved.includes(arm)) {
      out += `<rect x="${C - W}" y="${spec.layout === "rotonde" ? C + R - 10 : C + W}" width="${2 * W}" height="400" fill="url(#gravel)" transform="rotate(${a} ${C} ${C})"/>`;
    }
    if (spec.zebra && spec.zebra.includes(arm)) {
      let z = "";
      for (let x = C - W + 4; x < C + W - 4; x += 12) z += `<rect x="${x}" y="${start + 30}" width="7" height="26" fill="#fff"/>`;
      out += `<g transform="rotate(${a} ${C} ${C})">${z}</g>`;
    }
    if (spec.haai && spec.haai.includes(arm)) {
      let t = "";
      for (let i = 0; i < 4; i++) {
        const x0 = C + 2 + i * 10.5;
        t += `<polygon points="${x0},${start} ${x0 + 9},${start} ${x0 + 4.5},${start + 14}" fill="#fff"/>`;
      }
      out += `<g transform="rotate(${a} ${C} ${C})">${t}</g>`;
    }
    return out;
  }

  function signAt(arm, code, layout) {
    const start = layout === "rotonde" ? C + R : C + W;
    const [x, y] = rot(C + W + 22, start + 34, ANGLE[arm]);
    const s = 30;
    return `<image href="borden/${esc(code)}.svg" x="${n(x - s / 2)}" y="${n(y - s / 2)}" width="${s}" height="${s}"/>`;
  }

  // ------------------------------------------------------------ voertuigen (kijkrichting omhoog, midden op 0,0)

  function body(kind, color) {
    const fill = COLORS[color] || color || COLORS.blue;
    switch (kind) {
      case "truck":
        return `<rect x="-14" y="-36" width="28" height="72" rx="4" fill="${fill}" stroke="#1b1d22" stroke-width="1.5"/><rect x="-12" y="-34" width="24" height="16" rx="3" fill="#fff" opacity=".85"/><rect x="-10" y="-31" width="20" height="7" rx="2" fill="#9fc3e8"/>`;
      case "bus":
        return `<rect x="-13" y="-42" width="26" height="84" rx="5" fill="${fill}" stroke="#1b1d22" stroke-width="1.5"/><rect x="-10" y="-39" width="20" height="8" rx="2" fill="#9fc3e8"/><rect x="-11" y="-26" width="3" height="56" fill="#9fc3e8"/><rect x="8" y="-26" width="3" height="56" fill="#9fc3e8"/>`;
      case "tram":
        return `<rect x="-13" y="-58" width="26" height="116" rx="8" fill="#f5c400" stroke="#1b1d22" stroke-width="1.5"/><rect x="-10" y="-54" width="20" height="10" rx="3" fill="#9fc3e8"/><rect x="-10" y="44" width="20" height="10" rx="3" fill="#9fc3e8"/><line x1="-13" y1="-6" x2="13" y2="-6" stroke="#1b1d22" stroke-width="1.2"/><line x1="-13" y1="20" x2="13" y2="20" stroke="#1b1d22" stroke-width="1.2"/>`;
      case "bike":
        return `<rect x="-2" y="-14" width="4" height="28" rx="2" fill="#2a2d33"/><ellipse cx="0" cy="1" rx="7" ry="5" fill="${fill}" stroke="#1b1d22" stroke-width="1.2"/><circle cx="0" cy="-2" r="3.6" fill="#f0c9a0" stroke="#1b1d22" stroke-width="1"/>`;
      case "ped":
        return `<ellipse cx="0" cy="0" rx="7" ry="5" fill="${fill}" stroke="#1b1d22" stroke-width="1.2"/><circle cx="0" cy="0" r="3.6" fill="#f0c9a0" stroke="#1b1d22" stroke-width="1"/>`;
      case "ambulance":
        // Blauw licht én geluidsgolven van de sirene: pas dan is het een voorrangsvoertuig.
        return `<rect x="-13" y="-26" width="26" height="52" rx="5" fill="#f4f4f4" stroke="#1b1d22" stroke-width="1.5"/><rect x="-13" y="2" width="26" height="6" fill="#d23b32"/><rect x="-10" y="-20" width="20" height="8" rx="2" fill="#9fc3e8"/><rect class="scene-blue" x="-8" y="-9" width="16" height="5" rx="2" fill="#2f6fd6"/><path class="scene-blink" d="M-18 -34 q18 -12 36 0 M-24 -42 q24 -16 48 0" fill="none" stroke="#2f6fd6" stroke-width="2" stroke-linecap="round"/>`;
      default:
        return `<rect x="-12" y="-23" width="24" height="46" rx="7" fill="${fill}" stroke="#1b1d22" stroke-width="1.5"/><rect x="-9" y="-14" width="18" height="9" rx="2" fill="#cfe3f5"/><rect x="-9" y="9" width="18" height="6" rx="2" fill="#cfe3f5"/>`;
    }
  }

  const LENGTH = { car: 23, truck: 36, bus: 42, tram: 58, bike: 14, ped: 6, ambulance: 26 };

  // Positie en route van een voertuig dat van arm "s" komt (daarna gedraaid naar de echte arm).
  function approach(v, spec) {
    const len = LENGTH[v.kind] || 23;
    const edge = spec.layout === "rotonde" ? C + R + 4 : C + W + 4;
    const gap = v.gap === undefined ? 30 : v.gap;
    let x = C + W / 2; // rechter rijstrook
    if (v.kind === "tram") x = C;
    if (v.kind === "bike") x = spec.cyclepath ? C + W + 13 : C + W - 7;
    if (v.kind === "ped") x = C + W + 13;
    const front = edge + gap;
    const y = front + len;
    return { x, y, front };
  }

  function routePath(v, p, spec) {
    const go = v.go || "straight";
    const x = p.x;
    const f = p.front;
    if (spec.layout === "rotonde") {
      // Linksom over de rotonde (op het scherm: onder → rechts → boven → links), dan de afslag af.
      const ringPt = (phi) => [C + 74 * Math.sin((phi * Math.PI) / 180), C + 74 * Math.cos((phi * Math.PI) / 180)];
      const target = { right: 70, straight: 160, left: 250 }[go] || 160;
      const exit = { right: [C + R + 40, C + W / 2], straight: [C - W / 2, C - R - 40], left: [C - R - 40, C - W / 2] }[go] || [C - W / 2, C - R - 40];
      let d = `M ${n(x)} ${n(f)}`;
      for (let phi = 20; phi <= target; phi += 10) d += ` L ${n(ringPt(phi)[0])} ${n(ringPt(phi)[1])}`;
      return `${d} L ${n(exit[0])} ${n(exit[1])}`;
    }
    if (go === "right") return `M ${n(x)} ${n(f)} L ${n(x)} ${C + W + 2} Q ${n(x)} ${C + W / 2} ${C + W + 4} ${C + W / 2} L ${C + W + 80} ${C + W / 2}`;
    if (go === "left") return `M ${n(x)} ${n(f)} L ${n(x)} ${C + W} Q ${n(x)} ${C - W / 2} ${C - W - 2} ${C - W / 2} L ${C - W - 80} ${C - W / 2}`;
    return `M ${n(x)} ${n(f)} L ${n(x)} ${C - W - 70}`;
  }

  function vehicle(v, spec) {
    let x;
    let y;
    let heading;
    let route = "";
    if (spec.layout === "rotonde" && v.ring !== undefined) {
      // Positie op de ring: een windrichting ("e") of graden met de klok mee vanaf onder.
      const at = typeof v.ring === "string" ? ANGLE[v.ring] : v.ring;
      [x, y] = rot(C, C + 74, at);
      heading = 90 + at; // linksom rijden
    } else {
      const a = ANGLE[v.from || "s"];
      const p = approach(v, spec);
      [x, y] = rot(p.x, p.y, a);
      heading = a;
      if (v.go !== "none" && v.kind !== "ped") {
        route = `<path class="scene-route" d="${routePath(v, p, spec)}" transform="rotate(${a} ${C} ${C})" fill="none" stroke="${v.me ? "#1a4fa0" : "#2a2d33"}" stroke-width="3" stroke-dasharray="7 6" stroke-linecap="round" marker-end="url(#arrow${v.me ? "-me" : ""})" opacity=".85"/>`;
      }
    }
    const blink =
      v.go === "left" || v.go === "right"
        ? `<circle class="scene-blink" cx="${v.go === "left" ? -10 : 10}" cy="-${(LENGTH[v.kind] || 23) - 3}" r="3.4" fill="#ffb000"/>`
        : "";
    const ring = v.me ? `<circle r="${(LENGTH[v.kind] || 23) + 8}" fill="none" stroke="#1a4fa0" stroke-width="2.5" stroke-dasharray="4 4" opacity=".9"/>` : "";
    const veh = `<g class="scene-vehicle" data-id="${esc(v.id)}" transform="translate(${n(x)} ${n(y)}) rotate(${heading})">${ring}${body(v.kind, v.color)}${blink}</g>`;

    // Label rechtop, aan de rechterkant van het voertuig (gezien in de rijrichting).
    const off = v.kind === "bike" || v.kind === "ped" ? 20 : 30;
    const h = (heading * Math.PI) / 180;
    const [lx, ly] = [x + off * Math.cos(h), y + off * Math.sin(h)];
    const text = v.me ? "Jij" : v.id;
    const wLabel = v.me ? 30 : 22;
    const label = `<g class="scene-label" data-id="${esc(v.id)}"><rect x="${n(lx - wLabel / 2)}" y="${n(ly - 11)}" width="${wLabel}" height="22" rx="11" fill="${v.me ? "#1a4fa0" : "#fff"}" stroke="#1b1d22" stroke-width="1.5"/><text x="${n(lx)}" y="${n(ly + 5)}" text-anchor="middle" font-family="Overpass, system-ui, sans-serif" font-weight="800" font-size="14" fill="${v.me ? "#fff" : "#1b1d22"}">${esc(text)}</text></g>`;
    return { route, veh, label };
  }

  // ------------------------------------------------------------ geheel

  function render(spec) {
    const layout = spec.layout || "cross";
    const arms = spec.arms || ["n", "e", "s", "w"];
    const s = { ...spec, layout };
    let roads = arms.map((a) => armRect(a, layout)).join("");
    if (layout === "rotonde") {
      roads += `<circle cx="${C}" cy="${C}" r="${R}" fill="url(#asphalt)"/><circle cx="${C}" cy="${C}" r="${R - 58}" fill="#9ccf86" stroke="#fff" stroke-width="3"/>`;
    } else {
      roads += `<rect x="${C - W}" y="${C - W}" width="${2 * W}" height="${2 * W}" fill="url(#asphalt)"/>`;
    }
    let extra = "";
    if (spec.cyclepath) {
      extra += `<rect x="${C + W + 5}" y="0" width="17" height="400" fill="#b4533f"/><line x1="${C + W + 13.5}" y1="0" x2="${C + W + 13.5}" y2="400" stroke="#fff" stroke-width="1" stroke-dasharray="6 8" opacity=".6"/>`;
    }
    if (spec.tram) {
      const a = spec.tram === "ew" ? 90 : 0;
      extra += `<g transform="rotate(${a} ${C} ${C})"><line x1="${C - 7}" y1="0" x2="${C - 7}" y2="400" stroke="#9aa0a8" stroke-width="2"/><line x1="${C + 7}" y1="0" x2="${C + 7}" y2="400" stroke="#9aa0a8" stroke-width="2"/></g>`;
    }
    const marks = arms.map((a) => armMarkings(a, s)).join("");
    const signs = Object.entries(spec.signs || {}).map(([arm, code]) => signAt(arm, code, layout)).join("");
    const parts = (spec.vehicles || []).map((v) => vehicle(v, s));
    const defs = `<defs>
      <pattern id="asphalt" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#5c626b"/><circle cx="2" cy="3" r=".6" fill="#6a7079"/></pattern>
      <pattern id="gravel" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#c8b07a"/><circle cx="3" cy="3" r="1.2" fill="#a88f5c"/><circle cx="8" cy="7" r="1" fill="#b39a66"/></pattern>
      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#2a2d33"/></marker>
      <marker id="arrow-me" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#1a4fa0"/></marker>
    </defs>`;
    return `<svg class="scene" viewBox="0 0 400 400" role="img" aria-label="${esc(spec.alt || "Verkeerssituatie van bovenaf")}">${defs}<rect width="400" height="400" fill="#dfe8d3"/>${roads}${extra}${marks}${signs}${parts.map((p) => p.route).join("")}${parts.map((p) => p.veh).join("")}${parts.map((p) => p.label).join("")}</svg>`;
  }

  return { render };
})();
