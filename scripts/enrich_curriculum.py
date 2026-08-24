#!/usr/bin/env python3
"""Add English topic names and the Alltag Plus gap-fill series."""
from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC_JSON = ROOT / "flashcard-app/src/data/flashcards.json"
PUBLIC_JSON = ROOT / "flashcard-app/public/data/flashcards.json"
SCRIPTS_JSON = ROOT / "scripts/flashcards-data.json"
SVG_DIR = ROOT / "flashcard-app/public/posters/output-alltag-plus"

SERIES_EN = {
    "grundlagen-1": "Foundations I",
    "wortschatz-1": "Vocabulary I",
    "grundlagen-2": "Foundations II",
    "grundlagen-3": "Foundations III",
    "wortschatz-2": "Vocabulary II",
    "bausteine": "Building Blocks",
    "gender-worlds": "Gender Worlds",
    "alltag-plus": "Everyday Plus",
}

POSTER_EN = {
    ("grundlagen-1", "01"): "The / a (three genders)",
    ("grundlagen-1", "02"): "The four cases",
    ("grundlagen-1", "03"): "A, not a, not",
    ("grundlagen-1", "04"): "To be and to have",
    ("grundlagen-1", "05"): "Word order",
    ("grundlagen-1", "06"): "Informal you vs formal you",
    ("grundlagen-1", "07"): "Question words",
    ("grundlagen-1", "08"): "Modal verbs (can, must, want)",
    ("grundlagen-1", "09"): "Separable verbs",
    ("grundlagen-1", "10"): "Where vs where to",
    ("wortschatz-1", "01"): "Food and drink",
    ("wortschatz-1", "02"): "At the restaurant",
    ("wortschatz-1", "03"): "Colours",
    ("wortschatz-1", "04"): "The body",
    ("wortschatz-1", "05"): "At home",
    ("wortschatz-1", "06"): "Dates and time",
    ("wortschatz-1", "07"): "Numbers",
    ("wortschatz-1", "08"): "Seasons",
    ("wortschatz-1", "09"): "Clothes",
    ("wortschatz-1", "10"): "Travel",
    ("grundlagen-2", "01"): "The accusative case",
    ("grundlagen-2", "02"): "Modal verbs in depth",
    ("grundlagen-2", "03"): "Separable verbs in depth",
    ("grundlagen-2", "04"): "The perfect tense (past)",
    ("grundlagen-2", "05"): "My, your, his, her",
    ("grundlagen-2", "06"): "I, you, they (pronouns)",
    ("grundlagen-2", "07"): "Word order (verb second)",
    ("grundlagen-2", "08"): "Where is the ball? (place)",
    ("grundlagen-2", "09"): "The dative case",
    ("grundlagen-2", "10"): "Where to vs where (two-way)",
    ("grundlagen-3", "01"): "The imperative (commands)",
    ("grundlagen-3", "02"): "Good, better, best",
    ("grundlagen-3", "03"): "A red skirt (adjective endings)",
    ("grundlagen-3", "04"): "Was and had (simple past)",
    ("grundlagen-3", "05"): "And, but, because",
    ("grundlagen-3", "06"): "There is + one / people in general",
    ("grundlagen-3", "07"): "Feelings",
    ("grundlagen-3", "08"): "The daily routine",
    ("grundlagen-3", "09"): "Politeness",
    ("grundlagen-3", "10"): "False friends",
    ("wortschatz-2", "01"): "The family",
    ("wortschatz-2", "02"): "Shopping",
    ("wortschatz-2", "03"): "Jobs and work",
    ("wortschatz-2", "04"): "The way / directions",
    ("wortschatz-2", "05"): "At the doctor",
    ("wortschatz-2", "06"): "Hobbies",
    ("wortschatz-2", "07"): "Phone and internet",
    ("wortschatz-2", "08"): "Money and the office",
    ("wortschatz-2", "09"): "Animals and nature",
    ("wortschatz-2", "10"): "Festivals and wishes",
    ("bausteine", "01"): "Small words (particles)",
    ("bausteine", "02"): "Common phrases",
    ("bausteine", "03"): "Workhorse verbs",
    ("bausteine", "04"): "Opposites",
    ("gender-worlds", "01"): "Feminine food world",
    ("gender-worlds", "02"): "Masculine food world",
    ("gender-worlds", "03"): "Neuter food world",
    ("gender-worlds", "04"): "Feminine appliance world",
    ("gender-worlds", "05"): "Masculine appliance world",
    ("gender-worlds", "06"): "Neuter appliance world",
    ("gender-worlds", "07"): "Feminine vehicle world",
    ("gender-worlds", "08"): "Masculine vehicle world",
    ("gender-worlds", "09"): "Neuter vehicle world",
    ("gender-worlds", "10"): "Feminine household world",
    ("gender-worlds", "11"): "Masculine household world",
    ("gender-worlds", "12"): "Neuter household world",
    ("gender-worlds", "13"): "Feminine sports world",
    ("gender-worlds", "14"): "Masculine sports world",
    ("gender-worlds", "15"): "Neuter sports world",
}


