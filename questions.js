// Eigen oefenvragen op basis van de Nederlandse verkeersregels (RVV 1990).
// Dit zijn NIET de officiële CBR-vragen. Controleer feiten altijd tegen de
// actuele RVV 1990 en het officiële CBR-materiaal.
//
// Velden:
//   id          uniek nummer
//   topic       onderwerp (wordt gebruikt voor de filter)
//   question    de vraag
//   options     2 tot 4 antwoorden
//   answer      index van het juiste antwoord in options
//   explanation uitleg na het antwoorden
//   sign        (optioneel) naam van een verkeersbord uit signs.js
//   fixedOrder  (optioneel) true = antwoorden niet husselen (ja/nee, gevaarherkenning)

const GEVAAR = ["Remmen", "Gas loslaten", "Niets"];

const QUESTIONS = [
  // ---------------------------------------------------------------- Voorrang
  {
    id: 1,
    topic: "Voorrang",
    question: "Je nadert een kruispunt zonder verkeersborden, haaientanden of verkeerslichten. Een auto komt van rechts. Wie mag als eerste gaan?",
    options: ["Jij", "De auto van rechts", "Wie het eerst bij het kruispunt is"],
    answer: 1,
    explanation: "Op een gelijkwaardig kruispunt verleen je voorrang aan bestuurders die van rechts komen."
  },
  {
    id: 2,
    topic: "Voorrang",
    question: "Op een gelijkwaardig kruispunt nadert een tram van links. Wie gaat voor?",
    options: ["Jij, want je komt van rechts", "De tram", "Wie het eerst bij het kruispunt is"],
    answer: 1,
    explanation: "Op een gelijkwaardig kruispunt heeft een tram voorrang, ook als hij van links komt. Let op: borden, haaientanden en verkeerslichten gelden ook voor trams."
  },
  {
    id: 3,
    topic: "Voorrang",
    question: "Je rijdt vanaf een parkeerterrein via een uitrit de weg op. Aan wie verleen je voorrang?",
    options: ["Alleen aan auto's van rechts", "Aan al het verkeer op de weg, ook voetgangers en fietsers", "Aan niemand, want je komt van rechts"],
    answer: 1,
    explanation: "Wie een uitrit verlaat, verleent voorrang aan al het verkeer op de weg, inclusief voetgangers op de stoep en fietsers."
  },
  {
    id: 4,
    topic: "Voorrang",
    question: "Je rijdt over een onverharde weg en komt bij een verharde weg. Er staan geen borden. Wat geldt?",
    options: ["Rechts gaat voor", "Je verleent voorrang aan het verkeer op de verharde weg", "Het verkeer op de verharde weg moet jou voor laten gaan"],
    answer: 1,
    explanation: "Bestuurders op een onverharde weg verlenen voorrang aan bestuurders op een verharde weg."
  },
  {
    id: 5,
    topic: "Voorrang",
    question: "Op het wegdek voor het kruispunt liggen witte driehoeken met de punt naar jou toe (haaientanden). Wat betekent dat?",
    options: ["Je hebt voorrang", "Je moet voorrang verlenen", "Je moet altijd stoppen"],
    answer: 1,
    explanation: "Haaientanden betekenen dat je voorrang moet verlenen aan het verkeer op de kruisende weg."
  },
  {
    id: 6,
    topic: "Voorrang",
    sign: "stop",
    question: "Je nadert dit bord. Er komt geen verkeer aan. Wat moet je doen?",
    options: ["Langzaam doorrijden", "Volledig stoppen en daarna voorrang verlenen", "Alleen stoppen als er verkeer aankomt"],
    answer: 1,
    explanation: "Bij een stopbord moet je altijd volledig stilstaan, ook als er niemand aankomt. Daarna verleen je voorrang."
  },
  {
    id: 7,
    topic: "Voorrang",
    sign: "voorrangsweg",
    question: "Wat betekent dit bord?",
    options: ["Einde voorrangsweg", "Je rijdt op een voorrangsweg", "Voorrang verlenen"],
    answer: 1,
    explanation: "Op een voorrangsweg moet het verkeer van zijwegen jou voorrang verlenen op kruispunten."
  },
  {
    id: 8,
    topic: "Voorrang",
    sign: "voorrang-verlenen",
    question: "Wat betekent dit bord?",
    options: ["Stoppen verplicht", "Voorrang verlenen aan het verkeer op de kruisende weg", "Je hebt voorrang op het volgende kruispunt"],
    answer: 1,
    explanation: "Je verleent voorrang. Stoppen hoeft alleen als dat nodig is om het andere verkeer voor te laten gaan."
  },
  {
    id: 9,
    topic: "Voorrang",
    question: "Een voetganger staat bij een zebrapad en wil oversteken. Wat doe je?",
    options: ["Doorrijden, de voetganger moet wachten", "Stoppen en de voetganger laten oversteken", "Toeteren zodat de voetganger weet dat je eraan komt"],
    answer: 1,
    explanation: "Voetgangers die op een zebrapad oversteken of op het punt staan dat te doen, laat je voorgaan."
  },
  {
    id: 10,
    topic: "Voorrang",
    question: "Een voetganger met een witte stok wil oversteken op een plek zonder zebrapad. Wat doe je?",
    options: ["Doorrijden, er is geen zebrapad", "De voetganger laten oversteken", "Claxonneren als waarschuwing"],
    answer: 1,
    explanation: "Blinden met een witte stok laat je altijd voorgaan, overal en niet alleen bij een zebrapad. Dat geldt ook voor iedereen die zich moeilijk voortbeweegt."
  },
  {
    id: 11,
    topic: "Voorrang",
    question: "Binnen de bebouwde kom wil een lijnbus vertrekken vanaf een bushalte en geeft richting aan. Wat doe je?",
    options: ["Doorrijden, jij rijdt op de rijbaan", "De bus laten vertrekken", "Snel inhalen voordat de bus wegrijdt"],
    answer: 1,
    explanation: "Binnen de bebouwde kom laat je een lijnbus voorgaan die vanaf een halte wil vertrekken."
  },
  {
    id: 12,
    topic: "Voorrang",
    question: "Je hoort een sirene en ziet achter je een ambulance met blauw zwaailicht. Wat doe je?",
    options: ["Gewoon doorrijden", "Ruimte maken en de ambulance laten passeren", "Hard remmen midden op de weg"],
    answer: 1,
    explanation: "Voertuigen met blauw zwaailicht en sirene verleen je altijd voorrang. Maak op een veilige manier ruimte."
  },
  {
    id: 13,
    topic: "Voorrang",
    question: "Mag je een begrafenisstoet onderbreken om een kruispunt over te steken?",
    options: ["Ja", "Nee"],
    answer: 1,
    fixedOrder: true,
    explanation: "Een stoet, zoals een begrafenisstoet of een militaire colonne, mag je niet onderbreken."
  },
  {
    id: 14,
    topic: "Voorrang",
    question: "Bij de ingang van een rotonde liggen haaientanden. Wie heeft voorrang?",
    options: ["Jij, want je komt van rechts", "Het verkeer dat al op de rotonde rijdt", "Het grootste voertuig"],
    answer: 1,
    explanation: "De haaientanden betekenen dat je voorrang verleent aan het verkeer op de rotonde."
  },
  {
    id: 15,
    topic: "Voorrang",
    question: "Je slaat rechtsaf. Op het fietspad naast je rijdt een fietser rechtdoor. Wie gaat voor?",
    options: ["Jij, want je zit op de rijbaan", "De fietser", "Wie het snelst rijdt"],
    answer: 1,
    explanation: "Afslaand verkeer laat het rechtdoorgaande verkeer op dezelfde weg voorgaan, ook fietsers op het fietspad. Let op je dode hoek."
  },
  {
    id: 16,
    topic: "Voorrang",
    question: "Je wilt linksaf slaan. Een tegenligger rijdt rechtdoor. Wie gaat voor?",
    options: ["Jij", "De tegenligger", "Wie het eerst richting aangeeft"],
    answer: 1,
    explanation: "Afslaand verkeer verleent voorrang aan het tegemoetkomende verkeer dat rechtdoor rijdt."
  },
  {
    id: 17,
    topic: "Voorrang",
    question: "Je verlaat een erf. De uitgang is aangelegd als uitrit: je rijdt over een doorlopende stoep de weg op. Wat geldt?",
    options: ["Rechts gaat voor", "Je verleent voorrang aan al het verkeer", "Het verkeer op de weg moet jou voorlaten"],
    answer: 1,
    explanation: "Een uitgang die als uitrit is aangelegd, behandel je als een uitrit: je laat al het verkeer voorgaan, ook voetgangers en fietsers."
  },
  {
    id: 18,
    topic: "Voorrang",
    question: "Een verkeersregelaar geeft je een stopteken, maar het verkeerslicht is groen. Wat doe je?",
    options: ["Doorrijden, het licht is groen", "Stoppen, de verkeersregelaar gaat voor", "Kiezen wat het veiligst lijkt"],
    answer: 1,
    explanation: "De volgorde is: aanwijzingen van verkeersregelaars, dan verkeerslichten, dan verkeersborden, dan de verkeersregels."
  },

  // ------------------------------------------------ Verkeerslichten en tekens
  {
    id: 19,
    topic: "Verkeerstekens",
    question: "Het verkeerslicht springt op geel (oranje). Je kunt nog veilig stoppen. Wat doe je?",
    options: ["Doorrijden", "Stoppen voor de stopstreep", "Gas geven om het nog te halen"],
    answer: 1,
    explanation: "Geel betekent stoppen, tenzij je zo dichtbij bent dat je niet meer veilig kunt stoppen."
  },
  {
    id: 20,
    topic: "Verkeerstekens",
    question: "Een verkeerslicht knippert geel. Wat betekent dat?",
    options: ["Je moet stoppen", "Het licht is buiten werking: let extra op en volg de borden en voorrangsregels", "Je hebt voorrang"],
    answer: 1,
    explanation: "Een geel knipperlicht betekent: pas op. De gewone voorrangsregels en de borden gelden dan."
  },
  {
    id: 21,
    topic: "Verkeerstekens",
    sign: "rood-kruis",
    question: "Dit teken staat boven jouw rijstrook op de autosnelweg. Wat betekent het?",
    options: ["Rijstrook gesloten, je mag hier niet rijden", "Langzaam rijden", "Alleen voor vrachtverkeer"],
    answer: 0,
    explanation: "Een rood kruis betekent dat de rijstrook dicht is. Er is altijd iets aan de hand, zoals een ongeluk, werk of pech. Verlaat de rijstrook."
  },
  {
    id: 22,
    topic: "Verkeerstekens",
    sign: "inrijverbod",
    question: "Wat betekent dit bord?",
    options: ["Gesloten voor alle voertuigen in beide richtingen", "Verboden in te rijden", "Stopverbod"],
    answer: 1,
    explanation: "Je mag de weg vanaf dit bord niet inrijden. Je ziet het bijvoorbeeld aan het eind van een eenrichtingsweg."
  },
  {
    id: 23,
    topic: "Verkeerstekens",
    sign: "gesloten",
    question: "Wat betekent dit bord?",
    options: ["Gesloten voor alle voertuigen in beide richtingen", "Einde van alle verboden", "Parkeerverbod"],
    answer: 0,
    explanation: "Een witte ronde schijf met rode rand betekent: gesloten voor voertuigen in beide richtingen."
  },
  {
    id: 24,
    topic: "Verkeerstekens",
    sign: "parkeerverbod",
    question: "Wat betekent dit bord?",
    options: ["Stopverbod", "Parkeerverbod", "Verboden in te rijden"],
    answer: 1,
    explanation: "Eén rode schuine streep is een parkeerverbod. Kort stilstaan om in of uit te stappen of te laden en lossen mag wel."
  },
  {
    id: 25,
    topic: "Verkeerstekens",
    sign: "stopverbod",
    question: "Wat betekent dit bord?",
    options: ["Parkeerverbod", "Stopverbod", "Einde parkeerverbod"],
    answer: 1,
    explanation: "Een rood kruis op een blauwe achtergrond is een stopverbod: je mag hier niet stilstaan, ook niet even."
  },
  {
    id: 26,
    topic: "Verkeerstekens",
    sign: "eenrichting",
    question: "Wat betekent dit bord?",
    options: ["Verplichte rijrichting voor fietsers", "Eenrichtingsweg", "Hier rechtsaf slaan"],
    answer: 1,
    explanation: "Je rijdt op een eenrichtingsweg, in de richting van de pijl."
  },
  {
    id: 27,
    topic: "Verkeerstekens",
    question: "In het midden van de weg ligt een doorgetrokken witte streep. Mag je die oversteken om in te halen?",
    options: ["Ja, als er geen tegenligger is", "Nee"],
    answer: 1,
    fixedOrder: true,
    explanation: "Een doorgetrokken streep mag je niet overschrijden. Inhalen waarbij je eroverheen moet, mag dus niet."
  },
  {
    id: 28,
    topic: "Verkeerstekens",
    question: "Wat betekent een onderbroken witte streep in het midden van de weg?",
    options: ["Je mag er nooit overheen", "Je mag er overheen als het veilig is", "Alleen fietsers mogen er overheen"],
    answer: 1,
    explanation: "Een onderbroken streep mag je overschrijden, bijvoorbeeld om in te halen, als het veilig kan."
  },
  {
    id: 29,
    topic: "Verkeerstekens",
    question: "Op de stoeprand staat een gele doorgetrokken streep. Wat betekent dat?",
    options: ["Parkeerverbod", "Stopverbod", "Alleen parkeren voor vergunninghouders"],
    answer: 1,
    explanation: "Langs een gele doorgetrokken streep mag je niet stilstaan."
  },
  {
    id: 30,
    topic: "Verkeerstekens",
    question: "Op de stoeprand staat een gele onderbroken streep. Wat betekent dat?",
    options: ["Parkeerverbod", "Stopverbod", "Langzaam rijden"],
    answer: 0,
    explanation: "Langs een gele onderbroken streep mag je niet parkeren. Kort stilstaan om in of uit te stappen of te laden en lossen mag wel."
  },

  // --------------------------------------------------------------- Snelheid
  {
    id: 31,
    topic: "Snelheid",
    question: "Wat is de maximumsnelheid binnen de bebouwde kom als er geen borden staan?",
    options: ["30 km/u", "50 km/u", "60 km/u"],
    answer: 1,
    explanation: "Binnen de bebouwde kom is de maximumsnelheid 50 km/u, tenzij borden iets anders aangeven."
  },
  {
    id: 32,
    topic: "Snelheid",
    question: "Wat is de maximumsnelheid voor een personenauto buiten de bebouwde kom (geen autoweg of autosnelweg) als er geen borden staan?",
    options: ["60 km/u", "80 km/u", "100 km/u"],
    answer: 1,
    explanation: "Buiten de bebouwde kom geldt 80 km/u, tenzij anders aangegeven."
  },
  {
    id: 33,
    topic: "Snelheid",
    question: "Wat is de maximumsnelheid op een autoweg als er geen borden staan?",
    options: ["80 km/u", "100 km/u", "130 km/u"],
    answer: 1,
    explanation: "Op een autoweg mag je maximaal 100 km/u."
  },
  {
    id: 34,
    topic: "Snelheid",
    question: "Hoe hard mag je overdag (tussen 06.00 en 19.00 uur) maximaal op de meeste autosnelwegen?",
    options: ["100 km/u", "120 km/u", "130 km/u"],
    answer: 0,
    explanation: "Overdag geldt op autosnelwegen maximaal 100 km/u. 's Avonds en 's nachts mag op veel trajecten 120 of 130 km/u, als de borden dat aangeven."
  },
  {
    id: 35,
    topic: "Snelheid",
    question: "Je rijdt met een personenauto met een lichte aanhanger op de autosnelweg. Wat is je maximumsnelheid?",
    options: ["80 km/u", "90 km/u", "100 km/u"],
    answer: 1,
    explanation: "Een personenauto met aanhanger mag op autowegen en autosnelwegen maximaal 90 km/u."
  },
  {
    id: 36,
    topic: "Snelheid",
    question: "Hoe hard mag je maximaal rijden op een erf?",
    options: ["15 km/u", "30 km/u", "50 km/u"],
    answer: 0,
    fixedOrder: true,
    explanation: "Op een erf mag je maximaal 15 km/u. Vroeger stond er 'stapvoets' in de wet; sinds 2013 is dat 15 km/u. Voetgangers mogen de hele breedte van de weg gebruiken."
  },
  {
    id: 37,
    topic: "Snelheid",
    sign: "max-30",
    question: "Je rijdt 40 km/u en passeert dit bord. Wat doe je?",
    options: ["Snelheid aanhouden", "Snelheid verlagen tot maximaal 30 km/u", "Versnellen tot 50 km/u"],
    answer: 1,
    explanation: "Dit bord geeft een maximumsnelheid van 30 km/u aan."
  },
  {
    id: 38,
    topic: "Snelheid",
    question: "Het bord geeft 80 km/u aan, maar het regent hard en het zicht is slecht. Wat doe je?",
    options: ["80 km/u aanhouden, dat mag immers", "Langzamer rijden, aangepast aan de omstandigheden", "Harder rijden om snel uit het slechte weer te komen"],
    answer: 1,
    explanation: "De maximumsnelheid is een maximum. Je moet je snelheid altijd aanpassen aan het weer, het zicht en de drukte."
  },

  // ---------------------------------------------------------------- Inhalen
  {
    id: 39,
    topic: "Inhalen",
    question: "Aan welke kant haal je in de regel in?",
    options: ["Links", "Rechts", "Aan de kant met de meeste ruimte"],
    answer: 0,
    fixedOrder: true,
    explanation: "Je haalt links in. Rechts inhalen mag alleen in uitzonderingen, bijvoorbeeld bij een voertuig dat links voorsorteert."
  },
  {
    id: 40,
    topic: "Inhalen",
    question: "Een auto voor je sorteert links voor en geeft richting aan naar links. Mag je hem rechts inhalen?",
    options: ["Ja, als het veilig kan", "Nee, nooit"],
    answer: 0,
    fixedOrder: true,
    explanation: "Een voertuig dat links voorsorteert en richting aangeeft, mag je rechts inhalen als dat veilig kan."
  },
  {
    id: 41,
    topic: "Inhalen",
    question: "Je wordt ingehaald. Wat mag je niet doen?",
    options: ["Rechts blijven rijden", "Je snelheid verhogen", "Je snelheid gelijk houden"],
    answer: 1,
    explanation: "Als je wordt ingehaald, verhoog je je snelheid niet. Maak het de inhaler juist makkelijk, zodat er geen gevaar ontstaat."
  },
  {
    id: 42,
    topic: "Inhalen",
    question: "Mag je een auto inhalen vlak voor of op een zebrapad?",
    options: ["Ja", "Nee"],
    answer: 1,
    fixedOrder: true,
    explanation: "Vlak voor en op een voetgangersoversteekplaats mag je geen motorvoertuigen inhalen. Een voetganger kan uit het zicht van de auto naast je oversteken."
  },
  {
    id: 43,
    topic: "Inhalen",
    question: "Wat doe je als eerste voordat je gaat inhalen?",
    options: ["Gas geven", "In je spiegels en dode hoek kijken", "Claxonneren"],
    answer: 1,
    explanation: "Controleer eerst of je zelf niet wordt ingehaald: spiegels en dode hoek. Geef daarna richting aan."
  },
  {
    id: 44,
    topic: "Inhalen",
    question: "Mag je inhalen in een onoverzichtelijke bocht?",
    options: ["Ja, als je snel genoeg bent", "Nee", "Alleen buiten de bebouwde kom"],
    answer: 1,
    explanation: "Inhalen mag alleen als je genoeg zicht hebt om het veilig af te ronden. In een onoverzichtelijke bocht heb je dat niet."
  },

  // ----------------------------------------------------- Stilstaan en parkeren
  {
    id: 45,
    topic: "Stilstaan en parkeren",
    question: "Hoe dicht bij een kruispunt mag je niet parkeren?",
    options: ["Binnen 3 meter", "Binnen 5 meter", "Binnen 10 meter"],
    answer: 1,
    explanation: "Je mag niet parkeren binnen 5 meter van een kruispunt."
  },
  {
    id: 46,
    topic: "Stilstaan en parkeren",
    question: "Wat is het verschil tussen stilstaan en parkeren?",
    options: ["Er is geen verschil", "Parkeren is langer stilstaan dan nodig voor in- of uitstappen of laden en lossen", "Parkeren is alleen stilstaan met de motor uit"],
    answer: 1,
    explanation: "Stilstaan om direct in of uit te stappen of te laden en lossen is geen parkeren. Alles wat langer duurt, is parkeren."
  },
  {
    id: 47,
    topic: "Stilstaan en parkeren",
    question: "Mag je stilstaan op een spoorwegovergang?",
    options: ["Ja, als er geen trein komt", "Nee", "Alleen als je in de file staat"],
    answer: 1,
    explanation: "Je mag niet stilstaan op een overweg. Rijd een overweg pas op als je hem helemaal kunt verlaten."
  },
  {
    id: 48,
    topic: "Stilstaan en parkeren",
    question: "Je wilt parkeren in een blauwe zone. Wat moet je gebruiken?",
    options: ["Een parkeerkaart van de gemeente", "Een parkeerschijf", "Niets, het is gratis"],
    answer: 1,
    explanation: "In een blauwe zone parkeer je gratis voor een beperkte tijd, met een parkeerschijf achter de voorruit."
  },
  {
    id: 49,
    topic: "Stilstaan en parkeren",
    question: "Waar mag je op een erf parkeren?",
    options: ["Overal waar ruimte is", "Alleen op de aangegeven parkeerplaatsen", "Nergens"],
    answer: 1,
    explanation: "Op een erf mag je alleen parkeren op plekken die daarvoor zijn aangegeven."
  },
  {
    id: 50,
    topic: "Stilstaan en parkeren",
    question: "Wanneer mag je op de vluchtstrook van een autosnelweg stoppen?",
    options: ["Om te bellen", "Alleen bij pech of een noodgeval", "Om even te pauzeren"],
    answer: 1,
    explanation: "De vluchtstrook is alleen voor noodgevallen. Wil je pauzeren of bellen, ga dan naar een parkeerplaats."
  },

  // ------------------------------------------------------------ Verlichting
  {
    id: 51,
    topic: "Verlichting",
    question: "Wanneer mag je het mistachterlicht aanzetten?",
    options: ["Bij hevige regen", "Als het zicht door mist of sneeuw minder dan 50 meter is", "Altijd als het donker is"],
    answer: 1,
    explanation: "Het mistachterlicht mag alleen aan bij zicht van minder dan 50 meter door mist of sneeuwval. Bij regen niet: dan verblind je achterliggers."
  },
  {
    id: 52,
    topic: "Verlichting",
    question: "Je rijdt 's nachts met grootlicht en er komt een tegenligger aan. Wat doe je?",
    options: ["Grootlicht aanhouden", "Overschakelen op dimlicht", "Alle verlichting uitzetten"],
    answer: 1,
    explanation: "Grootlicht verblindt andere weggebruikers. Schakel op tijd over op dimlicht."
  },
  {
    id: 53,
    topic: "Verlichting",
    question: "Je rijdt overdag een tunnel in. Welke verlichting gebruik je?",
    options: ["Geen", "Dimlicht", "Mistachterlicht"],
    answer: 1,
    explanation: "In een tunnel moet je verlichting voeren, ook overdag. Gebruik dimlicht."
  },
  {
    id: 54,
    topic: "Verlichting",
    question: "Mag je grootlicht gebruiken als je achter een andere auto rijdt?",
    options: ["Ja", "Nee, dan verblind je de bestuurder via de spiegels"],
    answer: 1,
    fixedOrder: true,
    explanation: "Grootlicht verblindt ook voorliggers via hun spiegels. Gebruik dan dimlicht."
  },

  // ------------------------------------------------------------ Autosnelweg
  {
    id: 55,
    topic: "Autosnelweg",
    question: "Je rijdt op een autosnelweg met drie rijstroken. Er rijdt niemand rechts van je. Welke rijstrook gebruik je?",
    options: ["De meest rechtse rijstrook", "De middelste", "De linker"],
    answer: 0,
    fixedOrder: true,
    explanation: "Je houdt zoveel mogelijk rechts. De linker rijstroken gebruik je om in te halen."
  },
  {
    id: 56,
    topic: "Autosnelweg",
    question: "Je rijdt over de invoegstrook de autosnelweg op. Wat doe je?",
    options: ["Aan het eind van de invoegstrook stoppen en wachten", "Snelheid aanpassen aan het verkeer op de snelweg en voorrang verlenen", "Direct naar links, want het verkeer moet jou voorlaten"],
    answer: 1,
    explanation: "Invoegend verkeer verleent voorrang aan het verkeer op de doorgaande rijbaan. Gebruik de invoegstrook om op snelheid te komen."
  },
  {
    id: 57,
    topic: "Autosnelweg",
    question: "Twee rijstroken gaan over in één. Het verkeer rijdt langzaam. Hoe voeg je het best in?",
    options: ["Zo vroeg mogelijk invoegen", "Doorrijden tot het eind en dan om en om invoegen (ritsen)", "Stoppen tot de rijstrook naast je leeg is"],
    answer: 1,
    explanation: "Bij langzaam verkeer rits je: doorrijden tot het eind van de rijstrook en om en om invoegen. Let op: wettelijk verleent wie van rijstrook wisselt voorrang. Ritsen werkt omdat iedereen ruimte geeft."
  },
  {
    id: 58,
    topic: "Autosnelweg",
    question: "Je hebt pech op de autosnelweg en staat op de vluchtstrook. Wat is het veiligst?",
    options: ["In de auto blijven zitten", "Alarmlichten aan, uitstappen aan de veilige kant en achter de vangrail gaan staan", "Op de vluchtstrook naast de auto wachten"],
    answer: 1,
    explanation: "Een auto op de vluchtstrook kan worden aangereden. Ga met alle inzittenden achter de vangrail staan en bel voor hulp."
  },
  {
    id: 59,
    topic: "Autosnelweg",
    question: "Je hebt je afslag gemist op de autosnelweg. Wat doe je?",
    options: ["Op de vluchtstrook achteruit rijden", "Doorrijden naar de volgende afslag", "Keren via de middenberm"],
    answer: 1,
    explanation: "Keren en achteruitrijden op de autosnelweg is verboden en levensgevaarlijk. Neem de volgende afslag."
  },

  // ------------------------------------------------------- Afstand en remmen
  {
    id: 60,
    topic: "Afstand en remmen",
    question: "Welke vuistregel is goed voor de afstand tot je voorligger bij droog weer?",
    options: ["Minimaal 1 seconde", "Minimaal 2 seconden", "Minimaal 1 autolengte"],
    answer: 1,
    explanation: "Houd minimaal 2 seconden afstand. Bij regen, gladheid of slecht zicht houd je meer afstand."
  },
  {
    id: 61,
    topic: "Afstand en remmen",
    question: "Hoe bereken je de stopafstand?",
    options: ["Reactieafstand + remweg", "Alleen de remweg", "Remweg × 2"],
    answer: 0,
    explanation: "De stopafstand is de afstand die je aflegt tijdens het reageren plus de afstand die je nodig hebt om te remmen."
  },
  {
    id: 62,
    topic: "Afstand en remmen",
    question: "Je snelheid verdubbelt. Wat gebeurt er ongeveer met je remweg?",
    options: ["Die blijft gelijk", "Die wordt twee keer zo lang", "Die wordt vier keer zo lang"],
    answer: 2,
    fixedOrder: true,
    explanation: "De remweg groeit met het kwadraat van de snelheid: twee keer zo snel betekent ongeveer vier keer zo'n lange remweg."
  },
  {
    id: 63,
    topic: "Afstand en remmen",
    question: "Je rijdt 72 km/u. Hoeveel meter leg je per seconde af?",
    options: ["7,2 meter", "20 meter", "72 meter"],
    answer: 1,
    fixedOrder: true,
    explanation: "Deel km/u door 3,6 voor meter per seconde: 72 / 3,6 = 20 meter per seconde."
  },
  {
    id: 64,
    topic: "Afstand en remmen",
    question: "Je auto gaat aquaplanen op een natte weg. Wat doe je?",
    options: ["Hard remmen", "Gas loslaten en het stuur recht houden", "Snel bijsturen"],
    answer: 1,
    explanation: "Bij aquaplaning hebben je banden geen grip. Laat het gas los en houd het stuur recht tot je weer grip voelt."
  },
  {
    id: 65,
    topic: "Afstand en remmen",
    question: "Wat is de minimale wettelijke profieldiepte van autobanden in Nederland?",
    options: ["1,0 mm", "1,6 mm", "3,0 mm"],
    answer: 1,
    fixedOrder: true,
    explanation: "Banden moeten minimaal 1,6 mm profiel hebben. Met meer profiel heb je bij regen veel meer grip."
  },

  // --------------------------------------------- Alcohol, telefoon en fitheid
  {
    id: 66,
    topic: "Alcohol en afleiding",
    question: "Wat is de alcohollimiet voor een ervaren bestuurder?",
    options: ["0,2 promille", "0,5 promille", "0,8 promille"],
    answer: 1,
    fixedOrder: true,
    explanation: "Voor ervaren bestuurders is de grens 0,5 promille. Voor beginnende bestuurders is dat 0,2 promille."
  },
  {
    id: 67,
    topic: "Alcohol en afleiding",
    question: "Je hebt je rijbewijs 3 jaar. Welke alcohollimiet geldt voor jou?",
    options: ["0,2 promille", "0,5 promille", "0,8 promille"],
    answer: 0,
    fixedOrder: true,
    explanation: "In de eerste 5 jaar na het halen van je rijbewijs ben je beginnend bestuurder. Dan geldt 0,2 promille."
  },
  {
    id: 68,
    topic: "Alcohol en afleiding",
    question: "Mag je tijdens het rijden je telefoon vasthouden, ook als je alleen op de navigatie kijkt?",
    options: ["Ja, navigatie mag altijd", "Nee, vasthouden is verboden", "Ja, als je langzaam rijdt"],
    answer: 1,
    explanation: "Een telefoon vasthouden tijdens het rijden is verboden, wat je er ook mee doet. Handsfree bellen of een telefoon in een houder mag wel."
  },
  {
    id: 69,
    topic: "Alcohol en afleiding",
    question: "Je merkt dat je moe wordt tijdens een lange rit. Wat helpt echt?",
    options: ["Het raam openzetten", "Een pauze nemen en eventueel even slapen", "De radio harder zetten"],
    answer: 1,
    explanation: "Frisse lucht en muziek helpen maar heel even. Alleen rust helpt echt tegen vermoeidheid."
  },
  {
    id: 70,
    topic: "Alcohol en afleiding",
    question: "Je gebruikt een nieuw medicijn. Hoe weet je of je daarmee mag rijden?",
    options: ["Gewoon proberen", "Lees de bijsluiter of vraag het de apotheker of arts", "Medicijnen hebben nooit invloed op het rijden"],
    answer: 1,
    explanation: "Sommige medicijnen beïnvloeden je rijvaardigheid. Check altijd de bijsluiter of vraag het je apotheker of arts."
  },

  // --------------------------------------------- Kinderen en gordels
  {
    id: 71,
    topic: "Kinderen en gordels",
    question: "Tot welke lengte moeten kinderen in een passend kinderzitje zitten?",
    options: ["1,20 meter", "1,35 meter", "1,50 meter"],
    answer: 1,
    fixedOrder: true,
    explanation: "Kinderen kleiner dan 1,35 meter moeten in een goedgekeurd en passend kinderbeveiligingssysteem. Dat geldt voorin en achterin."
  },
  {
    id: 72,
    topic: "Kinderen en gordels",
    question: "Je plaatst een achterwaarts gericht kinderzitje op de voorstoel. Wat moet je doen met de passagiersairbag?",
    options: ["Niets", "Uitschakelen", "Extra opblazen"],
    answer: 1,
    explanation: "Bij een achterwaarts gericht zitje op de voorstoel moet de airbag uit. Een airbag die afgaat, kan het kind ernstig verwonden."
  },
  {
    id: 73,
    topic: "Kinderen en gordels",
    question: "Wie moet in de auto een autogordel dragen, als die aanwezig is?",
    options: ["Alleen de bestuurder", "Alleen de mensen voorin", "Iedereen"],
    answer: 2,
    fixedOrder: true,
    explanation: "Iedereen in de auto moet een gordel dragen als die er is, voorin én achterin."
  },

  // --------------------------------------------- Rijbewijs en voertuig
  {
    id: 74,
    topic: "Rijbewijs en voertuig",
    question: "Met rijbewijs B mag je een aanhanger trekken met een toegestane maximummassa van ten hoogste…",
    options: ["500 kg", "750 kg", "1500 kg"],
    answer: 1,
    fixedOrder: true,
    explanation: "Een aanhanger tot 750 kg mag altijd met B. Zwaarder mag ook, als auto en aanhanger samen niet boven de 3500 kg uitkomen."
  },
  {
    id: 75,
    topic: "Rijbewijs en voertuig",
    question: "Je aanhanger weegt meer dan 750 kg. Wanneer mag je hem toch met rijbewijs B trekken?",
    options: ["Nooit", "Als de toegestane maximummassa van auto en aanhanger samen niet meer is dan 3500 kg", "Alleen binnen de bebouwde kom"],
    answer: 1,
    explanation: "Met B mag het als de combinatie samen niet boven 3500 kg komt. Daarboven heb je code 96 (tot 4250 kg) of BE nodig."
  },
  {
    id: 76,
    topic: "Rijbewijs en voertuig",
    question: "Hoeveel passagiers mag je met rijbewijs B maximaal vervoeren, naast de bestuurder?",
    options: ["6", "8", "12"],
    answer: 1,
    fixedOrder: true,
    explanation: "Met rijbewijs B mag je een voertuig besturen met maximaal 8 zitplaatsen naast de bestuurder."
  },

  // --------------------------------------------- Gevaarherkenning
  // Het echte examen gebruikt animaties. Dit zijn tekstversies.
  {
    id: 77,
    topic: "Gevaarherkenning",
    question: "Je rijdt 50 km/u in een woonstraat met geparkeerde auto's. Vlak voor je rolt een bal tussen twee auto's de weg op. Wat doe je?",
    options: GEVAAR,
    answer: 0,
    fixedOrder: true,
    explanation: "Een bal betekent dat er een kind achteraan kan komen. Rem direct."
  },
  {
    id: 78,
    topic: "Gevaarherkenning",
    question: "Je rijdt op een lege, rechte weg met goed zicht. Er is geen ander verkeer en je rijdt de toegestane snelheid. Wat doe je?",
    options: GEVAAR,
    answer: 2,
    fixedOrder: true,
    explanation: "Er is geen reden om in te grijpen. Blijf rijden en blijf om je heen kijken."
  },
  {
    id: 79,
    topic: "Gevaarherkenning",
    question: "Verderop staat een kind op de stoep, dat naar de overkant kijkt. Het staat nog niet aan de rand. Wat doe je?",
    options: GEVAAR,
    answer: 1,
    fixedOrder: true,
    explanation: "Er is nog geen direct gevaar, maar het kind kan zomaar oversteken. Laat het gas los zodat je kunt remmen als dat nodig is."
  },
  {
    id: 80,
    topic: "Gevaarherkenning",
    question: "De auto direct voor je remt plotseling hard. Wat doe je?",
    options: GEVAAR,
    answer: 0,
    fixedOrder: true,
    explanation: "Je moet direct remmen om een aanrijding te voorkomen."
  },
  {
    id: 81,
    topic: "Gevaarherkenning",
    question: "Op de autosnelweg zie je ver voor je remlichten oplichten. Het verkeer begint in de verte af te remmen. Wat doe je?",
    options: GEVAAR,
    answer: 1,
    fixedOrder: true,
    explanation: "Het gevaar ligt nog ver voor je. Laat het gas los, zodat je rustig kunt afremmen als dat nodig is."
  },
  {
    id: 82,
    topic: "Gevaarherkenning",
    question: "Een voetganger stapt vlak voor je auto het zebrapad op. Wat doe je?",
    options: GEVAAR,
    answer: 0,
    fixedOrder: true,
    explanation: "De voetganger heeft voorrang en is vlakbij. Rem direct."
  },
  {
    id: 83,
    topic: "Gevaarherkenning",
    question: "Je nadert een kruispunt waar je voorrang hebt. Vanuit een zijweg rechts komt een auto met behoorlijke snelheid aanrijden. Het is niet duidelijk of hij gaat stoppen. Wat doe je?",
    options: GEVAAR,
    answer: 1,
    fixedOrder: true,
    explanation: "Voorrang hebben is niet hetzelfde als voorrang krijgen. Laat het gas los, zodat je kunt remmen als hij niet stopt."
  },
  {
    id: 84,
    topic: "Gevaarherkenning",
    question: "Een fietser voor je kijkt over haar linkerschouder en steekt haar linkerarm uit. Ze is nog een stuk voor je. Wat doe je?",
    options: GEVAAR,
    answer: 1,
    fixedOrder: true,
    explanation: "De fietser gaat linksaf en komt voor je langs. Laat het gas los en geef haar de ruimte."
  },

  // ------------------------------------------------- Voorrang (aanvulling)
  {
    id: 85,
    topic: "Voorrang",
    question: "Je slaat linksaf. Een tegenligger slaat op hetzelfde kruispunt rechtsaf, dezelfde straat in. Wie gaat voor?",
    options: ["Jij, want je was er eerst", "De tegenligger die rechtsaf slaat", "Wie van rechts komt"],
    answer: 1,
    explanation: "Wie linksaf slaat, laat tegemoetkomend verkeer dat rechtsaf slaat voorgaan. Ezelsbruggetje: korte bocht gaat voor lange bocht."
  },
  {
    id: 86,
    topic: "Voorrang",
    question: "Je rijdt rechtdoor. Een tegemoetkomende tram slaat voor je linksaf. Wie gaat voor?",
    options: ["Jij, want rechtdoor gaat voor", "De tram", "Wie het eerst bij het kruispunt is"],
    answer: 1,
    explanation: "De regel 'rechtdoor gaat voor' geldt niet voor trams. Een afslaande tram hoeft rechtdoorgaand verkeer niet voor te laten gaan."
  },
  {
    id: 87,
    topic: "Voorrang",
    sign: "einde-voorrangsweg",
    question: "Je passeert dit bord. Betekent dit dat je op het volgende kruispunt voorrang moet verlenen?",
    options: ["Ja, altijd", "Nee, je kijkt op het volgende kruispunt opnieuw welke regel geldt"],
    answer: 1,
    fixedOrder: true,
    explanation: "Einde voorrangsweg betekent alleen dat de voorrangsweg ophoudt. Op het volgende kruispunt bepalen de borden, haaientanden of 'rechts gaat voor' wie voorgaat."
  },
  {
    id: 88,
    topic: "Voorrang",
    question: "Een politieauto rijdt met blauw zwaailicht, maar zonder sirene. Is het een voorrangsvoertuig?",
    options: ["Ja", "Nee, daarvoor zijn blauw licht én sirene nodig"],
    answer: 1,
    fixedOrder: true,
    explanation: "Alleen met blauw zwaailicht én sirene (twee- of drietonige hoorn) is het een voorrangsvoertuig. Wees natuurlijk wel voorzichtig."
  },
  {
    id: 89,
    topic: "Voorrang",
    question: "Een takelwagen rijdt met geel zwaailicht. Moet je hem voorrang verlenen?",
    options: ["Ja", "Nee, geel zwaailicht is alleen een waarschuwing"],
    answer: 1,
    fixedOrder: true,
    explanation: "Geel zwaailicht geeft geen voorrang. Het waarschuwt dat er iets bijzonders aan de hand is."
  },
  {
    id: 90,
    topic: "Voorrang",
    question: "Je nadert een rotonde. Er staan geen borden en er liggen geen haaientanden. Wie gaat voor?",
    options: ["Het verkeer op de rotonde", "Het verkeer van rechts, dus jij als je de rotonde oprijdt", "Het grootste voertuig"],
    answer: 1,
    explanation: "Zonder borden of haaientanden is een rotonde een gelijkwaardig kruispunt: rechts gaat voor. Het bord met de ronde pijlen regelt alleen de rijrichting, geen voorrang."
  },
  {
    id: 91,
    topic: "Voorrang",
    question: "Je rijdt door groen licht. Van rechts komt een auto die door rood rijdt. Welke regel gaat voor?",
    options: ["Rechts gaat voor", "Het verkeerslicht"],
    answer: 1,
    fixedOrder: true,
    explanation: "Verkeerslichten gaan boven de voorrangsregels. Je hoeft de roodrijder geen voorrang te verlenen, maar je moet natuurlijk wel een ongeluk voorkomen."
  },
  {
    id: 92,
    topic: "Voorrang",
    question: "Mag je een overweg oprijden als het verkeer voor je stilstaat en je de overweg niet helemaal kunt verlaten?",
    options: ["Ja, als de lichten niet knipperen", "Nee"],
    answer: 1,
    fixedOrder: true,
    explanation: "Je mag een overweg alleen oprijden als je direct kunt doorrijden en de overweg helemaal vrij kunt maken."
  },
  {
    id: 93,
    topic: "Voorrang",
    question: "Bij een overweg brandt een wit knipperlicht. Wat betekent dat?",
    options: ["Er komt een trein aan", "Er nadert geen trein", "De overweg is buiten werking"],
    answer: 1,
    explanation: "Wit knipperlicht bij een overweg betekent dat er geen trein nadert. Rood knipperlicht betekent stoppen."
  },
  {
    id: 94,
    topic: "Voorrang",
    question: "Het verkeer voor je staat stil. Mag je het kruispunt oprijden als je er waarschijnlijk niet af kunt?",
    options: ["Ja, als je groen hebt", "Nee"],
    answer: 1,
    fixedOrder: true,
    explanation: "Je mag een kruispunt niet blokkeren. Wacht tot je het kruispunt helemaal kunt oversteken."
  },
  {
    id: 95,
    topic: "Voorrang",
    question: "Buiten de bebouwde kom geeft een bus richting aan om van de halte weg te rijden. Moet je hem volgens de wet laten gaan?",
    options: ["Ja, bussen gaan altijd voor", "Nee, die regel geldt alleen binnen de bebouwde kom"],
    answer: 1,
    fixedOrder: true,
    explanation: "Alleen binnen de bebouwde kom geef je een bus de gelegenheid om van de halte weg te rijden. Buiten de kom is wegrijden voor de bus een bijzondere manoeuvre. Ruimte geven is natuurlijk wel netjes."
  },

  // ------------------------------------------ Verkeerstekens (aanvulling)
  {
    id: 96,
    topic: "Verkeerstekens",
    question: "In het midden van de weg liggen een doorgetrokken en een onderbroken streep naast elkaar. Aan jouw kant ligt de onderbroken streep. Mag je erover?",
    options: ["Ja, als het veilig is", "Nee, nooit"],
    answer: 0,
    fixedOrder: true,
    explanation: "Bij een dubbele streep mag je erover vanaf de kant van de onderbroken streep. Vanaf de kant van de doorgetrokken streep niet."
  },
  {
    id: 97,
    topic: "Verkeerstekens",
    question: "Mag je over een verdrijvingsvlak (het vlak met witte schuine strepen) rijden?",
    options: ["Ja, als er niemand is", "Nee"],
    answer: 1,
    fixedOrder: true,
    explanation: "Een verdrijvingsvlak mag je niet gebruiken, ook niet om even in te halen of voor te sorteren."
  },
  {
    id: 98,
    topic: "Verkeerstekens",
    question: "Je staat op een voorsorteerstrook met een pijl naar links. Je bedenkt dat je rechtdoor wilt. Wat doe je?",
    options: ["Toch rechtdoor rijden", "De richting van je voorsorteerstrook volgen en daarna omrijden", "Stoppen en wachten tot je kunt wisselen"],
    answer: 1,
    explanation: "Op een kruispunt moet je de richting volgen van de voorsorteerstrook waarin je staat."
  },
  {
    id: 99,
    topic: "Verkeerstekens",
    question: "Boven jouw rijstrook staat een witte schuine pijl op het matrixbord. Wat betekent dat?",
    options: ["Einde van alle beperkingen", "Verderop is de rijstrook dicht: ga naar de rijstrook waar de pijl naar wijst", "Hier mag je inhalen"],
    answer: 1,
    explanation: "Een witte schuine pijl kondigt een rood kruis aan. Ga op tijd naar de rijstrook waar de pijl naar wijst."
  },
  {
    id: 100,
    topic: "Verkeerstekens",
    question: "Langs de weg staat 100 km/u, maar boven jouw rijstrook staat 70 in een rode ring. Hoe hard mag je?",
    options: ["100 km/u", "70 km/u", "85 km/u"],
    answer: 1,
    fixedOrder: true,
    explanation: "Een snelheid in een rode ring boven je rijstrook is de maximumsnelheid, ook als het bord langs de weg meer toestaat."
  },
  {
    id: 101,
    topic: "Verkeerstekens",
    question: "Het licht springt op geel als je er al vlak voor bent. Je kunt niet meer veilig stoppen. Wat doe je?",
    options: ["Een noodstop maken", "Doorrijden", "Achteruitrijden"],
    answer: 1,
    explanation: "Geel betekent stoppen, behalve als je zo dichtbij bent dat je niet meer veilig kunt stoppen. Dan rijd je door."
  },
  {
    id: 102,
    topic: "Verkeerstekens",
    question: "Gelden haaientanden ook voor voetgangers die willen oversteken?",
    options: ["Ja, voetgangers krijgen dan voorrang", "Nee, haaientanden regelen alleen de voorrang tussen bestuurders"],
    answer: 1,
    fixedOrder: true,
    explanation: "Haaientanden gaan over bestuurders, dus ook fietsers op een kruisend fietspad. Een voetganger krijgt geen voorrang door haaientanden. Op een zebrapad wel."
  },

  // ------------------------------------------------ Snelheid (aanvulling)
  {
    id: 103,
    topic: "Snelheid",
    question: "Het is 21.00 uur. Op de autosnelweg staat geen enkel snelheidsbord. Wat is de maximumsnelheid?",
    options: ["100 km/u", "120 km/u", "130 km/u"],
    answer: 2,
    fixedOrder: true,
    explanation: "Volgens de wet is 130 km/u de maximumsnelheid op de autosnelweg. Overdag geldt op bijna alle trajecten 100 km/u, maar dat wordt met borden aangegeven."
  },
  {
    id: 104,
    topic: "Snelheid",
    question: "Welk voertuig mag de autosnelweg op?",
    options: ["Elk motorvoertuig", "Een motorvoertuig dat minstens 60 km/u kan én mag rijden", "Alleen personenauto's en vrachtauto's"],
    answer: 1,
    explanation: "Op de autosnelweg mag alleen een motorvoertuig dat minstens 60 km/u kan én mag. Voor een autoweg is dat 50 km/u. Het is een eis aan het voertuig, geen minimumsnelheid."
  },
  {
    id: 105,
    topic: "Snelheid",
    question: "Je rijdt met een aanhanger op een gewone weg buiten de bebouwde kom. Hoe hard mag je maximaal?",
    options: ["80 km/u", "90 km/u", "100 km/u"],
    answer: 0,
    fixedOrder: true,
    explanation: "De 90 km/u met aanhanger geldt alleen op autowegen en autosnelwegen. Op een gewone weg buiten de kom is het 80 km/u."
  },

  // ------------------------------------------------- Inhalen (aanvulling)
  {
    id: 106,
    topic: "Inhalen",
    question: "Mag je een tram rechts inhalen?",
    options: ["Ja", "Nee"],
    answer: 0,
    fixedOrder: true,
    explanation: "Trams mag je rechts inhalen. Let op instappende of uitstappende reizigers bij een halte."
  },
  {
    id: 107,
    topic: "Inhalen",
    question: "Je staat in een file op de autosnelweg. De rechter rijstrook rijdt iets sneller. Mag je rechts voorbij?",
    options: ["Ja, in een file mag dat", "Nee, nooit"],
    answer: 0,
    fixedOrder: true,
    explanation: "In een file hoef je niet de meest rechtse rijstrook te volgen en mag je rechts voorbij. Het moet wel echt een file zijn."
  },
  {
    id: 108,
    topic: "Inhalen",
    question: "Op een rustige autosnelweg blijft een auto op de middelste rijstrook hangen. Mag je hem rechts inhalen?",
    options: ["Ja, als het veilig kan", "Nee, je haalt links in"],
    answer: 1,
    fixedOrder: true,
    explanation: "Meerdere rijstroken betekent niet dat rechts inhalen mag. Alleen in een file en in een paar andere uitzonderingen."
  },
  {
    id: 109,
    topic: "Inhalen",
    question: "Mag je vlak voor of op een rotonde rechts inhalen?",
    options: ["Ja", "Nee"],
    answer: 0,
    fixedOrder: true,
    explanation: "Vlak voor en op een rotonde mag je rechts inhalen. Het is een van de uitzonderingen op 'links inhalen'."
  },

  // -------------------------------------- Stilstaan en parkeren (aanvulling)
  {
    id: 110,
    topic: "Stilstaan en parkeren",
    question: "Je laat iemand uitstappen op 3 meter van een kruispunt en rijdt direct weer weg. Mag dat?",
    options: ["Ja, alleen parkeren is binnen 5 meter verboden", "Nee, ook stilstaan is daar verboden"],
    answer: 0,
    fixedOrder: true,
    explanation: "Binnen 5 meter van een kruispunt mag je niet parkeren. Kort stilstaan om iemand te laten uitstappen mag wel, zolang je niet óp het kruispunt staat."
  },
  {
    id: 111,
    topic: "Stilstaan en parkeren",
    question: "Mag je stilstaan binnen 5 meter van een zebrapad?",
    options: ["Ja, als je maar kort stilstaat", "Nee"],
    answer: 1,
    fixedOrder: true,
    explanation: "Op een oversteekplaats en binnen 5 meter daarvan mag je niet eens stilstaan, omdat je het zicht op overstekers wegneemt."
  },
  {
    id: 112,
    topic: "Stilstaan en parkeren",
    question: "Bij een bushalte is geen geblokte markering. Binnen welke afstand van het haltebord mag je niet stilstaan?",
    options: ["5 meter", "12 meter", "20 meter"],
    answer: 1,
    fixedOrder: true,
    explanation: "Zonder geblokte markering mag je binnen 12 meter van het haltebord niet stilstaan."
  },
  {
    id: 113,
    topic: "Stilstaan en parkeren",
    sign: "parkeerverbod",
    question: "Je zet de auto hier neer en wacht 10 minuten in de auto op een vriend. Is dat parkeren?",
    options: ["Nee, want je zit in de auto", "Ja, want het duurt langer dan direct in- of uitstappen"],
    answer: 1,
    fixedOrder: true,
    explanation: "Parkeren is stilstaan langer dan nodig voor direct in- of uitstappen of laden en lossen. Of je in de auto blijft zitten, maakt niet uit."
  },
  {
    id: 114,
    topic: "Stilstaan en parkeren",
    question: "Mag je parkeren voor een uitrit?",
    options: ["Ja, als je in de auto blijft", "Nee"],
    answer: 1,
    fixedOrder: true,
    explanation: "Voor een inrit of uitrit mag je niet parkeren."
  },
  {
    id: 115,
    topic: "Stilstaan en parkeren",
    question: "Mag je stilstaan op een fietsstrook om iemand te laten uitstappen?",
    options: ["Ja, heel even", "Nee"],
    answer: 1,
    fixedOrder: true,
    explanation: "Op een fietsstrook mag je niet stilstaan, ook niet even. Fietsers moeten dan om je heen de rijbaan op."
  },

  // ---------------------------------------------- Verlichting (aanvulling)
  {
    id: 116,
    topic: "Verlichting",
    question: "Het wordt schemerig en je auto heeft dagrijverlichting. Wat doe je?",
    options: ["Niets, dagrijverlichting is genoeg", "Dimlicht aanzetten"],
    answer: 1,
    fixedOrder: true,
    explanation: "Dagrijverlichting brandt vaak alleen voorin. Bij schemer, donker en slecht zicht zet je dimlicht aan, zodat je ook achterlichten voert."
  },
  {
    id: 117,
    topic: "Verlichting",
    question: "Mag je 's nachts binnen de bebouwde kom grootlicht gebruiken?",
    options: ["Nee, nooit", "Ja, als je geen tegenligger hebt en niet vlak achter iemand rijdt"],
    answer: 1,
    fixedOrder: true,
    explanation: "Grootlicht mag ook binnen de bebouwde kom, behalve overdag, bij tegemoetkomend verkeer en als je kort achter een ander voertuig rijdt."
  },
  {
    id: 118,
    topic: "Verlichting",
    question: "Wanneer mag je de claxon gebruiken?",
    options: ["Om iemand te groeten", "Om dreigend gevaar af te wenden", "Om aan te geven dat je haast hebt"],
    answer: 1,
    explanation: "Geluids- en lichtsignalen geef je alleen om dreigend gevaar af te wenden."
  },

  // ---------------------------------------------- Autosnelweg (aanvulling)
  {
    id: 119,
    topic: "Autosnelweg",
    question: "Boven de rechter spitsstrook staat een groene pijl. Je haalt niemand in. Waar rijd je?",
    options: ["Op de spitsstrook", "Op de rijstrook links ervan", "Waar je wilt"],
    answer: 0,
    explanation: "Een open spitsstrook is een gewone rijstrook. Je houdt rechts, dus je rijdt erop als je niet inhaalt."
  },
  {
    id: 120,
    topic: "Autosnelweg",
    question: "Je staat in de file. Je afslag is 300 meter verderop. Mag je over de vluchtstrook naar de afslag rijden?",
    options: ["Ja, in de file mag dat", "Nee, de vluchtstrook is alleen voor noodgevallen"],
    answer: 1,
    fixedOrder: true,
    explanation: "De vluchtstrook gebruik je alleen in een noodgeval, ook als je in de file staat."
  },
  {
    id: 121,
    topic: "Autosnelweg",
    question: "Je trekt een caravan op een autosnelweg met drie rijstroken. Welke rijstroken mag je gebruiken?",
    options: ["Alle drie", "Alleen de twee rechtse", "Alleen de rechtse"],
    answer: 1,
    fixedOrder: true,
    explanation: "Combinaties langer dan 7 meter (zoals auto met caravan) en vrachtauto's mogen op een autosnelweg met drie of meer rijstroken alleen de twee rechtse gebruiken, behalve om voor te sorteren."
  },

  // ------------------------------------ Alcohol en afleiding (aanvulling)
  {
    id: 122,
    topic: "Alcohol en afleiding",
    question: "Je bent beginnend bestuurder. Hoeveel strafpunten leiden tot een melding bij het CBR en een nieuw rijexamen?",
    options: ["1", "2", "3"],
    answer: 1,
    fixedOrder: true,
    explanation: "Met het beginnersrijbewijs leiden 2 strafpunten voor ernstige overtredingen tot een onderzoek naar de rijvaardigheid. Je rijbewijs wordt dan geschorst."
  },
  {
    id: 123,
    topic: "Alcohol en afleiding",
    question: "Op de verpakking van je medicijn staat een gele sticker. Wat betekent dat?",
    options: ["Het medicijn is verlopen", "Het medicijn kan je rijvaardigheid beïnvloeden", "Niet bewaren in de auto"],
    answer: 1,
    explanation: "Een gele sticker betekent dat het medicijn invloed kan hebben op je rijvaardigheid. Lees de bijsluiter voordat je gaat rijden."
  },

  // -------------------------------------- Kinderen en gordels (aanvulling)
  {
    id: 124,
    topic: "Kinderen en gordels",
    question: "Een kind van 10 jaar zit achterin zonder gordel. Wie krijgt de boete?",
    options: ["De ouders", "De bestuurder", "Het kind"],
    answer: 1,
    explanation: "Voor passagiers jonger dan 12 jaar is de bestuurder verantwoordelijk. Vanaf 12 jaar is de passagier dat zelf."
  },
  {
    id: 125,
    topic: "Kinderen en gordels",
    question: "Je neemt incidenteel en over een korte afstand een vriendje van je kind mee. Hij is 6 jaar en 1,20 meter. Je hebt geen extra zitje. Wat mag?",
    options: ["Hij mag voorin met de gordel", "Hij mag achterin met de gewone gordel", "Hij mag niet mee"],
    answer: 1,
    explanation: "Kinderen vanaf 3 jaar en kleiner dan 1,35 meter mogen bij uitzondering, incidenteel en over korte afstand, achterin met de gewone gordel."
  },

  // ------------------------------------ Rijbewijs en voertuig (aanvulling)
  {
    id: 126,
    topic: "Rijbewijs en voertuig",
    question: "Met welke code op je rijbewijs mag je een combinatie van auto en aanhanger tot 4250 kg besturen?",
    options: ["Code 78", "Code 96", "Code 01"],
    answer: 1,
    explanation: "Met code 96 (B+) mag de combinatie maximaal 4250 kg zijn. Zwaarder vraagt om rijbewijs BE."
  },
  {
    id: 127,
    topic: "Rijbewijs en voertuig",
    question: "Waar gaat de grens van 3500 kg voor rijbewijs B over?",
    options: ["Het gewicht van de auto zoals hij nu geladen is", "De toegestane maximummassa op het kentekenbewijs", "Het leeggewicht"],
    answer: 1,
    explanation: "Het gaat om de toegestane maximummassa die op het kentekenbewijs staat, niet om wat de auto op dat moment weegt."
  },
  {
    id: 128,
    topic: "Rijbewijs en voertuig",
    question: "Je auto staat al maanden ongebruikt op straat. Moet hij WA-verzekerd zijn?",
    options: ["Nee, alleen als je ermee rijdt", "Ja, een auto met kenteken moet altijd verzekerd zijn"],
    answer: 1,
    fixedOrder: true,
    explanation: "Een motorrijtuig met kenteken moet altijd minimaal WA-verzekerd zijn, ook als het stilstaat."
  },

  // ----------------------------------------------- Gedrag en ongevallen
  {
    id: 129,
    topic: "Gedrag en ongevallen",
    question: "Je raakt bij het inparkeren een geparkeerde auto. Er is niemand in de buurt. Wat moet je doen?",
    options: ["Doorrijden, er is niemand gewond", "Blijven, of de schade melden bij de politie", "Alleen een briefje achterlaten is genoeg"],
    answer: 1,
    explanation: "Doorrijden na een ongeval is ook strafbaar als er alleen schade is. Zorg dat je gegevens bij de eigenaar komen en meld het bij de politie."
  },
  {
    id: 130,
    topic: "Gedrag en ongevallen",
    question: "Er bestaat geen specifieke regel voor wat je doet. Mag je dan alles?",
    options: ["Ja", "Nee, je mag nooit gevaar of hinder veroorzaken"],
    answer: 1,
    fixedOrder: true,
    explanation: "Artikel 5 van de Wegenverkeerswet verbiedt iedereen om gevaar op de weg te veroorzaken of het verkeer te hinderen. Dat geldt altijd."
  },
  {
    id: 131,
    topic: "Gedrag en ongevallen",
    question: "Je komt bij een ongeval met een gewonde. Wat doe je eerst?",
    options: ["Foto's maken", "Zorgen voor je eigen veiligheid en 112 bellen", "De gewonde direct in je auto naar het ziekenhuis brengen"],
    answer: 1,
    explanation: "Eerst je eigen veiligheid: alarmlichten aan, veiligheidshesje. Bel daarna 112 en help de gewonde zo goed als je kunt."
  },

  // --------------------------------------------------- Andere weggebruikers
  {
    id: 132,
    topic: "Andere weggebruikers",
    question: "Hoeveel fietsers mogen er naast elkaar rijden?",
    options: ["Eén", "Twee", "Drie"],
    answer: 1,
    fixedOrder: true,
    explanation: "Fietsers mogen met zijn tweeën naast elkaar rijden, zolang ze geen gevaar of hinder veroorzaken."
  },
  {
    id: 133,
    topic: "Andere weggebruikers",
    question: "Wat is een speed pedelec volgens de wet?",
    options: ["Een fiets", "Een bromfiets", "Een snorfiets"],
    answer: 1,
    fixedOrder: true,
    explanation: "Een speed pedelec is een bromfiets: met kenteken, verzekering, helm en rijbewijs AM (of B)."
  },
  {
    id: 134,
    topic: "Andere weggebruikers",
    question: "Waar rijdt een bromfiets (45 km/u) binnen de bebouwde kom, als er geen borden staan?",
    options: ["Op het fietspad", "Op de rijbaan", "Op de stoep"],
    answer: 1,
    fixedOrder: true,
    explanation: "Binnen de bebouwde kom rijdt een bromfiets op de rijbaan, tenzij een bord iets anders aangeeft. Dat geldt al sinds 1999."
  },
  {
    id: 135,
    topic: "Andere weggebruikers",
    question: "Mag een voetganger op een erf midden op de weg lopen?",
    options: ["Ja", "Nee, voetgangers moeten aan de kant"],
    answer: 0,
    fixedOrder: true,
    explanation: "Op een erf mogen voetgangers de hele breedte van de weg gebruiken. Daarom mag je er maximaal 15 km/u."
  },

  // --------------------------------------------- Gevaarherkenning (aanvulling)
  {
    id: 136,
    topic: "Gevaarherkenning",
    question: "Binnen de bebouwde kom staat verderop een bus bij de halte. Hij zet zijn richtingaanwijzer aan. Wat doe je?",
    options: GEVAAR,
    answer: 1,
    fixedOrder: true,
    explanation: "Binnen de bebouwde kom geef je de bus de gelegenheid weg te rijden. Laat het gas los."
  },
  {
    id: 137,
    topic: "Gevaarherkenning",
    question: "Vlak voor je stuurt een fietser om een geparkeerde auto heen, jouw rijstrook in. Wat doe je?",
    options: GEVAAR,
    answer: 0,
    fixedOrder: true,
    explanation: "De fietser komt vlak voor je de rijbaan op. Rem om hem de ruimte te geven."
  }
];
