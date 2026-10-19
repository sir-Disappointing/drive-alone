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
    explanation: "Trams hebben voorrang op een gelijkwaardig kruispunt, ook als ze van links komen."
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
    explanation: "Blinden en slechtzienden met een witte stok of geleidehond laat je altijd voorgaan."
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
    question: "Je verlaat een erf en rijdt een gewone weg op. Wat geldt?",
    options: ["Rechts gaat voor", "Je verleent voorrang aan al het verkeer", "Het verkeer op de weg moet jou voorlaten"],
    answer: 1,
    explanation: "Wie een erf verlaat, verleent voorrang aan alle andere weggebruikers."
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
    question: "Hoe hard mag je rijden op een erf?",
    options: ["30 km/u", "Stapvoets", "50 km/u"],
    answer: 1,
    explanation: "Op een erf rijd je stapvoets. Voetgangers mogen de hele breedte van de weg gebruiken."
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
    explanation: "Als je wordt ingehaald, mag je niet versnellen. Maak het de inhaler juist makkelijk."
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
    explanation: "Bij langzaam verkeer rits je: doorrijden tot het eind van de rijstrook en om en om invoegen. Het verkeer naast je laat je ertussen."
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
  }
];