def card(g, e, typ="phrase", gender=None, section="Main", extra="", pic="mark", rule=""):
    return {
        "german": g,
        "english": e,
        "type": typ,
        "gender": gender,
        "section": section,
        "hint": "",
        "extra": extra,
        "pictogram": pic,
        "rule": rule,
    }


GAP_POSTERS = [
    {
        "id": "01",
        "title": "PLURALE",
        "english_title": "Plurals",
        "subtitle": "HOW GERMAN MAKES MORE THAN ONE",
        "how_it_works": "German plurals are not just +s. Learn the article DIE for almost every plural, then the ending: -e, -er, -n/-en, umlaut, or -s. The plural belongs to the word. You cannot guess it from English.",
        "file": "01-plurale.svg",
        "cards": [
            card("die Tische", "the tables", "noun", "feminine", "—E", extra="der Tisch", pic="table"),
            card("die Hunde", "the dogs", "noun", "feminine", "—E", extra="der Hund", pic="dog"),
            card("die Frauen", "the women", "noun", "feminine", "—N / —EN", extra="die Frau", pic="person"),
            card("die Straßen", "the streets", "noun", "feminine", "—N / —EN", extra="die Straße", pic="road"),
            card("die Kinder", "the children", "noun", "feminine", "—ER", extra="das Kind", pic="child"),
            card("die Häuser", "the houses", "noun", "feminine", "—ER + UMLAUT", extra="das Haus", pic="house"),
            card("die Äpfel", "the apples", "noun", "feminine", "UMLAUT", extra="der Apfel", pic="apple"),
            card("die Mütter", "the mothers", "noun", "feminine", "UMLAUT", extra="die Mutter", pic="person"),
            card("die Autos", "the cars", "noun", "feminine", "—S", extra="das Auto", pic="car"),
            card("die Cafés", "the cafés", "noun", "feminine", "—S", extra="das Café", pic="cup"),
            card("die Leute", "the people", "noun", "feminine", "NO SINGULAR", pic="crowd"),
            card("Viele Kinder spielen.", "Many children are playing.", "sentence", pic="child"),
            card("Zwei große Häuser", "two big houses", "phrase", pic="house"),
            card("die Informationen", "the pieces of information", "noun", "feminine", "—EN", extra="die Information", pic="page"),
        ],
    },
    {
        "id": "02",
        "title": "AKK-PRÄP",
        "english_title": "Accusative prepositions",
        "subtitle": "THROUGH, FOR, WITHOUT, AROUND, AGAINST",
        "how_it_works": "These five prepositions always take the accusative: durch, für, ohne, um, gegen. Der becomes den. Die stays die. Das stays das. Ein guter trick: FUDGE — für, um, durch, gegen, ohne — plus bis and entlang in many textbooks.",
        "file": "02-akk-praep.svg",
        "cards": [
            card("für", "for", "phrase", section="FUDGO", extra="always accusative", pic="arrow"),
            card("durch", "through", "phrase", section="FUDGO", pic="arrow"),
            card("ohne", "without", "phrase", section="FUDGO", pic="cross"),
            card("um", "around / at (time)", "phrase", section="FUDGO", pic="clock"),
            card("gegen", "against / around (time)", "phrase", section="FUDGO", pic="shield"),
            card("bis", "until / as far as", "phrase", section="FUDGO", pic="arrow"),
            card("für den Mann", "for the man", "phrase", extra="der → den", pic="person"),
            card("durch die Stadt", "through the city", "phrase", pic="city"),
            card("ohne das Auto", "without the car", "phrase", pic="car"),
            card("um die Ecke", "around the corner", "phrase", pic="corner"),
            card("gegen den Wind", "against the wind", "phrase", pic="wind"),
            card("Das Geschenk ist für dich.", "The present is for you.", "sentence", pic="gift"),
            card("Ich gehe durch den Park.", "I walk through the park.", "sentence", pic="tree"),
            card("Ohne dich gehe ich nicht.", "I am not going without you.", "sentence", pic="person"),
        ],
    },
    {
        "id": "03",
        "title": "DAT-PRÄP",
        "english_title": "Dative prepositions",
        "subtitle": "FROM, WITH, TO, SINCE, AT",
        "how_it_works": "These prepositions always take the dative: aus, außer, bei, mit, nach, seit, von, zu. Der becomes dem. Die becomes der. Das becomes dem. A common mnemonic: aus-außer-bei-mit-nach-seit-von-zu.",
        "file": "03-dat-praep.svg",
        "cards": [
            card("mit", "with", "phrase", section="ALWAYS DATIVE", pic="two"),
            card("zu", "to (a person or building)", "phrase", section="ALWAYS DATIVE", pic="arrow"),
            card("von", "from / of", "phrase", section="ALWAYS DATIVE", pic="arrow"),
            card("aus", "out of / from (origin)", "phrase", section="ALWAYS DATIVE", pic="door"),
            card("bei", "at / near (someone's place)", "phrase", section="ALWAYS DATIVE", pic="house"),
            card("nach", "to (a city/country) / after", "phrase", section="ALWAYS DATIVE", pic="map"),
            card("seit", "since / for (time)", "phrase", section="ALWAYS DATIVE", pic="clock"),
            card("mit dem Bus", "by bus / with the bus", "phrase", extra="der Bus → dem", pic="bus"),
            card("zu der Schule", "to the school", "phrase", extra="often: zur Schule", pic="school"),
            card("zur Schule", "to school", "phrase", extra="zu + der = zur", pic="school"),
            card("zum Bahnhof", "to the station", "phrase", extra="zu + dem = zum", pic="train"),
            card("Ich komme aus Berlin.", "I come from Berlin.", "sentence", pic="city"),
            card("Ich wohne bei meiner Tante.", "I live at my aunt's.", "sentence", pic="house"),
            card("Seit einem Jahr lerne ich Deutsch.", "I have been learning German for a year.", "sentence", pic="book"),
        ],
    },
    {
        "id": "04",
        "title": "REFLEXIV",
        "english_title": "Reflexive verbs",
        "subtitle": "WHEN THE ACTION COMES BACK TO YOU",
        "how_it_works": "Reflexive verbs use mich/dich/sich/uns/euch/sich. Many daily-routine verbs are reflexive in German even when English is not: sich waschen, sich freuen, sich treffen. Accusative is the default; some take dative (sich die Zähne putzen).",
        "file": "04-reflexiv.svg",
        "cards": [
            card("sich waschen", "to wash (oneself)", "verb", pic="water"),
            card("sich freuen", "to be glad / look forward", "verb", pic="smile"),
            card("sich treffen", "to meet (each other)", "verb", pic="two"),
            card("sich fühlen", "to feel", "verb", pic="heart"),
            card("sich beeilen", "to hurry", "verb", pic="run"),
            card("sich erinnern", "to remember", "verb", extra="an + accusative", pic="head"),
            card("Ich wasche mich.", "I wash (myself).", "sentence", pic="water"),
            card("Ich freue mich auf das Wochenende.", "I am looking forward to the weekend.", "sentence", pic="sun"),
            card("Wir treffen uns um acht.", "We are meeting at eight.", "sentence", pic="clock"),
            card("Wie fühlst du dich?", "How do you feel?", "sentence", pic="heart"),
            card("Ich putze mir die Zähne.", "I brush my teeth.", "sentence", extra="dative reflexive", pic="tooth"),
            card("Beeil dich!", "Hurry up!", "phrase", pic="run"),
            card("Ich erinnere mich an den Film.", "I remember the film.", "sentence", pic="film"),
            card("Setzen Sie sich!", "Please sit down. (formal)", "sentence", pic="chair"),
        ],
    },
    {
        "id": "05",
        "title": "WOCHE + UHR",
        "english_title": "Days and telling the time",
        "subtitle": "MONDAY TO SUNDAY, AND THE HALB TRAP",
        "how_it_works": "Days are masculine. On Monday is am Montag. Clock time: Es ist drei. Halb drei is 2:30, not 3:30. Viertel nach / Viertel vor. Official time uses 24-hour clock: dreizehn Uhr fünfzehn.",
        "file": "05-woche-uhr.svg",
        "cards": [
            card("der Montag", "Monday", "noun", "masculine", pic="calendar"),
            card("der Dienstag", "Tuesday", "noun", "masculine", pic="calendar"),
            card("der Mittwoch", "Wednesday", "noun", "masculine", pic="calendar"),
            card("der Donnerstag", "Thursday", "noun", "masculine", pic="calendar"),
            card("der Freitag", "Friday", "noun", "masculine", pic="calendar"),
            card("der Samstag / Sonnabend", "Saturday", "noun", "masculine", extra="Sonnabend in the east/north", pic="calendar"),
            card("der Sonntag", "Sunday", "noun", "masculine", pic="calendar"),
            card("am Montag", "on Monday", "phrase", pic="calendar"),
            card("am Wochenende", "at the weekend", "phrase", pic="sun"),
            card("Es ist drei Uhr.", "It is three o'clock.", "sentence", pic="clock"),
            card("Es ist halb drei.", "It is half past two. (2:30)", "sentence", extra="halb = half TO the next hour", pic="clock"),
            card("Viertel nach drei", "quarter past three", "phrase", pic="clock"),
            card("Viertel vor vier", "quarter to four", "phrase", pic="clock"),
            card("um acht Uhr", "at eight o'clock", "phrase", pic="clock"),
            card("dreizehn Uhr fünfzehn", "13:15 (official time)", "phrase", pic="clock"),
        ],
    },
    {
        "id": "06",
        "title": "LÄNDER",
        "english_title": "Countries and languages",
        "subtitle": "WHERE YOU COME FROM, WHAT YOU SPEAK",
        "how_it_works": "Most countries take no article: Ich komme aus Spanien. A few do: die Schweiz, die Türkei, die USA, der Iran. Languages are neuter and usually have no article after sprechen: Ich spreche Deutsch. Nationalities often end in -er (der Deutsche) or -in (die Deutsche).",
        "file": "06-laender.svg",
        "cards": [
            card("Deutschland", "Germany", "noun", "neuter", extra="no article", pic="map"),
            card("Österreich", "Austria", "noun", "neuter", pic="map"),
            card("die Schweiz", "Switzerland", "noun", "feminine", extra="needs article", pic="map"),
            card("die Türkei", "Turkey", "noun", "feminine", pic="map"),
            card("die USA", "the USA", "noun", "feminine", extra="plural-ish, with article", pic="map"),
            card("Ich komme aus England.", "I come from England.", "sentence", pic="map"),
            card("Ich komme aus der Schweiz.", "I come from Switzerland.", "sentence", pic="map"),
            card("Ich wohne in Berlin.", "I live in Berlin.", "sentence", pic="city"),
            card("Ich spreche Deutsch.", "I speak German.", "sentence", pic="mouth"),
            card("Englisch", "English (language)", "noun", "neuter", pic="book"),
            card("Französisch", "French (language)", "noun", "neuter", pic="book"),
            card("der Deutsche / die Deutsche", "the German (person)", "noun", pic="person"),
            card("Ich bin Amerikaner.", "I am American. (male)", "sentence", pic="person"),
            card("Ich bin Amerikanerin.", "I am American. (female)", "sentence", pic="person"),
        ],
    },
    {
        "id": "07",
        "title": "SCHULE",
        "english_title": "School and learning",
        "subtitle": "CLASS, HOMEWORK, EXAMS",
        "how_it_works": "School German is its own little world: die Hausaufgabe, die Prüfung, das Fach. Learn at is lernen; study a subject at university is studieren. The classroom script (Kann ich aufs Klo? Ich habe eine Frage) is more useful than grammar notes.",
        "file": "07-schule.svg",
        "cards": [
            card("die Schule", "the school", "noun", "feminine", pic="school"),
            card("der Lehrer / die Lehrerin", "the teacher", "noun", pic="person"),
            card("der Schüler / die Schülerin", "the pupil / student (school)", "noun", pic="person"),
            card("das Fach", "the subject", "noun", "neuter", pic="book"),
            card("die Hausaufgabe", "the homework", "noun", "feminine", pic="page"),
            card("die Prüfung", "the exam", "noun", "feminine", pic="page"),
            card("die Pause", "the break", "noun", "feminine", pic="clock"),
            card("lernen", "to learn / to study (for school)", "verb", pic="book"),
            card("studieren", "to study at university", "verb", pic="book"),
            card("Ich habe eine Frage.", "I have a question.", "sentence", pic="mark"),
            card("Können Sie das bitte wiederholen?", "Could you please repeat that?", "sentence", pic="ear"),
            card("Wie sagt man das auf Deutsch?", "How do you say that in German?", "sentence", pic="mouth"),
            card("Ich verstehe das nicht.", "I do not understand that.", "sentence", pic="head"),
            card("Die Prüfung ist am Freitag.", "The exam is on Friday.", "sentence", pic="calendar"),
        ],
    },
    {
        "id": "08",
        "title": "WOHNUNG",
        "english_title": "Housing and the flat",
        "subtitle": "RENT, ROOMS, MOVING IN",
        "how_it_works": "A Wohnung is a flat/apartment. Zimmer is a room. Miete is rent. Useful scripts: Die Wohnung ist zu teuer. Die Küche ist klein. Ich suche eine Wohnung. This is Goethe A1/A2 housing, not interior design.",
        "file": "08-wohnung.svg",
        "cards": [
            card("die Wohnung", "the flat / apartment", "noun", "feminine", pic="house"),
            card("das Zimmer", "the room", "noun", "neuter", pic="door"),
            card("die Miete", "the rent", "noun", "feminine", pic="coin"),
            card("der Vermieter / die Vermieterin", "the landlord / landlady", "noun", pic="person"),
            card("einziehen", "to move in", "verb", pic="box"),
            card("ausziehen", "to move out", "verb", pic="box"),
            card("möbliert", "furnished", "phrase", pic="chair"),
            card("unmöbliert", "unfurnished", "phrase", pic="chair"),
            card("die Nebenkosten", "the bills / extra costs", "noun", "feminine", pic="page"),
            card("Ich suche eine Wohnung.", "I am looking for a flat.", "sentence", pic="house"),
            card("Die Miete ist zu teuer.", "The rent is too expensive.", "sentence", pic="coin"),
            card("Das Zimmer ist hell.", "The room is bright.", "sentence", pic="sun"),
            card("Wo ist das Bad?", "Where is the bathroom?", "sentence", pic="water"),
            card("Ich möchte den Vertrag lesen.", "I would like to read the contract.", "sentence", pic="page"),
        ],
    },
    {
        "id": "09",
        "title": "TERMINE",
        "english_title": "Appointments",
        "subtitle": "BOOKING, CHANGING, BEING LATE",
        "how_it_works": "A Termin is an appointment, not the end of something. The key verbs: vereinbaren, verschieben, absagen. Clock + calendar language from Woche+Uhr plugs in here. This is the German office and clinic survival kit.",
        "file": "09-termine.svg",
        "cards": [
            card("der Termin", "the appointment", "noun", "masculine", pic="calendar"),
            card("vereinbaren", "to arrange / agree", "verb", pic="handshake"),
            card("verschieben", "to postpone / move", "verb", pic="calendar"),
            card("absagen", "to cancel", "verb", pic="cross"),
            card("Ich möchte einen Termin.", "I would like an appointment.", "sentence", pic="calendar"),
            card("Passt es Ihnen am Dienstag?", "Does Tuesday work for you? (formal)", "sentence", pic="calendar"),
            card("Leider kann ich nicht.", "Unfortunately I cannot.", "sentence", pic="cross"),
            card("Können wir den Termin verschieben?", "Can we move the appointment?", "sentence", pic="calendar"),
            card("Ich komme zu spät.", "I am running late.", "sentence", pic="clock"),
            card("Entschuldigung für die Verspätung.", "Sorry for the delay.", "sentence", pic="clock"),
            card("Um wie viel Uhr?", "At what time?", "phrase", pic="clock"),
            card("Heute geht es nicht.", "Today does not work.", "sentence", pic="calendar"),
            card("Bis dann!", "See you then!", "phrase", pic="wave"),
            card("Ich habe schon einen Termin.", "I already have an appointment.", "sentence", pic="calendar"),
        ],
    },
    {
        "id": "10",
        "title": "WEIL DASS WENN",
        "english_title": "Because, that, if / when",
        "subtitle": "THE THREE GATES THAT KICK THE VERB TO THE END",
        "how_it_works": "weil (because), dass (that), and wenn (if/when) send the verb to the end of the clause. Ich bleibe zu Hause, weil ich krank bin. wenn is both if and whenever. als is when for a single past event. ob is whether.",
        "file": "10-weil-dass-wenn.svg",
        "cards": [
            card("weil", "because", "phrase", extra="verb to the end", pic="gate"),
            card("dass", "that (conjunction)", "phrase", extra="not das the article", pic="gate"),
            card("wenn", "if / when (whenever)", "phrase", pic="gate"),
            card("als", "when (one past event)", "phrase", pic="clock"),
            card("ob", "whether / if (yes/no)", "phrase", pic="mark"),
            card("Ich lerne Deutsch, weil es wichtig ist.", "I am learning German because it is important.", "sentence", pic="book"),
            card("Ich glaube, dass er recht hat.", "I think that he is right.", "sentence", pic="head"),
            card("Wenn ich Zeit habe, komme ich.", "If I have time, I will come.", "sentence", pic="clock"),
            card("Als ich klein war, wohnte ich in Köln.", "When I was little, I lived in Cologne.", "sentence", pic="child"),
            card("Ich weiß nicht, ob sie kommt.", "I do not know whether she is coming.", "sentence", pic="mark"),
            card("das vs dass", "the/that (article) vs that (conjunction)", "false_friend", pic="mark"),
            card("Kannst du kommen, wenn du fertig bist?", "Can you come when you are finished?", "sentence", pic="door"),
            card("Er sagt, dass er keine Zeit hat.", "He says that he has no time.", "sentence", pic="mouth"),
            card("Ich rufe an, weil der Zug Verspätung hat.", "I am calling because the train is delayed.", "sentence", pic="train"),
        ],
    },
    {
        "id": "11",
        "title": "WÜRDE",
        "english_title": "Would and polite requests",
        "subtitle": "THE SOFT WAY TO ASK FOR ANYTHING",
        "how_it_works": "A2 politeness lives in würde + infinitive and könnte. Ich würde gern… is the default polite want. Könnten Sie… is the default polite ask. This is not full Konjunktiv II. It is the survival slice.",
        "file": "11-wuerde.svg",
        "cards": [
            card("ich würde", "I would", "phrase", pic="soft"),
            card("Ich würde gern einen Kaffee.", "I would like a coffee.", "sentence", pic="cup"),
            card("Ich würde lieber Tee trinken.", "I would rather drink tea.", "sentence", pic="cup"),
            card("Könnten Sie mir helfen?", "Could you help me? (formal)", "sentence", pic="hand"),
            card("Könntest du bitte warten?", "Could you please wait? (informal)", "sentence", pic="clock"),
            card("Hätten Sie einen Moment?", "Would you have a moment?", "sentence", pic="clock"),
            card("Das wäre nett.", "That would be kind.", "sentence", pic="smile"),
            card("Ich hätte gern die Rechnung.", "I would like the bill.", "sentence", pic="page"),
            card("Würden Sie das bitte unterschreiben?", "Would you please sign that?", "sentence", pic="pen"),
            card("An Ihrer Stelle würde ich anrufen.", "In your place I would call.", "sentence", pic="phone"),
            card("gern / lieber / am liebsten", "gladly / rather / most of all", "phrase", pic="heart"),
            card("Kein Problem.", "No problem.", "phrase", pic="check"),
        ],
    },
    {
        "id": "12",
        "title": "ORDINALZAHLEN",
        "english_title": "Ordinal numbers",
        "subtitle": "FIRST, SECOND, THIRD — AND THE DATE",
        "how_it_works": "Ordinals take adjective endings: der erste, am ersten. Dates: der 3. Mai = der dritte Mai. Spoken: am dritten Mai. 1st is erste, 3rd is dritte, 7th is siebte, 8th is achte. The rest mostly add -te (1–19) or -ste (20+).",
        "file": "12-ordinalzahlen.svg",
        "cards": [
            card("der erste", "the first", "phrase", pic="1"),
            card("der zweite", "the second", "phrase", pic="2"),
            card("der dritte", "the third", "phrase", pic="3"),
            card("der siebte", "the seventh", "phrase", extra="not siebente in common speech", pic="7"),
            card("der achte", "the eighth", "phrase", pic="8"),
            card("der zwanzigste", "the twentieth", "phrase", pic="20"),
            card("am ersten Mai", "on the first of May", "phrase", pic="calendar"),
            card("der 3. Oktober", "the 3rd of October", "phrase", extra="spoken: der dritte Oktober", pic="calendar"),
            card("Heute ist der 12. Juni.", "Today is the 12th of June.", "sentence", pic="calendar"),
            card("Mein Geburtstag ist am 21. März.", "My birthday is on the 21st of March.", "sentence", pic="cake"),
            card("im ersten Stock", "on the first floor (EU: one above ground)", "phrase", pic="stairs"),
            card("das erste Mal", "the first time", "phrase", pic="star"),
            card("Er ist Erster geworden.", "He came first.", "sentence", pic="medal"),
            card("Zum ersten Mal in Berlin", "For the first time in Berlin", "phrase", pic="city"),
        ],
    },
]


