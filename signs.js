// Vereenvoudigde verkeersborden als inline SVG.
// Kleuren benaderen de Nederlandse borden; vormen zijn versimpeld.
const SIGNS = (function () {
  const RED = "#d52b1e";
  const BLUE = "#1f4e9c";
  const ORANGE = "#f7a600";

  const svg = (body, label) =>
    `<svg viewBox="0 0 100 100" width="120" height="120" role="img" aria-label="${label}">${body}</svg>`;

  const ring = (fill) =>
    `<circle cx="50" cy="50" r="46" fill="${RED}"/><circle cx="50" cy="50" r="35" fill="${fill}"/>`;

  return {
    stop: svg(
      `<polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" fill="${RED}" stroke="#fff" stroke-width="3"/>
       <text x="50" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="28" fill="#fff">STOP</text>`,
      "Stopbord"
    ),
    "voorrang-verlenen": svg(
      `<polygon points="4,10 96,10 50,92" fill="${RED}"/>
       <polygon points="20,20 80,20 50,73" fill="#fff"/>`,
      "Voorrang verlenen"
    ),
    voorrangsweg: svg(
      `<polygon points="50,2 98,50 50,98 2,50" fill="#fff" stroke="#333" stroke-width="2"/>
       <polygon points="50,20 80,50 50,80 20,50" fill="${ORANGE}"/>`,
      "Voorrangsweg"
    ),
    "einde-voorrangsweg": svg(
      `<polygon points="50,2 98,50 50,98 2,50" fill="#fff" stroke="#333" stroke-width="2"/>
       <polygon points="50,20 80,50 50,80 20,50" fill="${ORANGE}"/>
       <line x1="30" y1="70" x2="70" y2="30" stroke="#222" stroke-width="5"/>
       <line x1="24" y1="62" x2="62" y2="24" stroke="#222" stroke-width="3"/>
       <line x1="38" y1="76" x2="76" y2="38" stroke="#222" stroke-width="3"/>`,
      "Einde voorrangsweg"
    ),
    inrijverbod: svg(
      `<circle cx="50" cy="50" r="46" fill="${RED}"/>
       <rect x="18" y="42" width="64" height="16" fill="#fff"/>`,
      "Verboden in te rijden"
    ),
    gesloten: svg(ring("#fff"), "Gesloten voor voertuigen in beide richtingen"),
    parkeerverbod: svg(
      `${ring(BLUE)}<line x1="25" y1="25" x2="75" y2="75" stroke="${RED}" stroke-width="10"/>`,
      "Parkeerverbod"
    ),
    stopverbod: svg(
      `${ring(BLUE)}
       <line x1="25" y1="25" x2="75" y2="75" stroke="${RED}" stroke-width="10"/>
       <line x1="75" y1="25" x2="25" y2="75" stroke="${RED}" stroke-width="10"/>`,
      "Stopverbod"
    ),
    eenrichting: svg(
      `<rect x="2" y="22" width="96" height="56" rx="4" fill="${BLUE}" stroke="#fff" stroke-width="3"/>
       <polygon points="14,44 62,44 62,34 86,50 62,66 62,56 14,56" fill="#fff"/>`,
      "Eenrichtingsweg"
    ),
    "max-30": svg(
      `${ring("#fff")}
       <text x="50" y="63" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="36" fill="#111">30</text>`,
      "Maximumsnelheid 30"
    ),
    "rood-kruis": svg(
      `<rect x="4" y="4" width="92" height="92" rx="6" fill="#111"/>
       <line x1="25" y1="25" x2="75" y2="75" stroke="${RED}" stroke-width="10" stroke-linecap="round"/>
       <line x1="75" y1="25" x2="25" y2="75" stroke="${RED}" stroke-width="10" stroke-linecap="round"/>`,
      "Rood kruis boven rijstrook"
    ),
  };
})();
