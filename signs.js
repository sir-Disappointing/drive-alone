// Verkeerstekens die geen bord zijn en dus niet in borden/ staan, als inline SVG.
const SIGNS = (function () {
  const RED = "#d52b1e";
  const svg = (body, label) =>
    `<svg viewBox="0 0 100 100" width="120" height="120" role="img" aria-label="${label}">${body}</svg>`;

  return {
    "rood-kruis": svg(
      `<rect x="4" y="4" width="92" height="92" rx="6" fill="#111"/>
       <line x1="25" y1="25" x2="75" y2="75" stroke="${RED}" stroke-width="10" stroke-linecap="round"/>
       <line x1="75" y1="25" x2="25" y2="75" stroke="${RED}" stroke-width="10" stroke-linecap="round"/>`,
      "Rood kruis boven rijstrook"
    ),
  };
})();

// Geeft HTML voor een bord: de officiële afbeelding uit borden/ als die er is, anders een inline SVG.
function signMarkup(code) {
  const sign = typeof SIGN_DATA !== "undefined" && SIGN_DATA.find((s) => s.code === code);
  if (sign) {
    const img = document.createElement("img");
    img.src = sign.file;
    img.alt = `Bord ${sign.code}: ${sign.name}`;
    img.loading = "lazy";
    img.decoding = "async";
    return img.outerHTML;
  }
  return SIGNS[code] || "";
}
