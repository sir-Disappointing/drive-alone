// Leerstof: spiekbriefje en regels per onderwerp.
// topic moet gelijk zijn aan het onderwerp in questions.js om de oefenknop te tonen.
// Velden per regel: title, text, sign (optioneel, uit signs.js), warn (optioneel).
// Alleen regels die we in meerdere bronnen of de wettekst hebben teruggevonden.
const LEARN = {
  // Getallen op de homepage.
  highlights: [
    { value: "50", label: "km/u in de kom" },
    { value: "0,2 ‰", label: "beginner, 5 jaar" },
    { value: "5 m", label: "van kruispunt" },
    { value: "1,35 m", label: "kinderzitje tot" },
  ],

  cheatsheet: [
    {
      title: "Snelheden auto",
      rows: [
        ["Binnen de bebouwde kom", "50 km/u"],
        ["Erf", "15 km/u"],
        ["Buiten de bebouwde kom", "80 km/u"],
        ["Autoweg", "100 km/u"],
        ["Autosnelweg 06.00–19.00", "100 km/u"],
        ["Autosnelweg zonder bord", "130 km/u"],
        ["Aanhanger op auto(snel)weg", "90 km/u"],
      ],
    },
    {
      title: "Alcohol",
      rows: [
        ["Ervaren bestuurder", "0,5 ‰"],
        ["Beginner (eerste 5 jaar)", "0,2 ‰"],
        ["Strafpunten beginner tot CBR", "2"],
      ],
    },
    {
      title: "Stilstaan en parkeren",
      rows: [
        ["Niet parkeren vanaf kruispunt", "< 5 m"],
        ["Niet stilstaan bij zebrapad", "5 m"],
        ["Niet stilstaan bij haltebord", "12 m"],
      ],
    },
    {
      title: "Zicht en afstand",
      rows: [
        ["Mistachterlicht bij zicht onder", "50 m"],
        ["Volgafstand (vuistregel)", "2 sec"],
        ["Reactietijd (vuistregel)", "1 sec"],
        ["2× zo snel = remweg", "4×"],
      ],
    },
    {
      title: "Rijbewijs B",
      rows: [
        ["Toegestane maximummassa auto", "3500 kg"],
        ["Passagiers naast bestuurder", "8"],
        ["Aanhanger altijd toegestaan", "750 kg"],
        ["Combinatie zonder extra eisen", "3500 kg"],
        ["Combinatie met code 96", "4250 kg"],
      ],
    },
    {
      title: "Voertuig en kinderen",
      rows: [
        ["Kinderzitje tot lengte", "1,35 m"],
        ["Bestuurder verantwoordelijk tot", "12 jaar"],
        ["Minimale profieldiepte", "1,6 mm"],
        ["Snelweg: voertuig kan en mag", "≥ 60 km/u"],
      ],
    },
    {
      title: "Examen (sinds april 2025)",
      rows: [
        ["Vragen", "50"],
        ["Tijd", "30 min"],
        ["Goed nodig", "44"],
        ["Maximaal fout", "6"],
      ],
    },
  ],

  topics: [
    {
      topic: "Voorrang",
      intro: "Wie mag eerst? Een groot deel van het examen draait hierom.",
      rules: [
        {
          title: "Rangorde",
          text: "Verkeersregelaar gaat boven verkeerslichten, verkeerslichten gaan boven borden en markeringen, en die gaan boven de verkeersregels.",
          warn: "Een agent die je laat stoppen gaat voor een groen licht.",
        },
        {
          title: "Rechts gaat voor",
          text: "Op een gelijkwaardig kruispunt (geen borden, haaientanden of lichten) verleen je voorrang aan verkeer van rechts.",
        },
        {
          title: "Trams gaan voor op een gelijkwaardig kruispunt",
          text: "Een tram heeft voorrang op een gelijkwaardig kruispunt, ook als hij van links komt.",
          warn: "'Tram heeft altijd voorrang' klopt niet: borden, haaientanden en verkeerslichten gelden ook voor trams.",
        },
        {
          title: "Onverhard voor verhard",
          text: "Wie op een onverharde weg rijdt, verleent voorrang aan het verkeer op een verharde weg, ook als dat van links komt.",
        },
        {
          title: "Uitrit: iedereen gaat voor",
          text: "Wie een uitrit verlaat, laat al het verkeer voorgaan, ook voetgangers en fietsers uit beide richtingen. Dat geldt ook voor wegrijden, achteruitrijden, keren, invoegen en van rijstrook wisselen.",
        },
        {
          title: "Voorrangsweg",
          sign: "B1",
          text: "Op een voorrangsweg moet het verkeer van zijwegen jou voorrang verlenen.",
        },
        {
          title: "Einde voorrangsweg",
          sign: "B2",
          text: "De voorrangsweg houdt op. Op het volgende kruispunt kijk je opnieuw welke regel geldt.",
          warn: "Dit bord betekent niet automatisch dat jij voorrang moet verlenen.",
        },
        {
          title: "Voorrang verlenen of stoppen",
          sign: "B6",
          text: "Bij de driehoek en bij haaientanden verleen je voorrang; stoppen hoeft alleen als het nodig is. Bij een stopbord stop je altijd helemaal, ook als er niemand komt.",
        },
        {
          title: "Rechtdoor gaat voor",
          text: "Wie afslaat, laat het verkeer op dezelfde weg dat rechtdoor gaat voorgaan: tegenliggers, en fietsers op het fietspad naast je. Dat geldt ook op een voorrangsweg.",
          warn: "Uitzondering: een afslaande tram hoeft rechtdoorgaand verkeer niet voor te laten gaan.",
        },
        {
          title: "Rotonde",
          text: "Meestal liggen er haaientanden bij de ingang en gaat het verkeer op de rotonde voor. Zonder haaientanden of borden is een rotonde een gelijkwaardig kruispunt: rechts gaat voor.",
        },
        {
          title: "Voorrangsvoertuigen",
          text: "Een voertuig met blauw zwaailicht én sirene laat je altijd voorgaan. Maak op een veilige manier ruimte.",
          warn: "Blauw licht zonder sirene of geel zwaailicht geeft geen voorrang.",
        },
        {
          title: "Altijd voor laten gaan",
          text: "Blinden met een witte stok met rode ringen en mensen die zich moeilijk voortbewegen, overal. Voetgangers die op een zebrapad oversteken of op het punt staan dat te doen.",
        },
        {
          title: "Bus binnen de bebouwde kom",
          text: "Binnen de bebouwde kom geef je een bus de gelegenheid weg te rijden van de halte, als hij richting aangeeft. Buiten de kom geldt dit niet.",
        },
        {
          title: "Overweg en kruispunt vrijhouden",
          text: "Rijd een overweg of kruispunt alleen op als je er direct helemaal af kunt. Een trein gaat altijd voor.",
        },
        {
          title: "Stoeten",
          text: "Een militaire colonne of een uitvaartstoet van motorvoertuigen mag je niet doorsnijden.",
        },
      ],
      thumbs: [
        "Trams gaan voor op een gelijkwaardig kruispunt, ook van links.",
        "Korte bocht gaat voor lange bocht: wie linksaf slaat, laat de tegenligger die rechtsaf slaat voorgaan.",
        "Groen licht gaat boven 'rechts gaat voor'.",
        "Voorrang hebben is niet hetzelfde als voorrang krijgen.",
        "Ezelsbruggetje rangorde: Alle Lichten Branden Telkens Rood (Agent, Lichten, Borden, Tekens, Regels).",
      ],
    },
    {
      topic: "Verkeerstekens",
      intro: "Borden, lichten en strepen op de weg. Let vooral op de verschillen die op elkaar lijken.",
      rules: [
        {
          title: "Geel licht",
          text: "Geel betekent stoppen. Alleen als je zo dichtbij bent dat je niet meer veilig kunt stoppen, rijd je door.",
        },
        {
          title: "Geel knipperlicht",
          text: "Het licht is buiten werking of er is een gevaarlijk punt. Let extra op; de borden en de gewone voorrangsregels gelden.",
        },
        {
          title: "Rood kruis en witte pijl",
          sign: "rood-kruis",
          text: "Een rood kruis boven je rijstrook betekent: deze strook is dicht. Een witte schuine pijl kondigt dat aan: ga naar de strook waar de pijl heen wijst.",
          warn: "Een rood kruis geldt ook als de strook leeg lijkt.",
        },
        {
          title: "Snelheid in een rode ring",
          text: "Een snelheid in een rode ring boven je rijstrook is een maximumsnelheid. Geven een bord en een matrixbord verschillende limieten, dan geldt de laagste.",
        },
        {
          title: "Parkeerverbod en stopverbod",
          sign: "E2",
          text: "Eén schuine streep: niet parkeren, kort stilstaan mag. Een kruis: niet stilstaan, ook niet even.",
        },
        {
          title: "Gesloten en inrijverbod",
          sign: "C2",
          text: "Een rode schijf met een witte balk: je mag hier niet inrijden. Een witte schijf met rode rand: gesloten voor voertuigen in beide richtingen.",
        },
        {
          title: "Witte strepen",
          text: "Een doorgetrokken streep mag je niet overschrijden. Een onderbroken streep wel, als het veilig is. Bij een dubbele streep mag je erover vanaf de kant van de onderbroken streep.",
        },
        {
          title: "Gele strepen op de stoeprand",
          text: "Gele onderbroken streep: niet parkeren. Gele doorgetrokken streep: niet stilstaan.",
        },
        {
          title: "Verdrijvingsvlak en voorsorteerstrook",
          text: "Over een verdrijvingsvlak (witte schuine strepen) mag je niet rijden. Sta je op een voorsorteerstrook, dan volg je de richting van de pijl.",
        },
        {
          title: "Haaientanden",
          text: "Haaientanden betekenen: voorrang verlenen aan bestuurders op de kruisende weg. Ze werken ook zonder bord.",
          warn: "Haaientanden geven voetgangers geen voorrang. Fietsers op een kruisend fietspad wel.",
        },
      ],
      thumbs: [
        "Eén streep is niet parkeren, een kruis is niet stilstaan.",
        "Geel is stoppen, niet gas geven.",
        "Gele streep onderbroken = niet parkeren, doorgetrokken = niet stilstaan.",
      ],
    },
    {
      topic: "Snelheid",
      intro: "De getallen moet je gewoon kennen. Let op de uitzonderingen.",
      rules: [
        {
          title: "Standaard limieten",
          text: "Binnen de bebouwde kom 50, buiten de kom 80, autoweg 100, autosnelweg 130 km/u. Op een erf maximaal 15 km/u.",
        },
        {
          title: "Overdag 100 op de snelweg",
          text: "Van 06.00 tot 19.00 uur geldt op bijna alle autosnelwegen 100 km/u. Dat staat op de borden. 's Avonds geldt wat de borden aangeven.",
        },
        {
          title: "Met aanhanger",
          text: "Met een aanhanger mag je op autowegen en autosnelwegen maximaal 90 km/u. Op andere wegen buiten de kom 80, binnen de kom 50.",
        },
        {
          title: "Wie mag de snelweg op?",
          text: "Alleen motorvoertuigen die minstens 60 km/u kunnen én mogen. Voor een autoweg is dat 50 km/u.",
          warn: "Dit is een eis aan het voertuig, geen minimumsnelheid.",
        },
        {
          title: "Aanpassen aan de omstandigheden",
          text: "Een limiet is een maximum. Je moet altijd kunnen stoppen binnen de afstand die je vrij voor je ziet.",
        },
      ],
      thumbs: [
        "Erf = 15 km/u. 'Stapvoets' is een oud antwoord.",
        "90 met aanhanger alleen op auto(snel)wegen.",
      ],
    },
    {
      topic: "Inhalen",
      intro: "Links inhalen is de regel. Rechts mag alleen in een paar situaties.",
      rules: [
        {
          title: "Links inhalen",
          text: "Je haalt links in. Wie wordt ingehaald, verhoogt zijn snelheid niet.",
        },
        {
          title: "Rechts inhalen mag bij",
          text: "Een file, vlak voor en op een rotonde, een auto die links voorsorteert, trams, en rijstroken met blokmarkering zoals invoeg- en uitvoegstroken.",
          warn: "Meerdere rijstroken betekent niet dat rechts inhalen mag. Het moet echt een file zijn.",
        },
        {
          title: "Niet inhalen",
          text: "Vlak voor of op een zebrapad (geen enkel voertuig, ook geen fiets), over een doorgetrokken streep, en wanneer je niet ver genoeg kunt zien om het veilig af te ronden.",
        },
        {
          title: "Eerst kijken",
          text: "Kijk in je spiegels en dode hoek voordat je richting aangeeft en uitwijkt.",
        },
      ],
      thumbs: [
        "FRUIT: rechts inhalen mag bij File, Rotonde, Uitvoegen, Invoegen en Tram. Plus: wie links voorsorteert.",
      ],
    },
    {
      topic: "Stilstaan en parkeren",
      intro: "Het verschil tussen stilstaan en parkeren is een klassieke examenvraag.",
      rules: [
        {
          title: "Stilstaan of parkeren?",
          text: "Stilstaan is kort stoppen om direct in of uit te stappen of te laden en lossen. Alles wat langer duurt, is parkeren. Ook als je in de auto blijft zitten.",
        },
        {
          title: "Niet stilstaan",
          text: "Op een kruispunt of overweg, op een fietsstrook, op een oversteekplaats of binnen 5 meter ervan, langs een gele doorgetrokken streep, in een tunnel, en bij een bushalte (blokmarkering, of anders binnen 12 meter van het bord). Bij de bushalte mag je wel passagiers direct laten in- of uitstappen.",
        },
        {
          title: "Niet parkeren",
          text: "Binnen 5 meter van een kruispunt, voor een in- of uitrit, langs een gele onderbroken streep, buiten de kom op de rijbaan van een voorrangsweg, en op een plek voor laden en lossen.",
          warn: "Binnen 5 meter van een kruispunt mag je wel kort stilstaan, maar niet óp het kruispunt.",
        },
        {
          title: "Blauwe zone en erf",
          text: "In een blauwe zone parkeer je met een parkeerschijf. Op een erf parkeer je alleen op de aangegeven plekken.",
        },
        {
          title: "Vluchtstrook",
          text: "Alleen bij pech of een noodgeval. Niet om te bellen, te pauzeren of de file te ontwijken.",
        },
      ],
      thumbs: ["Twijfel je? Zebrapad 5 m, kruispunt 5 m (alleen parkeren), bushalte 12 m."],
    },
    {
      topic: "Verlichting",
      intro: "Wanneer welke lamp aan mag of moet.",
      rules: [
        {
          title: "Dimlicht",
          text: "'s Nachts, en overdag als het zicht ernstig wordt belemmerd. In een tunnel is dimlicht ook verstandig.",
          warn: "Dagrijverlichting brandt vaak alleen voorin. Bij schemer of donker zet je dimlicht aan.",
        },
        {
          title: "Grootlicht",
          text: "Mag 's nachts, ook binnen de bebouwde kom. Niet bij tegenliggers en niet als je kort achter iemand rijdt.",
        },
        {
          title: "Mistachterlicht",
          text: "Alleen bij mist of sneeuwval met zicht minder dan 50 meter.",
          warn: "Nooit bij regen, ook niet bij hevige regen: je verblindt achterliggers.",
        },
        {
          title: "Claxon en lichtsignaal",
          text: "Alleen om dreigend gevaar af te wenden.",
        },
      ],
      thumbs: ["Hectometerpaaltjes staan 100 meter uit elkaar: zie je er geen enkele meer, dan is het zicht minder dan 100 meter."],
    },
    {
      topic: "Autosnelweg",
      intro: "Invoegen, rijstroken en wat je doet bij pech.",
      rules: [
        {
          title: "Rechts houden",
          text: "Rijd zoveel mogelijk rechts. Een open spitsstrook (groene pijl) is een gewone rijstrook.",
        },
        {
          title: "Invoegen en ritsen",
          text: "Wie invoegt of van rijstrook wisselt, verleent voorrang. Bij langzaam verkeer rits je: doorrijden tot het eind en om en om invoegen.",
        },
        {
          title: "Verboden",
          text: "Keren, achteruitrijden en stilstaan op de rijbaan. De vluchtstrook alleen in noodgevallen.",
        },
        {
          title: "Caravan of vrachtauto",
          text: "Combinaties langer dan 7 meter en vrachtauto's gebruiken bij drie of meer rijstroken alleen de twee rechtse.",
        },
        {
          title: "Pech",
          text: "Naar de vluchtstrook, alarmlichten aan, rechts uitstappen, hesje aan en achter de vangrail wachten. Bel pechhulp, of 112 bij gevaar.",
        },
      ],
      thumbs: ["Afslag gemist? Gewoon doorrijden naar de volgende."],
    },
    {
      topic: "Afstand en remmen",
      intro: "Vuistregels om afstanden in te schatten.",
      rules: [
        {
          title: "Volgafstand",
          text: "Houd minimaal 2 seconden afstand. Bij regen, mist of gladheid meer.",
        },
        {
          title: "Stopafstand",
          text: "Stopafstand = reactieafstand + remweg. Je reactietijd is ongeveer 1 seconde.",
        },
        {
          title: "Remweg",
          text: "Twee keer zo snel betekent ongeveer vier keer zo'n lange remweg. Je reactieafstand wordt 'maar' twee keer zo lang.",
        },
        {
          title: "Aquaplaning",
          text: "Gas los, niet remmen en het stuur recht houden tot je weer grip hebt.",
        },
      ],
      thumbs: [
        "km/u ÷ 3,6 = meter per seconde. 72 km/u = 20 m/s.",
        "Halve snelheid in meters: bij 100 km/u minstens 50 meter afstand.",
      ],
    },
    {
      topic: "Alcohol en afleiding",
      intro: "Alcohol, medicijnen, je telefoon en het beginnersrijbewijs.",
      rules: [
        {
          title: "Alcohollimiet",
          text: "Ervaren bestuurders 0,5 promille. Beginnende bestuurders 0,2 promille: de eerste 5 jaar na je eerste rijbewijs, ook als je B via 2toDrive op je 17e haalde. Kreeg je voor je 18e een rijbewijs AM of T, dan 7 jaar.",
        },
        {
          title: "Telefoon",
          text: "Tijdens het rijden mag je je telefoon niet vasthouden, wat je er ook mee doet. Handsfree bellen of een telefoon in een houder mag wel.",
        },
        {
          title: "Medicijnen",
          text: "Een gele sticker betekent dat een medicijn je rijvaardigheid kan beïnvloeden. Lees de bijsluiter.",
        },
        {
          title: "Beginnersrijbewijs",
          text: "In de eerste 5 jaar leiden 2 strafpunten voor ernstige overtredingen tot schorsing en een nieuw examen.",
        },
        {
          title: "Vermoeidheid",
          text: "Alleen rust helpt echt. Het raam open of de radio harder helpt maar heel even.",
        },
      ],
      thumbs: ["0,2 voor beginners, 0,5 voor ervaren bestuurders."],
    },
    {
      topic: "Kinderen en gordels",
      intro: "Wie zit waar, en wie is verantwoordelijk.",
      rules: [
        {
          title: "Kinderzitje",
          text: "Kinderen kleiner dan 1,35 meter zitten in een passend, goedgekeurd zitje. Voorin én achterin.",
          warn: "Achterwaarts gericht zitje voorin? Dan moet de airbag uit.",
        },
        {
          title: "Uitzondering",
          text: "Passen er na twee kinderzitjes geen drie op de achterbank, dan mag een derde kind van 3 jaar of ouder achterin met de gewone gordel. Zijn er geen gordels in de auto, dan geen kinderen onder 3 jaar, en kinderen onder 1,35 meter alleen achterin.",
        },
        {
          title: "Gordel",
          text: "Iedereen draagt een gordel als die er is. Voor kinderen jonger dan 12 is de bestuurder verantwoordelijk.",
        },
      ],
      thumbs: ["1,35 meter, niet 1,50 meter. De 12 jaar gaat alleen nog over wie de boete krijgt."],
    },
    {
      topic: "Rijbewijs en voertuig",
      intro: "Wat je met rijbewijs B mag en waar je auto aan moet voldoen.",
      rules: [
        {
          title: "Rijbewijs B",
          text: "Auto met een toegestane maximummassa tot 3500 kg en maximaal 8 passagiers naast de bestuurder.",
        },
        {
          title: "Aanhanger",
          text: "Een aanhanger tot 750 kg mag altijd. Zwaarder mag als auto en aanhanger samen niet boven 3500 kg komen. Met code 96 tot 4250 kg, daarboven BE.",
          warn: "Het gaat om de gewichten op het kentekenbewijs, niet om wat je auto nu weegt.",
        },
        {
          title: "Banden en verzekering",
          text: "Minimaal 1,6 mm profiel. Een auto met kenteken moet altijd WA-verzekerd zijn, ook als hij stilstaat.",
        },
      ],
      thumbs: ["750 – 3500 – 4250: aanhanger, combinatie B, combinatie met code 96."],
    },
    {
      topic: "Gedrag en ongevallen",
      intro: "Algemene regels die altijd gelden.",
      rules: [
        {
          title: "Gevaar en hinder",
          text: "Je mag nooit gevaar op de weg veroorzaken of het verkeer hinderen. Die regel geldt ook als er verder niets geregeld is.",
        },
        {
          title: "Niet doorrijden",
          text: "Na een ongeval blijf je staan, ook als er alleen schade is. Is de eigenaar er niet, meld het dan bij de politie.",
        },
        {
          title: "Bij een ongeval",
          text: "Eerst je eigen veiligheid: alarmlichten, hesje. Bel 112 bij gewonden of gevaar. Wissel gegevens uit en vul samen een schadeformulier in.",
        },
      ],
      thumbs: [],
    },
    {
      topic: "Andere weggebruikers",
      intro: "Fietsers, brommers en voetgangers.",
      rules: [
        {
          title: "Fietsers",
          text: "Fietsers mogen met zijn tweeën naast elkaar (snorfietsers niet). Fietsers mogen andere bestuurders rechts inhalen.",
        },
        {
          title: "Bromfiets en speed pedelec",
          text: "Een speed pedelec is een bromfiets. Een bromfiets gebruikt het fiets/bromfietspad, en anders de rijbaan. Op een verplicht fietspad mag hij niet.",
        },
        {
          title: "Voetgangers op een erf",
          text: "Op een erf mogen voetgangers de hele breedte van de weg gebruiken.",
        },
      ],
      thumbs: [],
    },
    {
      topic: "Gevaarherkenning",
      intro: "Op het echte examen zijn dit korte animaties. Je kiest remmen, gas loslaten of niets.",
      rules: [
        {
          title: "Remmen",
          text: "Als er direct gevaar is: iets of iemand komt vlak voor je de weg op, of je voorligger remt hard.",
        },
        {
          title: "Gas loslaten",
          text: "Als er een mogelijk gevaar is, maar nog niet direct: een kind bij de stoeprand, remlichten ver voor je, een bus die wil wegrijden.",
        },
        {
          title: "Niets",
          text: "Als er geen reden is om in te grijpen. Blijf wel om je heen kijken.",
        },
      ],
      thumbs: [
        "Een bal op de weg betekent: er kan een kind achteraan komen.",
        "Twijfel tussen remmen en gas los? Is het gevaar vlakbij, dan rem je.",
      ],
    },
  ],
};
