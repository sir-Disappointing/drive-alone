// Uitleg per verkeersbord: wat het betekent in gewone taal, waar je op let, en welke borden
// er op lijken. Zelf geschreven en gecontroleerd tegen het RVV 1990 en de onderzoeksnotities.
// Velden: short (korte naam), meaning, tips (lijst), confuse (lijst van { code, diff }), exam (true = examenbelangrijk).
// Borden zonder notitie tonen alleen hun officiële omschrijving.
const SIGN_SERIES = {
  A: { name: "Snelheid", intro: "Ronde borden met een rode rand zijn een maximum, blauwe vierkante borden een advies." },
  B: { name: "Voorrang", intro: "Wie op een kruispunt voorgaat. Borden gaan boven 'rechts gaat voor'." },
  C: { name: "Geslotenverklaringen", intro: "Wie een weg niet in mag. Let op wie wél door mag." },
  D: { name: "Rijrichting", intro: "Blauwe ronde borden met een pijl: je moet de aangegeven richting volgen." },
  E: { name: "Stilstaan en parkeren", intro: "Een schuine streep is niet parkeren, een kruis is niet stilstaan. Blauwe P-borden geven aan waar en voor wie parkeren mag." },
  F: { name: "Overige geboden en verboden", intro: "Inhalen, tegenliggers, keren, bus- en trambanen." },
  G: { name: "Wegtypes", intro: "Welk soort weg je oprijdt, en welke regels daar dus gelden." },
  H: { name: "Bebouwde kom", intro: "Het begin en einde van de bebouwde kom, en daarmee van de standaard 50 km/u." },
  J: { name: "Waarschuwing", intro: "Rode driehoeken waarschuwen voor gevaar verderop. Ze verbieden of gebieden niets." },
  K: { name: "Bewegwijzering", intro: "Wegwijzers. Op het examen vooral om te herkennen." },
  L: { name: "Informatie", intro: "Blauwe rechthoekige borden met informatie, zoals een zebrapad of een doodlopende weg." },
};