def svg_poster(title: str, english: str, plate: str, color: str) -> str:
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 960">
  <rect width="768" height="960" fill="#F4EFE4"/>
  <rect x="28" y="28" width="712" height="904" fill="none" stroke="#1A1A1A" stroke-width="8"/>
  <rect x="28" y="28" width="18" height="904" fill="{color}"/>
  <text x="70" y="88" font-family="Georgia, serif" font-size="18" letter-spacing="4" fill="#1A1A1A">{plate}</text>
  <text x="70" y="210" font-family="Georgia, serif" font-size="64" font-weight="700" fill="#1A1A1A">{title}</text>
  <text x="70" y="270" font-family="Georgia, serif" font-size="28" fill="#1A1A1A">{english}</text>
  <line x1="70" y1="300" x2="698" y2="300" stroke="#1A1A1A" stroke-width="2"/>
  <text x="70" y="360" font-family="Georgia, serif" font-size="20" fill="#444">ALLTAG PLUS · EVERYDAY PLUS</text>
  <text x="70" y="900" font-family="Georgia, serif" font-size="16" fill="#666">SCHULWANDKARTE · A1–A2</text>
</svg>
'''


def main() -> None:
    data = json.loads(SRC_JSON.read_text())

    for series in data["series"]:
        series["english_name"] = SERIES_EN.get(series["id"], series["name"])
        if series["id"] == "alltag-plus":
            # rebuilt below
            pass

    data["series"] = [s for s in data["series"] if s["id"] != "alltag-plus"]
    data["posters"] = [p for p in data["posters"] if p["series_id"] != "alltag-plus"]
    data["cards"] = [c for c in data["cards"] if c["series_id"] != "alltag-plus"]

    for poster in data["posters"]:
        en = POSTER_EN.get((poster["series_id"], poster["id"]))
        if en:
            poster["english_title"] = en
            poster["series_english_name"] = SERIES_EN.get(poster["series_id"], poster["series_name"])
        for c in poster.get("cards", []):
            if en:
                c["poster_title_en"] = en

    for card in data["cards"]:
        en = POSTER_EN.get((card["series_id"], card["poster_id"]))
        if en:
            card["poster_title_en"] = en

    series_meta = {
        "id": "alltag-plus",
        "name": "Alltag Plus",
        "english_name": "Everyday Plus",
        "level": "A1/A2",
        "badge": "A1/A2 · ALLTAG PLUS",
        "concepts_file": "scripts/enrich_curriculum.py",
        "output_dir": "output-alltag-plus",
        "color": "#3D5A40",
        "description": "Gap-fill pack: plurals, fixed prepositions, reflexives, days and clock time, countries, school, housing, appointments, weil/dass/wenn, polite würde, ordinals",
        "poster_count": len(GAP_POSTERS),
        "card_count": 0,
    }

    SVG_DIR.mkdir(parents=True, exist_ok=True)
    color = series_meta["color"]
    new_posters = []
    new_cards = []
    n = len(GAP_POSTERS)

    for i, spec in enumerate(GAP_POSTERS, start=1):
        svg = svg_poster(spec["title"], spec["english_title"], f"{i:02d} / {n:02d}", color)
        (SVG_DIR / spec["file"]).write_text(svg)
        poster_cards = []
        for j, raw in enumerate(spec["cards"], start=1):
            item = {
                "id": f"alltag-plus-{spec['id']}-{j:03d}",
                **raw,
                "poster_id": spec["id"],
                "poster_title": spec["title"],
                "poster_title_en": spec["english_title"],
                "series_id": "alltag-plus",
                "rule": raw["rule"] or spec["how_it_works"],
            }
            poster_cards.append(item)
            new_cards.append(item)
        poster = {
            "id": spec["id"],
            "plate_number": f"{i:02d} / {n:02d}",
            "title": spec["title"],
            "english_title": spec["english_title"],
            "subtitle": spec["subtitle"],
            "how_it_works": spec["how_it_works"],
            "image_file": f"output-alltag-plus/{spec['file']}",
            "series_id": "alltag-plus",
            "series_name": "Alltag Plus",
            "series_english_name": "Everyday Plus",
            "series_level": "A1/A2",
            "series_badge": "A1/A2 · ALLTAG PLUS",
            "series_color": color,
            "card_count": len(poster_cards),
            "cards": poster_cards,
        }
        new_posters.append(poster)

    series_meta["card_count"] = len(new_cards)
    data["series"].append(series_meta)
    data["posters"].extend(new_posters)
    data["cards"].extend(new_cards)
    data["stats"] = {
        "total_series": len(data["series"]),
        "total_posters": len(data["posters"]),
        "total_cards": len(data["cards"]),
        "levels": ["A1", "A2"],
    }
    data["generated_at"] = "2026-08-24T15:00:00Z"

    text = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    SRC_JSON.write_text(text)
    PUBLIC_JSON.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC_JSON.write_text(text)
    SCRIPTS_JSON.write_text(text)
    print(
        f"series={data['stats']['total_series']} posters={data['stats']['total_posters']} cards={data['stats']['total_cards']}"
    )


if __name__ == "__main__":
    main()
