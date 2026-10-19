// Original practice questions based on Dutch traffic rules (RVV 1990).
// These are NOT the official CBR questions. Verify facts against the current
// RVV 1990 and the CBR theory materials before relying on them.
//
// Shape: { id, topic, question, options: [string, string, string], answer: index, explanation }
const QUESTIONS = [
  {
    id: 1,
    topic: "Voorrang",
    question: "Je nadert een kruispunt zonder verkeersborden of verkeerslichten. Een auto komt van rechts. Wie heeft voorrang?",
    options: ["Jij, omdat je op de doorgaande weg rijdt", "De auto van rechts", "Degene die het eerst stopt"],
    answer: 1,
    explanation: "Bij gelijkwaardige kruispunten geldt 'rechts voor links': het verkeer van rechts heeft voorrang."
  },
  {
    id: 2,
    topic: "Voorrang",
    question: "Wat betekent het bord met de omgekeerde driehoek (voorrang verlenen)?",
    options: ["Je moet stoppen en wachten tot het veilig is", "Je moet voorrang verlenen aan het verkeer op de doorgaande weg", "Je mag altijd doorrijden"],
    answer: 1,
    explanation: "Bij een driehoek verleen je voorrang aan het verkeer op de voorrangsweg. Je hoeft niet altijd volledig te stoppen, tenzij er verkeer komt."
  },
  {
    id: 3,
    topic: "Voorrang",
    question: "Je nadert een stopbord. Wat moet je doen?",
    options: ["Langzaam doorrijden als er niets aankomt", "Volledig stoppen, ook als er niemand komt", "Alleen hard remmen"],
    answer: 1,
    explanation: "Bij een stopbord moet je altijd volledig stoppen, ook als het verkeer vrij lijkt."
  },
  {
    id: 4,
    topic: "Voorrang",
    question: "Een voetganger staat op het zebrapad te wachten om over te steken. Wat doe je?",
    options: ["Je rijdt door, de voetganger moet maar wachten", "Je laat de voetganger veilig oversteken", "Je toetert zodat de voetganger opschiet"],
    answer: 1,
    explanation: "Voetgangers op een zebrapad hebben voorrang. Als een voetganger op het punt staat over te steken, moet je wachten."
  },
  {
    id: 5,
    topic: "Verkeerslichten",
    question: "Het verkeerslicht springt op oranje terwijl je nog op afstand bent. Wat doe je als je veilig kunt stoppen?",
    options: ["Doorrijden", "Stoppen voor de stopstreep", "Versnellen om het licht nog te halen"],
    answer: 1,
    explanation: "Oranje betekent stoppen als dat veilig kan. Versnellen om het licht nog te halen is niet toegestaan."
  },
  {
    id: 6,
    topic: "Verkeerslichten",
    question: "Een politieagent geeft aanwijzingen met zijn armen, en het verkeerslicht staat op groen. Wat geldt?",
    options: ["Het licht gaat voor", "De aanwijzingen van de politieagent gaan voor", "Je mag kiezen"],
    answer: 1,
    explanation: "Aanwijzingen van een verkeersregelaar gaan altijd voor op verkeerslichten en verkeersborden."
  },
  {
    id: 7,
    topic: "Markeringen",
    question: "Een doorgetrokken witte streep ligt in het midden van de weg. Mag je hier overheen rijden om in te halen?",
    options: ["Ja, als er geen tegenligger is", "Nee, dat is niet toegestaan", "Ja, maar alleen op snelwegen"],
    answer: 1,
    explanation: "Een doorgetrokken streep mag je niet passeren. Inhalen is dan verboden."
  },
  {
    id: 8,
    topic: "Markeringen",
    question: "Een onderbroken witte streep ligt in het midden van de weg. Wat betekent dat?",
    options: ["Oversteken is verboden", "Oversteken en inhalen is toegestaan als het veilig is", "Je moet stoppen"],
    answer: 1,
    explanation: "Een onderbroken streep geeft aan dat je mag overrijden of inhalen, mits het veilig kan."
  },
  {
    id: 9,
    topic: "Snelheid",
    question: "Wat is de standaard maximumsnelheid binnen de bebouwde kom, als er geen andere borden staan?",
    options: ["30 km/h", "50 km/h", "70 km/h"],
    answer: 1,
    explanation: "Binnen de bebouwde kom is de standaard maximumsnelheid 50 km/h, tenzij anders aangegeven."
  },
  {
    id: 10,
    topic: "Snelheid",
    question: "Wat is de maximumsnelheid op een autosnelweg, als er geen andere borden staan?",
    options: ["80 km/h", "100 km/h", "120 km/h"],
    answer: 1,
    explanation: "Op autosnelwegen geldt standaard 100 km/h, tenzij met borden anders wordt aangegeven."
  },
  {
    id: 11,
    topic: "Afstand",
    question: "Hoe groot moet de volgafstand minimaal zijn bij 100 km/h, volgens de halve-snelheidsregel?",
    options: ["10 meter", "50 meter", "100 meter"],
    answer: 1,
    explanation: "De halve-snelheidsregel: de afstand in meters is minimaal de helft van je snelheid in km/h. Bij 100 km/h is dat 50 meter."
  },
  {
    id: 12,
    topic: "Alcohol",
    question: "Wat is de wettelijke alcoholgrens voor de meeste bestuurders in Nederland?",
    options: ["0,2 promille", "0,5 promille", "0,8 promille"],
    answer: 1,
    explanation: "De algemene grens is 0,5 promille. Voor beginnende bestuurders geldt een strengere grens van 0,2 promille."
  },
  {
    id: 13,
    topic: "Alcohol",
    question: "Je bent een beginnende bestuurder (rijbewijs minder dan 2 jaar). Welke alcoholgrens geldt voor jou?",
    options: ["0,0 promille (geen alcohol)", "0,2 promille", "0,5 promille"],
    answer: 1,
    explanation: "Beginnende bestuurders hebben een grens van 0,2 promille. Controleer de actuele regels, want die kunnen wijzigen."
  },
  {
    id: 14,
    topic: "Telefoon",
    question: "Mag je tijdens het rijden je telefoon in je hand houden om te bellen?",
    options: ["Ja, als je maar rustig rijdt", "Nee, dat is verboden", "Ja, als het bluetooth is"],
    answer: 1,
    explanation: "Het vasthouden van een telefoon tijdens het rijden is verboden. Handsfree met bluetooth is wel toegestaan."
  },
  {
    id: 15,
    topic: "Kinderen",
    question: "Tot welke lengte moet een kind in een speciaal kinderzitje of kinderstoeltje zitten?",
    options: ["Tot 1,35 meter", "Tot 1,50 meter", "Tot 1,20 meter"],
    answer: 0,
    explanation: "Kinderen kleiner dan 1,35 meter moeten in een passend kinderzitje of kinderstoeltje."
  },
  {
    id: 16,
    topic: "Hulpdiensten",
    question: "Een ambulance nadert met zwaailicht en sirene. Wat doe je?",
    options: ["Blijven rijden zoals je deed", "Ruimte maken en zo nodig stoppen", "Versnellen om voor de ambulance uit te rijden"],
    answer: 1,
    explanation: "Maak ruimte voor hulpdiensten. Ga zo nodig aan de kant of stop, zonder roekeloos te rijden."
  },
  {
    id: 17,
    topic: "Snelweg",
    question: "Wanneer mag je de vluchtstrook op de autosnelweg gebruiken?",
    options: ["Om sneller vooruit te komen in de file", "Alleen bij een noodgeval of pech", "Om het verkeer in te halen"],
    answer: 1,
    explanation: "De vluchtstrook is alleen bedoeld voor noodgevallen en pech. Hulpdiensten mogen hem wel gebruiken."
  },
  {
    id: 18,
    topic: "Inhalen",
    question: "Wanneer mag je NIET inhalen?",
    options: ["Op een rechte weg met goed zicht", "Op een plek met een doorgetrokken streep", "Op een brede weg met weinig verkeer"],
    answer: 1,
    explanation: "Bij een doorgetrokken streep is inhalen verboden. Ook bij slecht zicht, een bocht of een kruispunt mag je niet inhalen."
  },
  {
    id: 19,
    topic: "Verlichting",
    question: "Wanneer moet je dimlicht of groot licht gebruiken?",
    options: ["Alleen in het donker", "Bij slecht zicht, zoals in de schemering, regen of mist", "Alleen op snelwegen"],
    answer: 1,
    explanation: "Gebruik je licht wanneer het zicht beperkt is, ook overdag bij regen of mist."
  },
  {
    id: 20,
    topic: "Parkeren",
    question: "Mag je parkeren op een plek met een gele stoeplijn?",
    options: ["Ja, altijd", "Nee, daar is parkeren verboden", "Alleen overdag"],
    answer: 1,
    explanation: "Een gele stoeplijn betekent dat parkeren verboden is. Let op de exacte betekenis van de markering."
  },
  {
    id: 21,
    topic: "Fietsers",
    question: "Een fietser steekt de weg over op een fietsoversteek. Wat moet je doen?",
    options: ["Doorrijden, de fietser moet wachten", "Voorrang verlenen aan de fietser", "Toeteren en doorrijden"],
    answer: 1,
    explanation: "Op een fietsoversteek hebben fietsers voorrang. Verleen dus voorrang."
  },
  {
    id: 22,
    topic: "Gevaar",
    question: "Het gaat hard regenen en de weg wordt glad. Wat doe je met je snelheid?",
    options: ["Hetzelfde aanhouden", "Snelheid verlagen en meer afstand houden", "Sneller rijden om het over te doen"],
    answer: 1,
    explanation: "Bij gladheid is je remweg langer. Verlaag je snelheid en houd meer afstand."
  },
  {
    id: 23,
    topic: "Gevaar",
    question: "Je hebt geen zicht meer op de weg achter een bocht. Wat is het verstandigst?",
    options: ["Inhalen om tijd te winnen", "Rustig en voorzichtig rijden", "Het licht van de auto voor je volgen"],
    answer: 1,
    explanation: "Bij beperkt zicht rijd je voorzichtig. Inhalen in of voor een bocht is verboden."
  },
  {
    id: 24,
    topic: "Stoppen",
    question: "Waar mag je niet stoppen of parkeren?",
    options: ["Op een parkeerplaats", "Op een kruispunt of direct voor een zebrapad", "Langs de stoep binnen een parkeervak"],
    answer: 1,
    explanation: "Op kruispunten en bij zebrapaden is stilstaan of parkeren verboden, omdat het gevaarlijk is."
  },
  {
    id: 25,
    topic: "Verkeerslichten",
    question: "Een verkeerslicht staat op rood. Wat doe je?",
    options: ["Stoppen voor de stopstreep", "Doorrijden als het veilig is", "Versnellen"],
    answer: 0,
    explanation: "Bij rood stop je voor de stopstreep. Doorrijden bij rood is altijd verboden."
  }
];