const SIGN_NOTES = {
  // ------------------------------------------------------------------ A
  A1: {
    short: "Maximumsnelheid",
    meaning: "Je mag niet harder dan het getal op het bord.",
    tips: [
      "De limiet geldt tot je een ander snelheidsbord of een einde-bord passeert.",
      "Een maximum is geen doel: pas je snelheid aan bij regen, drukte of slecht zicht.",
    ],
    confuse: [{ code: "A4", diff: "A4 is blauw en vierkant: een adviessnelheid, geen verplichting." }],
    exam: true,
  },
  A2: {
    short: "Einde maximumsnelheid",
    meaning: "De limiet van het vorige bord stopt. Daarna geldt weer de standaardlimiet voor die weg.",
    confuse: [{ code: "A1", diff: "A1 begint een limiet, A2 (doorgestreept) beëindigt hem." }],
    exam: true,
  },
  A3: {
    short: "Maximumsnelheid op matrixbord",
    meaning: "Een snelheid in een rode ring boven je rijstrook is de maximumsnelheid voor die strook.",
    tips: ["Dit gaat voor het bord langs de weg, ook als dat een hogere snelheid toestaat."],
    exam: true,
  },
  A4: {
    short: "Adviessnelheid",
    meaning: "Een advies, bijvoorbeeld voor een bocht. Harder rijden is niet verboden, maar wel onverstandig.",
    confuse: [{ code: "A1", diff: "A1 is rond met een rode rand: dat is een verplichte maximumsnelheid." }],
    exam: true,
  },

  // ------------------------------------------------------------------ B
  B1: {
    short: "Voorrangsweg",
    meaning: "Je rijdt op een voorrangsweg. Verkeer uit zijwegen moet jou op elk kruispunt voorlaten.",
    tips: [
      "Geldt tot het bord 'einde voorrangsweg' (B2).",
      "Sla je af, dan laat je rechtdoorgaand verkeer op dezelfde weg nog steeds voorgaan, ook fietsers op het fietspad naast je.",
    ],
    confuse: [{ code: "B3", diff: "B3 (driehoek met kruis) geldt alleen voor het eerstvolgende kruispunt." }],
    exam: true,
  },
  B2: {
    short: "Einde voorrangsweg",
    meaning: "De voorrangsweg houdt op.",
    tips: ["Dit betekent niet automatisch dat jij voorrang moet verlenen. Op het volgende kruispunt kijk je opnieuw welke regel geldt."],
    confuse: [{ code: "B6", diff: "B6 (omgekeerde driehoek) betekent wél dat jij voorrang verleent." }],
    exam: true,
  },
  B3: {
    short: "Voorrangskruispunt",
    meaning: "Op het eerstvolgende kruispunt heb jij voorrang.",
    confuse: [{ code: "B1", diff: "B1 geldt voor de hele weg tot B2, niet voor één kruispunt." }],
    exam: true,
  },
  B4: {
    short: "Voorrang, zijweg links",
    meaning: "Op het volgende kruispunt komt een zijweg van links. Jij hebt voorrang op verkeer uit die zijweg.",
    exam: true,
  },
  B5: {
    short: "Voorrang, zijweg rechts",
    meaning: "Op het volgende kruispunt komt een zijweg van rechts. Jij hebt voorrang op verkeer uit die zijweg.",
    exam: true,
  },
  B6: {
    short: "Voorrang verlenen",
    meaning: "Je verleent voorrang aan alle bestuurders op de kruisende weg, van links én van rechts.",
    tips: [
      "Je hoeft niet te stoppen als de weg vrij is. Voorrang verlenen betekent dat de ander ongehinderd verder kan.",
      "Haaientanden op de weg betekenen hetzelfde, ook zonder bord.",
      "Ook fietsers op een kruisend fietspad zijn bestuurders.",
    ],
    confuse: [{ code: "B7", diff: "Bij B7 (STOP) moet je altijd helemaal stilstaan, ook als er niemand komt." }],
    exam: true,
  },
  B7: {
    short: "Stop",
    meaning: "Je stopt helemaal bij de stopstreep en verleent daarna voorrang aan bestuurders op de kruisende weg.",
    tips: ["Ook als er duidelijk niemand aankomt, moet je volledig stilstaan."],
    confuse: [{ code: "B6", diff: "Bij B6 hoef je alleen te stoppen als dat nodig is." }],
    exam: true,
  },

  // ------------------------------------------------------------------ C
  C1: {
    short: "Gesloten in beide richtingen",
    meaning: "Gesloten voor alle voertuigen, ruiters en vee, in beide richtingen.",
    tips: ["Voetgangers mogen er wel in. Kijk naar een onderbord: dat kan uitzonderingen maken, bijvoorbeeld voor bestemmingsverkeer."],
    confuse: [
      { code: "C2", diff: "C2 (rode schijf met witte balk) sluit de weg maar in één richting: de andere kant op mag wel." },
      { code: "C12", diff: "C12 sluit alleen motorvoertuigen uit. Fietsers mogen daar wel in." },
    ],
    exam: true,
  },
  C2: {
    short: "Verboden in te rijden",
    meaning: "Je mag de weg vanaf deze kant niet inrijden. Meestal is het het einde van een eenrichtingsweg.",
    tips: ["Ook niet 'even' om te keren of te laden. Uit de andere richting mag je de weg wel uitrijden."],
    confuse: [{ code: "C1", diff: "C1 (wit met rode rand) sluit de weg in beide richtingen." }],
    exam: true,
  },
  C3: {
    short: "Eenrichtingsweg",
    meaning: "Je rijdt een eenrichtingsweg in. Je mag alleen in de richting van de pijl.",
    exam: true,
  },
  C4: {
    short: "Eenrichtingsweg",
    meaning: "De kruisende weg is een eenrichtingsweg in de richting van de pijl.",
    exam: true,
  },
  C6: {
    short: "Gesloten voor auto's",
    meaning: "Gesloten voor motorvoertuigen op meer dan twee wielen. Motoren en brommers mogen er dus wel in.",
    confuse: [{ code: "C12", diff: "C12 sluit álle motorvoertuigen uit, ook motoren en brommers." }],
    exam: true,
  },
  C7: {
    short: "Gesloten voor vrachtauto's",
    meaning: "Vrachtauto's mogen deze weg niet in.",
  },
  C12: {
    short: "Gesloten voor motorvoertuigen",
    meaning: "Gesloten voor alle motorvoertuigen. Fietsers en voetgangers mogen er wel in.",
    confuse: [
      { code: "C1", diff: "C1 sluit alle voertuigen uit, dus ook fietsen." },
      { code: "C6", diff: "C6 sluit alleen motorvoertuigen op meer dan twee wielen uit." },
    ],
    exam: true,
  },
  C14: {
    short: "Gesloten voor fietsers",
    meaning: "Fietsers mogen deze weg niet in.",
  },
  C16: {
    short: "Gesloten voor voetgangers",
    meaning: "Voetgangers mogen hier niet lopen.",
  },
  C17: {
    short: "Maximale lengte",
    meaning: "Voertuigen die met lading langer zijn dan het getal mogen er niet in.",
    tips: ["Met een aanhanger tel je de lengte van de hele combinatie."],
  },
  C18: {
    short: "Maximale breedte",
    meaning: "Voertuigen die met lading breder zijn dan het getal mogen er niet in.",
  },
  C19: {
    short: "Maximale hoogte",
    meaning: "Voertuigen die met lading hoger zijn dan het getal mogen er niet in.",
    tips: ["Denk aan een dakkoffer, fietsen op het dak of een aanhanger met lading."],
  },
  C22e: {
    short: "Milieuzone",
    meaning: "Begin van een milieuzone of nul-emissiezone. Voertuigen die niet aan de eisen voldoen, mogen er niet in.",
    tips: ["Welke voertuigen en emissieklassen het betreft, staat op het onderbord."],
  },

  // ------------------------------------------------------------------ D
  D1: {
    short: "Rotonde",
    meaning: "Je moet de rotonde rondrijden in de richting van de pijlen.",
    tips: ["Dit bord regelt alleen de rijrichting, geen voorrang. De voorrang komt van haaientanden of het bord B6 bij de ingang."],
    exam: true,
  },
  D2: {
    short: "Rechts (of links) passeren",
    meaning: "Je moet het bord voorbij aan de kant waar de pijl naar wijst.",
  },
  D4: {
    short: "Verplichte rijrichting",
    meaning: "Je moet de richting van de pijl volgen.",
  },

  // ------------------------------------------------------------------ E
  E1: {
    short: "Parkeerverbod",
    meaning: "Je mag hier niet parkeren. Kort stilstaan om direct in of uit te stappen, of om te laden en lossen, mag wel.",
    tips: [
      "Geldt alleen aan de kant van de weg waar het bord staat.",
      "Even een boodschap doen of in de auto op iemand wachten is parkeren.",
    ],
    confuse: [{ code: "E2", diff: "E2 (rood kruis) is een stopverbod: ook kort stilstaan mag niet." }],
    exam: true,
  },
  E2: {
    short: "Stopverbod",
    meaning: "Je mag hier niet stilstaan, ook niet even om iemand te laten uitstappen.",
    tips: ["Geldt alleen aan de kant van de weg waar het bord staat."],
    confuse: [{ code: "E1", diff: "E1 (één schuine streep) is alleen een parkeerverbod." }],
    exam: true,
  },
  E4: {
    short: "Parkeergelegenheid",
    meaning: "Hier mag je parkeren.",
    confuse: [{ code: "E1", diff: "E1 is rond met een rode rand: daar mag je juist niet parkeren." }],
  },
  E5: { short: "Taxistandplaats", meaning: "Alleen voor taxi's." },
  E6: {
    short: "Gehandicaptenparkeerplaats",
    meaning: "Alleen voor een voertuig met een geldige gehandicaptenparkeerkaart die zichtbaar ligt. Staat er een kenteken onder, dan alleen voor dat kenteken.",
    exam: true,
  },
  E7: {
    short: "Laden en lossen",
    meaning: "Alleen voor het direct laden en lossen van goederen. Parkeren mag hier niet.",
  },
  E9: {
    short: "Vergunninghouders",
    meaning: "Parkeren alleen met een vergunning.",
  },
  E10: {
    short: "Blauwe zone",
    meaning: "Begin van een parkeerschijfzone. Je parkeert alleen met een duidelijk zichtbare parkeerschijf en niet langer dan de tijd op het bord.",
    confuse: [{ code: "E11", diff: "E11 (doorgestreept) is het einde van de zone." }],
    exam: true,
  },

  // ------------------------------------------------------------------ F
  F1: {
    short: "Inhaalverbod",
    meaning: "Motorvoertuigen mogen elkaar hier niet inhalen.",
    tips: [
      "Een stilstaand voertuig voorbijrijden is passeren, geen inhalen. Dat mag wel, als het veilig kan.",
      "Geldt tot het bord F2 (einde inhaalverbod).",
    ],
    confuse: [{ code: "F3", diff: "F3 (rode vrachtwagen) verbiedt alleen vrachtauto's om in te halen." }],
    exam: true,
  },
  F2: {
    short: "Einde inhaalverbod",
    meaning: "Het inhaalverbod voor motorvoertuigen stopt.",
  },
  F3: {
    short: "Inhaalverbod vrachtauto's",
    meaning: "Vrachtauto's mogen geen motorvoertuigen inhalen. Voor auto's geldt dit verbod niet.",
    confuse: [{ code: "F1", diff: "F1 geldt voor alle motorvoertuigen, dus ook voor jou." }],
    exam: true,
  },
  F5: {
    short: "Tegenliggers gaan voor",
    meaning: "Bij een versmalling laat jij het verkeer uit de tegengestelde richting eerst gaan.",
    tips: ["Te herkennen aan de rode pijl in een rond bord: rood is voor jou."],
    confuse: [{ code: "F6", diff: "F6 (blauw vierkant) is het omgekeerde: daar ga jij voor en wachten de tegenliggers." }],
    exam: true,
  },
  F6: {
    short: "Jij gaat voor tegenliggers",
    meaning: "Bij een versmalling moeten tegenliggers jou eerst laten gaan.",
    tips: ["Te herkennen aan het blauwe vierkante bord met een witte pijl voor jou."],
    confuse: [{ code: "F5", diff: "F5 (rond, rode pijl voor jou) betekent dat jij moet wachten." }],
    exam: true,
  },
  F7: {
    short: "Keerverbod",
    meaning: "Je mag hier niet keren.",
    exam: true,
  },
  F8: {
    short: "Einde alle verboden",
    meaning: "Alle verboden die eerder met borden zijn aangegeven, houden hier op.",
  },
  F10: {
    short: "Stop (politie, douane)",
    meaning: "Je moet stoppen. Op het bord kan staan wie of waarom, bijvoorbeeld politie of douane.",
  },
  F13: {
    short: "Busbaan",
    meaning: "Rijbaan of rijstrook alleen voor lijnbussen. Met de auto mag je er niet op.",
  },

  // ------------------------------------------------------------------ G
  G1: {
    short: "Autosnelweg",
    meaning: "Begin van een autosnelweg. Alleen voor motorvoertuigen die minstens 60 km/u kunnen én mogen rijden.",
    tips: [
      "Maximaal 130 km/u, maar overdag (06.00–19.00) geldt op bijna alle trajecten 100 km/u.",
      "Keren, achteruitrijden en stilstaan op de rijbaan zijn verboden. De vluchtstrook alleen in noodgevallen.",
    ],
    confuse: [{ code: "G3", diff: "G3 (een auto) is een autoweg: maximaal 100 km/u, voertuigen die minstens 50 km/u kunnen en mogen." }],
    exam: true,
  },
  G3: {
    short: "Autoweg",
    meaning: "Begin van een autoweg. Alleen voor motorvoertuigen die minstens 50 km/u kunnen én mogen rijden. Maximaal 100 km/u.",
    tips: ["Keren en achteruitrijden zijn ook hier verboden."],
    confuse: [{ code: "G1", diff: "G1 is een autosnelweg: minstens 60 km/u en maximaal 130 km/u (overdag meestal 100)." }],
    exam: true,
  },
  G5: {
    short: "Erf",
    meaning: "Je rijdt een erf in, zoals een woonerf. Maximaal 15 km/u.",
    tips: [
      "Voetgangers mogen de hele breedte van de weg gebruiken.",
      "Je parkeert alleen op plekken die daarvoor zijn aangegeven.",
      "'Stapvoets' is een oude regel. Sinds 2013 is het maximaal 15 km/u.",
    ],
    confuse: [{ code: "G7", diff: "G7 (blauw rond, voetgangers) is een voetpad: daar mag je helemaal niet rijden." }],
    exam: true,
  },
  G7: {
    short: "Voetpad",
    meaning: "Alleen voor voetgangers.",
    confuse: [{ code: "G5", diff: "Op een erf (G5) mag je wel rijden, maximaal 15 km/u." }],
  },
  G11: {
    short: "Verplicht fietspad",
    meaning: "Fietsers moeten dit fietspad gebruiken. Auto's en speed pedelecs mogen er niet op.",
    confuse: [
      { code: "G13", diff: "G13 (tekstbord 'fietspad') is een onverplicht fietspad." },
      { code: "G12a", diff: "G12a geldt voor fietsers én bromfietsers." },
    ],
    exam: true,
  },
  G12a: {
    short: "Fiets/bromfietspad",
    meaning: "Pad voor fietsers en bromfietsers samen.",
  },
  G13: {
    short: "Onverplicht fietspad",
    meaning: "Een fietspad dat fietsers mogen gebruiken, maar niet moeten.",
  },

  // ------------------------------------------------------------------ H
  H1: {
    short: "Begin bebouwde kom",
    meaning: "Hier begint de bebouwde kom. Zonder andere borden geldt nu maximaal 50 km/u.",
    tips: ["Binnen de bebouwde kom geef je een bus de gelegenheid om van de halte weg te rijden als hij richting aangeeft."],
    confuse: [{ code: "H2", diff: "H2 (doorgestreept) is het einde: daarna geldt 80 km/u, tenzij anders aangegeven." }],
    exam: true,
  },
  H2: {
    short: "Einde bebouwde kom",
    meaning: "Hier eindigt de bebouwde kom. Zonder andere borden geldt nu maximaal 80 km/u.",
    exam: true,
  },

  // ------------------------------------------------------------------ J
  J8: { short: "Gevaarlijk kruispunt", meaning: "Waarschuwing voor een gevaarlijk kruispunt.", tips: ["Een waarschuwingsbord regelt geen voorrang."] },
  J9: { short: "Rotonde", meaning: "Waarschuwing: er komt een rotonde aan." },
  J10: {
    short: "Overweg met slagbomen",
    meaning: "Waarschuwing voor een spoorwegovergang met slagbomen.",
    tips: ["Rijd een overweg alleen op als je hem direct helemaal kunt verlaten."],
    confuse: [{ code: "J11", diff: "J11 (stoomtrein) waarschuwt voor een overweg zónder slagbomen." }],
    exam: true,
  },
  J11: {
    short: "Overweg zonder slagbomen",
    meaning: "Waarschuwing voor een spoorwegovergang zonder slagbomen. Extra goed opletten.",
    confuse: [{ code: "J10", diff: "J10 (hek) is een overweg met slagbomen." }],
    exam: true,
  },
  J14: { short: "Tram", meaning: "Waarschuwing voor een kruising met een tram." },
  J16: { short: "Werk in uitvoering", meaning: "Waarschuwing voor werkzaamheden op of langs de weg." },
  J17: { short: "Rijbaanversmalling", meaning: "De weg wordt smaller." },
  J20: { short: "Slipgevaar", meaning: "Het wegdek kan glad zijn. Rustig rijden, remmen en sturen." },
  J21: {
    short: "Kinderen",
    meaning: "Waarschuwing voor spelende of overstekende kinderen, bijvoorbeeld bij een school.",
    exam: true,
  },
  J22: {
    short: "Zebrapad verderop",
    meaning: "Waarschuwing dat er een voetgangersoversteekplaats aankomt.",
    confuse: [{ code: "L2", diff: "L2 (blauw vierkant) staat bij het zebrapad zelf." }],
    exam: true,
  },
  J24: { short: "Fietsers en bromfietsers", meaning: "Waarschuwing voor overstekende of invoegende fietsers en bromfietsers." },
  J29: { short: "Tegenliggers", meaning: "Waarschuwing: verderop rijdt het verkeer in twee richtingen." },
  J32: { short: "Verkeerslichten", meaning: "Waarschuwing voor verkeerslichten verderop." },
  J33: {
    short: "File",
    meaning: "Waarschuwing voor een file verderop. Op tijd vaart minderen.",
  },
  J37: {
    short: "Gevaar",
    meaning: "Algemene waarschuwing. Het onderbord vertelt wat het gevaar is.",
  },
  J38: { short: "Verkeersdrempel", meaning: "Waarschuwing voor een drempel. Rustig rijden." },

  // ------------------------------------------------------------------ L
  L2: {
    short: "Zebrapad",
    meaning: "Hier is een voetgangersoversteekplaats.",
    tips: [
      "Voetgangers die oversteken of op het punt staan dat te doen, laat je voorgaan.",
      "Vlak voor en op het zebrapad mag je niet inhalen. Binnen 5 meter mag je niet stilstaan.",
    ],
    confuse: [{ code: "J22", diff: "J22 (rode driehoek) waarschuwt dat het zebrapad nog komt." }],
    exam: true,
  },
  L3: {
    short: "Bushalte",
    meaning: "Hier is een bushalte.",
    tips: ["Zonder geblokte markering mag je binnen 12 meter van het haltebord niet stilstaan."],
    exam: true,
  },
  L8: {
    short: "Doodlopende weg",
    meaning: "Deze weg loopt dood.",
  },
  L14: {
    short: "Vluchthaven",
    meaning: "Een plek om bij pech of nood te stoppen, bijvoorbeeld in een tunnel of op een weg zonder vluchtstrook.",
  },
};
