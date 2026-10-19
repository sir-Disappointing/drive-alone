// Leerstof: spiekbriefje en regels per onderwerp.
// topic moet gelijk zijn aan het onderwerp in questions.js om de oefenknop te tonen.
// Velden per regel: title, text, sign (optioneel, uit signs.js), warn (optioneel).
const LEARN = {
  cheatsheet: [
    {
      title: "Maximumsnelheden auto",
      rows: [
        ["Binnen de bebouwde kom", "50 km/u"],
        ["Erf", "stapvoets"],
        ["Buiten de bebouwde kom", "80 km/u"],
        ["Autoweg", "100 km/u"],
        ["Autosnelweg 06.00–19.00", "100 km/u"],
        ["Met aanhanger op autoweg/autosnelweg", "90 km/u"],
      ],
    },
    {
      title: "Alcohol",
      rows: [
        ["Ervaren bestuurder", "0,5 ‰"],
        ["Beginner (eerste 5 jaar)", "0,2 ‰"],
      ],
    },
    {
      title: "Afstanden",
      rows: [
        ["Niet parkeren vanaf kruispunt", "5 m"],
        ["Mistachterlicht bij zicht onder", "50 m"],
        ["Volgafstand (vuistregel)", "2 sec"],
        ["Kinderzitje tot lengte", "1,35 m"],
      ],
    },
    {
      title: "Rijbewijs B",
      rows: [
        ["Aanhanger zonder extra eisen", "≤ 750 kg"],
        ["Combinatie auto + aanhanger", "≤ 3500 kg"],
        ["Met code 96", "≤ 4250 kg"],
        ["Minimale profieldiepte", "1,6 mm"],
      ],
    },
  ],
  topics: [
    {
      topic: "Voorrang",
      intro: "Wie mag eerst? Op het examen draait een groot deel van de vragen hierom.",
      rules: [
        {
          title: "Rechts gaat voor",
          text: "Op een gelijkwaardig kruispunt (geen borden, haaientanden of lichten) verleen je voorrang aan verkeer van rechts.",
        },
        {
          title: "Trams gaan voor",
          text: "Op een gelijkwaardig kruispunt heeft een tram altijd voorrang, ook als hij van links komt.",
        },
        {
          title: "Uitrit en erf",
          text: "Wie een uitrit of een erf verlaat, verleent voorrang aan al het verkeer, ook voetgangers en fietsers.",
        },
        {
          title: "Onverhard voor verhard",
          text: "Wie van een onverharde weg komt, verleent voorrang aan het verkeer op de verharde weg.",
        },
        {
          title: "Rangorde",
          text: "Verkeersregelaar gaat voor verkeerslichten, verkeerslichten gaan voor borden, borden gaan voor de verkeersregels.",
        },
      ],
      thumbs: [
        "Trams gaan altijd voor op een gelijkwaardig kruispunt.",
        "Voorrang hebben is niet hetzelfde als voorrang krijgen: blijf opletten.",
      ],
    },
  ],
};
