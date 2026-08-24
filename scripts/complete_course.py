#!/usr/bin/env python3
"""Finish the A1–A2 course: remaining grammar, thicker thin sheets, listen/speak."""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC_JSON = ROOT / "flashcard-app/src/data/flashcards.json"
PUBLIC_JSON = ROOT / "flashcard-app/public/data/flashcards.json"
SCRIPTS_JSON = ROOT / "scripts/flashcards-data.json"
SVG_DIR = ROOT / "flashcard-app/public/posters/output-kurs-plus"

SERIES_ID = "kurs-plus"
SERIES_COLOR = "#5C2E4E"


def make_card(german, english, typ="sentence", gender=None, section="Main", extra="", pictogram="mark", rule=""):
    return {
        "german": german,
        "english": english,
        "type": typ,
        "gender": gender,
        "section": section,
        "hint": "",
        "extra": extra,
        "pictogram": pictogram,
        "rule": rule,
    }


THIN_EXTRAS = {
    ("grundlagen-1", "09"): {
        "rule": "Separable verbs split in the present: prefix goes to the end. In weil-clauses the verb stays together at the end. In the perfect, ge- sits between prefix and stem: angerufen.",
        "cards": [
            make_card("aufstehen", "to get up", "verb", pictogram="sun", extra="ich stehe auf"),
            make_card("ankommen", "to arrive", "verb", pictogram="train", extra="der Zug kommt an"),
            make_card("anrufen", "to call / phone", "verb", pictogram="phone", extra="ich rufe an"),
            make_card("einkaufen", "to shop / buy groceries", "verb", pictogram="bag", extra="wir kaufen ein"),
            make_card("mitkommen", "to come along", "verb", pictogram="two", extra="kommst du mit?"),
            make_card("fernsehen", "to watch TV", "verb", pictogram="tv", extra="er sieht fern"),
            make_card("zumachen", "to close", "verb", pictogram="door", extra="mach das Fenster zu"),
            make_card("aufmachen", "to open", "verb", pictogram="door", extra="mach die Tür auf"),
            make_card("Ich stehe um sieben auf.", "I get up at seven.", "sentence", pictogram="clock"),
            make_card("Kommt der Bus um zehn an?", "Does the bus arrive at ten?", "sentence", pictogram="bus"),
            make_card("Ruf mich bitte an!", "Please call me!", "sentence", pictogram="phone"),
            make_card("Wir kaufen heute ein.", "We are going shopping today.", "sentence", pictogram="bag"),
            make_card("Ich habe meine Mutter angerufen.", "I called my mother. (perfect)", "sentence", extra="prefix + ge + stem", pictogram="phone"),
            make_card("…weil ich um sechs aufstehe.", "…because I get up at six.", "sentence", extra="prefix stays on the verb at the end", pictogram="sun"),
        ],
    },
    ("grundlagen-2", "07"): {
        "rule": "In a main clause the conjugated verb is always in position two. Yes/no questions put the verb first. Question words take slot one, verb stays second. In weil/dass/wenn clauses the verb goes to the end. Time–manner–place is the usual extra-info order.",
        "cards": [
            make_card("Ich lerne heute Deutsch.", "I am learning German today. (verb second)", "sentence", pictogram="book"),
            make_card("Heute lerne ich Deutsch.", "Today I am learning German. (time in slot 1)", "sentence", pictogram="book"),
            make_card("Lernst du Deutsch?", "Are you learning German? (verb first)", "sentence", pictogram="mark"),
            make_card("Warum lernst du Deutsch?", "Why are you learning German?", "sentence", pictogram="mark"),
            make_card("Ich fahre morgen mit dem Bus nach Berlin.", "I am going to Berlin by bus tomorrow. (time–manner–place)", "sentence", pictogram="bus"),
            make_card("Am Montag arbeite ich zu Hause.", "On Monday I work at home.", "sentence", pictogram="house"),
            make_card("Nicht vor the verb.", "nicht sits before the extra, not before the verb", "phrase", extra="Ich gehe nicht ins Kino.", pictogram="cross"),
            make_card("Ich gehe nicht ins Kino.", "I am not going to the cinema.", "sentence", pictogram="film"),
            make_card("Ich weiß, dass du recht hast.", "I know that you are right. (verb last)", "sentence", pictogram="head"),
            make_card("Kommst du mit, oder bleibst du hier?", "Are you coming, or are you staying here?", "sentence", pictogram="two"),
        ],
    },
    ("grundlagen-2", "08"): {
        "rule": "Location (where something is) takes the dative: in, an, auf, hinter, neben, unter, vor, zwischen. Destination (where to) takes the accusative. Wo? = where (dative). Wohin? = where to (accusative).",
        "cards": [
            make_card("Wo ist der Ball?", "Where is the ball?", "phrase", pictogram="ball"),
            make_card("Wohin geht der Ball?", "Where is the ball going?", "phrase", pictogram="ball"),
            make_card("auf dem Tisch", "on the table (location, dative)", "phrase", extra="der Tisch → dem", pictogram="table"),
            make_card("auf den Tisch", "onto the table (direction, accusative)", "phrase", extra="der → den", pictogram="table"),
            make_card("in der Küche", "in the kitchen", "phrase", pictogram="house"),
            make_card("in die Küche", "into the kitchen", "phrase", pictogram="house"),
            make_card("an der Wand", "on the wall", "phrase", pictogram="wall"),
            make_card("unter dem Stuhl", "under the chair", "phrase", pictogram="chair"),
            make_card("neben der Tür", "next to the door", "phrase", pictogram="door"),
            make_card("hinter dem Haus", "behind the house", "phrase", pictogram="house"),
            make_card("vor dem Bahnhof", "in front of the station", "phrase", pictogram="train"),
            make_card("zwischen den Stühlen", "between the chairs", "phrase", pictogram="chair"),
            make_card("Der Hund liegt unter dem Tisch.", "The dog is lying under the table.", "sentence", pictogram="dog"),
            make_card("Ich stelle die Tasse auf den Tisch.", "I put the cup onto the table.", "sentence", pictogram="cup"),
        ],
    },
}


KURS_POSTERS = [
    {
        "id": "01",
        "title": "FUTUR",
        "english_title": "Future with werden",
        "subtitle": "WHAT WILL HAPPEN — WERDEN + INFINITIVE",
        "how_it_works": "German future is werden + infinitive at the end: Ich werde morgen arbeiten. Present + a time word often already means the future (Ich fahre morgen). Use werden when you want a clear plan, a promise, or a prediction. Conjugate werden: ich werde, du wirst, er wird, wir werden, ihr werdet, sie werden.",
        "file": "01-futur.svg",
        "cards": [
            make_card("werden", "to become / future helper", "verb", pictogram="arrow"),
            make_card("ich werde", "I will / I am going to", "phrase", pictogram="person"),
            make_card("du wirst", "you will (informal)", "phrase", pictogram="person"),
            make_card("er / sie / es wird", "he / she / it will", "phrase", pictogram="person"),
            make_card("wir werden", "we will", "phrase", pictogram="two"),
            make_card("Ich werde Deutsch lernen.", "I will learn German.", "sentence", pictogram="book"),
            make_card("Wirst du morgen kommen?", "Will you come tomorrow?", "sentence", pictogram="calendar"),
            make_card("Es wird regen.", "It is going to rain.", "sentence", pictogram="rain"),
            make_card("Wir werden um acht ankommen.", "We will arrive at eight.", "sentence", pictogram="clock"),
            make_card("Ich fahre nächste Woche nach Berlin.", "I am going to Berlin next week. (present as future)", "sentence", extra="time word = future without werden", pictogram="train"),
            make_card("Das wird schon gut gehen.", "It will be fine.", "sentence", pictogram="smile"),
            make_card("Ich werde dich anrufen.", "I will call you.", "sentence", pictogram="phone"),
            make_card("Was wirst du am Wochenende machen?", "What will you do at the weekend?", "sentence", pictogram="sun"),
            make_card("Sie werden uns helfen.", "They will help us. / You (formal) will help us.", "sentence", pictogram="hand"),
            make_card("Ich werde nicht zu spät kommen.", "I will not be late.", "sentence", pictogram="clock"),
            make_card("werden + infinitive at the end", "helper in slot 2, main verb last", "phrase", pictogram="gate"),
        ],
    },
    {
        "id": "02",
        "title": "RELATIVSÄTZE",
        "english_title": "Relative clauses",
        "subtitle": "THE MAN WHO — DER DIE DAS AS THAT / WHICH / WHO",
        "how_it_works": "A relative clause describes a noun. The relative pronoun matches gender and number of that noun, and takes the case of its job inside the clause. Der Mann, der dort steht. Die Frau, die ich kenne. Das Haus, in dem ich wohne. The verb goes to the end of the clause. Use wo for places, was after alles/nichts/das.",
        "file": "02-relativsaetze.svg",
        "cards": [
            make_card("der Mann, der…", "the man who… (subject, masculine)", "phrase", pictogram="person"),
            make_card("die Frau, die…", "the woman who… (subject, feminine)", "phrase", pictogram="person"),
            make_card("das Kind, das…", "the child who/that… (subject, neuter)", "phrase", pictogram="child"),
            make_card("die Leute, die…", "the people who… (plural)", "phrase", pictogram="crowd"),
            make_card("der Mann, den ich sehe", "the man who(m) I see (accusative)", "phrase", extra="den = object", pictogram="eye"),
            make_card("die Frau, der ich helfe", "the woman I am helping (dative)", "phrase", pictogram="hand"),
            make_card("Das ist der Lehrer, der uns hilft.", "That is the teacher who helps us.", "sentence", pictogram="school"),
            make_card("Das ist die Stadt, in der ich wohne.", "That is the city I live in.", "sentence", extra="in der = in which", pictogram="city"),
            make_card("Hast du das Buch, das ich meine?", "Do you have the book I mean?", "sentence", pictogram="book"),
            make_card("Die Wohnung, die wir suchen, ist zu teuer.", "The flat we are looking for is too expensive.", "sentence", pictogram="house"),
            make_card("Das ist alles, was ich weiß.", "That is all I know.", "sentence", extra="was after alles", pictogram="head"),
            make_card("Berlin, wo ich studiere", "Berlin, where I study", "phrase", pictogram="map"),
            make_card("Kennst du den Film, den wir gesehen haben?", "Do you know the film we watched?", "sentence", pictogram="film"),
            make_card("Ein Freund, mit dem ich Deutsch lerne", "A friend I learn German with", "phrase", extra="preposition + dative", pictogram="two"),
            make_card("Die Frau, deren Auto dort steht", "The woman whose car is standing there", "phrase", extra="deren = whose", pictogram="car"),
            make_card("Verb to the end of the relative clause", "…der dort wohnt.", "phrase", pictogram="gate"),
        ],
    },
    {
        "id": "03",
        "title": "ZU + INFINITIV",
        "english_title": "Infinitive with zu",
        "subtitle": "I TRY TO — THE LITTLE ZU BEFORE THE VERB",
        "how_it_works": "After many verbs and adjectives German uses zu + infinitive: Ich versuche zu kommen. Separable verbs put zu in the middle: aufzustehen. um…zu means in order to. ohne…zu means without doing. Instead of to is statt…zu. No zu after modal verbs or after gehen/lernen in Ich gehe schwimmen.",
        "file": "03-zu-infinitiv.svg",
        "cards": [
            make_card("versuchen zu…", "to try to…", "phrase", pictogram="arrow"),
            make_card("planen zu…", "to plan to…", "phrase", pictogram="calendar"),
            make_card("vergessen zu…", "to forget to…", "phrase", pictogram="head"),
            make_card("Ich versuche, pünktlich zu sein.", "I try to be on time.", "sentence", pictogram="clock"),
            make_card("Ich habe vergessen, Brot zu kaufen.", "I forgot to buy bread.", "sentence", pictogram="bread"),
            make_card("Es ist wichtig, Deutsch zu lernen.", "It is important to learn German.", "sentence", pictogram="book"),
            make_card("Ich habe keine Zeit zu kochen.", "I have no time to cook.", "sentence", pictogram="pan"),
            make_card("Es fängt an zu regnen.", "It is starting to rain.", "sentence", pictogram="rain"),
            make_card("aufzustehen", "to get up (zu in the middle)", "phrase", extra="separable: auf + zu + stehen", pictogram="sun"),
            make_card("Ich versuche, um sieben aufzustehen.", "I try to get up at seven.", "sentence", pictogram="clock"),
            make_card("um…zu", "in order to", "phrase", pictogram="arrow"),
            make_card("Ich lerne Deutsch, um in Berlin zu arbeiten.", "I am learning German in order to work in Berlin.", "sentence", pictogram="city"),
            make_card("ohne zu fragen", "without asking", "phrase", pictogram="cross"),
            make_card("Er geht, ohne sich zu verabschieden.", "He leaves without saying goodbye.", "sentence", pictogram="door"),
            make_card("Ich muss gehen.", "I have to go. (no zu after modals)", "sentence", extra="modals take a bare infinitive", pictogram="door"),
            make_card("Ich gehe schwimmen.", "I go swimming. (no zu after gehen)", "sentence", pictogram="water"),
        ],
    },
    {
        "id": "04",
        "title": "PASSIV",
        "english_title": "Passive voice",
        "subtitle": "IT IS DONE — WERDEN + PAST PARTICIPLE",
        "how_it_works": "The present passive is werden + past participle: Das Brot wird gebacken. The agent is von + dative when you need it. Perfect passive is sein + worden: Das Brot ist gebacken worden. German uses the passive for processes, notices, and when the doer does not matter. A2 needs recognition and a few set phrases more than free production.",
        "file": "04-passiv.svg",
        "cards": [
            make_card("Das Brot wird gebacken.", "The bread is being baked.", "sentence", pictogram="bread"),
            make_card("Deutsch wird hier gesprochen.", "German is spoken here.", "sentence", pictogram="mouth"),
            make_card("Die Tür wird geöffnet.", "The door is being opened.", "sentence", pictogram="door"),
            make_card("Der Brief wird geschrieben.", "The letter is being written.", "sentence", pictogram="page"),
            make_card("Die Wohnung wird renoviert.", "The flat is being renovated.", "sentence", pictogram="house"),
            make_card("Ich werde gefragt.", "I am being asked.", "sentence", pictogram="mark"),
            make_card("Wirst du abgeholt?", "Are you being picked up?", "sentence", pictogram="car"),
            make_card("Das wird gemacht.", "That is being done. / That will get done.", "sentence", pictogram="check"),
            make_card("von dem Lehrer", "by the teacher", "phrase", extra="von + dative", pictogram="person"),
            make_card("Der Kuchen wird von Anna gebacken.", "The cake is being baked by Anna.", "sentence", pictogram="cake"),
            make_card("Hier darf nicht geraucht werden.", "No smoking here. (passive + modal)", "sentence", pictogram="cross"),
            make_card("Das Formular muss ausgefüllt werden.", "The form must be filled in.", "sentence", pictogram="page"),
            make_card("Das Brot ist gebacken worden.", "The bread has been baked. (perfect passive)", "sentence", extra="ist + participle + worden", pictogram="bread"),
            make_card("Die E-Mail ist gestern geschickt worden.", "The email was sent yesterday.", "sentence", pictogram="mail"),
            make_card("Man spricht hier Deutsch.", "People speak German here. (active alternative)", "sentence", extra="man often replaces a passive", pictogram="crowd"),
            make_card("werden + Partizip II", "werden + past participle = present passive", "phrase", pictogram="gear"),
        ],
    },
    {
        "id": "05",
        "title": "HÖREN",
        "english_title": "Listening drills",
        "subtitle": "HEAR IT FIRST — THEN SAY WHAT IT MEANS",
        "how_it_works": "These lines are for the Listen tab. Play the German without looking, then choose the English. Typical A1–A2 audio: times, directions, shops, doctors, small talk. Train the ear on full sentences, not isolated words.",
        "file": "05-hoeren.svg",
        "cards": [
            make_card("Guten Tag, ich hätte gern ein Brot.", "Hello, I would like a loaf of bread.", "sentence", section="LISTEN", pictogram="bread"),
            make_card("Der Zug nach Hamburg fährt um neun Uhr ab.", "The train to Hamburg leaves at nine.", "sentence", section="LISTEN", pictogram="train"),
            make_card("Entschuldigung, wo ist die Toilette?", "Excuse me, where is the toilet?", "sentence", section="LISTEN", pictogram="door"),
            make_card("Ich habe Kopfschmerzen und Fieber.", "I have a headache and a fever.", "sentence", section="LISTEN", pictogram="head"),
            make_card("Können Sie das bitte langsamer sagen?", "Could you please say that more slowly?", "sentence", section="LISTEN", pictogram="ear"),
            make_card("Wir treffen uns morgen um halb drei vor dem Kino.", "We are meeting tomorrow at 2:30 in front of the cinema.", "sentence", section="LISTEN", pictogram="clock"),
            make_card("Die Wohnung hat zwei Zimmer, Küche und Bad.", "The flat has two rooms, a kitchen and a bathroom.", "sentence", section="LISTEN", pictogram="house"),
            make_card("Ich komme aus Spanien und lerne Deutsch.", "I come from Spain and I am learning German.", "sentence", section="LISTEN", pictogram="map"),
            make_card("Nehmen Sie die zweite Straße links.", "Take the second street on the left.", "sentence", section="LISTEN", pictogram="road"),
            make_card("Das kostet zwölf Euro fünfzig.", "That costs twelve euros fifty.", "sentence", section="LISTEN", pictogram="coin"),
            make_card("Ich bin krank und bleibe heute zu Hause.", "I am ill and I am staying at home today.", "sentence", section="LISTEN", pictogram="house"),
            make_card("Haben Sie noch einen Termin am Freitag?", "Do you still have an appointment on Friday?", "sentence", section="LISTEN", pictogram="calendar"),
            make_card("Mein Name ist Meier, ich bin um zehn verabredet.", "My name is Meier, I have an appointment at ten.", "sentence", section="LISTEN", pictogram="person"),
            make_card("Es gibt keinen direkten Zug, Sie müssen umsteigen.", "There is no direct train, you have to change.", "sentence", section="LISTEN", pictogram="train"),
            make_card("Machen Sie das Fenster bitte zu, es zieht.", "Please close the window, there is a draught.", "sentence", section="LISTEN", pictogram="window"),
            make_card("Ich rufe später noch einmal an.", "I will call again later.", "sentence", section="LISTEN", pictogram="phone"),
            make_card("Die Prüfung ist nicht schwer, aber lang.", "The exam is not hard, but it is long.", "sentence", section="LISTEN", pictogram="page"),
            make_card("Wir haben Hunger. Gibt es hier ein Restaurant?", "We are hungry. Is there a restaurant here?", "sentence", section="LISTEN", pictogram="fork"),
        ],
    },
    {
        "id": "06",
        "title": "SPRECHEN",
        "english_title": "Speaking drills",
        "subtitle": "SAY IT OUT LOUD — THEN CHECK THE MODEL",
        "how_it_works": "These lines are for the Speak side of Listen. Read the English, say the German, then play the model. They are the survival scripts of A1–A2: greetings, shops, travel, the doctor, the classroom, the flat hunt.",
        "file": "06-sprechen.svg",
        "cards": [
            make_card("Guten Morgen! Wie geht's?", "Good morning! How are you?", "sentence", section="SPEAK", pictogram="sun"),
            make_card("Mir geht's gut, danke. Und dir?", "I am well, thanks. And you?", "sentence", section="SPEAK", pictogram="smile"),
            make_card("Ich hätte gern einen Kaffee, bitte.", "I would like a coffee, please.", "sentence", section="SPEAK", pictogram="cup"),
            make_card("Was kostet das?", "How much is that?", "sentence", section="SPEAK", pictogram="coin"),
            make_card("Sprechen Sie Englisch?", "Do you speak English? (formal)", "sentence", section="SPEAK", pictogram="mouth"),
            make_card("Ich verstehe das nicht. Können Sie das wiederholen?", "I do not understand. Could you repeat that?", "sentence", section="SPEAK", pictogram="ear"),
            make_card("Ich suche den Bahnhof.", "I am looking for the station.", "sentence", section="SPEAK", pictogram="train"),
            make_card("Ich möchte einen Termin für morgen.", "I would like an appointment for tomorrow.", "sentence", section="SPEAK", pictogram="calendar"),
            make_card("Es tut mir leid, ich komme zu spät.", "I am sorry, I am running late.", "sentence", section="SPEAK", pictogram="clock"),
            make_card("Könnten Sie mir bitte helfen?", "Could you please help me?", "sentence", section="SPEAK", pictogram="hand"),
            make_card("Ich wohne in einer kleinen Wohnung in Berlin.", "I live in a small flat in Berlin.", "sentence", section="SPEAK", pictogram="house"),
            make_card("Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.", "I am learning German because I want to work in Germany.", "sentence", section="SPEAK", pictogram="book"),
            make_card("Woher kommen Sie? — Ich komme aus England.", "Where are you from? — I come from England.", "sentence", section="SPEAK", pictogram="map"),
            make_card("Am Wochenende treffe ich Freunde und koche.", "At the weekend I meet friends and cook.", "sentence", section="SPEAK", pictogram="two"),
            make_card("Mein Kopf tut weh. Ich brauche eine Tablette.", "My head hurts. I need a tablet.", "sentence", section="SPEAK", pictogram="head"),
            make_card("Die Rechnung bitte!", "The bill, please!", "sentence", section="SPEAK", pictogram="page"),
            make_card("Auf Wiedersehen! Schönen Tag noch!", "Goodbye! Have a nice day!", "sentence", section="SPEAK", pictogram="wave"),
            make_card("Ich rufe dich später an.", "I will call you later. (informal)", "sentence", section="SPEAK", pictogram="phone"),
        ],
    },
]


def svg_poster(title: str, english: str, plate: str, color: str) -> str:
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 960">
  <rect width="768" height="960" fill="#F4EFE4"/>
  <rect x="28" y="28" width="712" height="904" fill="none" stroke="#1A1A1A" stroke-width="8"/>
  <rect x="28" y="28" width="18" height="904" fill="{color}"/>
  <text x="70" y="88" font-family="Georgia, serif" font-size="18" letter-spacing="4" fill="#1A1A1A">{plate}</text>
  <text x="70" y="210" font-family="Georgia, serif" font-size="56" font-weight="700" fill="#1A1A1A">{title}</text>
  <text x="70" y="270" font-family="Georgia, serif" font-size="26" fill="#1A1A1A">{english}</text>
  <line x1="70" y1="300" x2="698" y2="300" stroke="#1A1A1A" stroke-width="2"/>
  <text x="70" y="360" font-family="Georgia, serif" font-size="20" fill="#444">KURS PLUS · COURSE PLUS</text>
  <text x="70" y="410" font-family="Georgia, serif" font-size="18" fill="#444">A1–A2 complete course pack</text>
  <text x="70" y="900" font-family="Georgia, serif" font-size="16" fill="#666">SCHULWANDKARTE · A1–A2</text>
</svg>
'''


def attach_card(raw: dict, series_id: str, poster_id: str, poster_title: str, poster_title_en: str, index: int, default_rule: str) -> dict:
    item = {
        "id": f"{series_id}-{poster_id}-{index:03d}",
        **raw,
        "poster_id": poster_id,
        "poster_title": poster_title,
        "poster_title_en": poster_title_en,
        "series_id": series_id,
        "rule": raw.get("rule") or default_rule,
    }
    return item


def thicken(data: dict) -> None:
    by_id = {(p["series_id"], p["id"]): p for p in data["posters"]}
    for key, spec in THIN_EXTRAS.items():
        poster = by_id[key]
        existing_de = {c["german"] for c in poster["cards"]}
        next_n = len(poster["cards"]) + 1
        added = []
        for raw in spec["cards"]:
            if raw["german"] in existing_de:
                continue
            item = attach_card(
                raw,
                poster["series_id"],
                poster["id"],
                poster["title"],
                poster.get("english_title") or poster["title"],
                next_n,
                spec["rule"],
            )
            next_n += 1
            poster["cards"].append(item)
            data["cards"].append(item)
            added.append(item)
        poster["card_count"] = len(poster["cards"])
        for series in data["series"]:
            if series["id"] == poster["series_id"]:
                series["card_count"] = series.get("card_count", 0) + len(added)


def add_kurs_plus(data: dict) -> None:
    data["series"] = [s for s in data["series"] if s["id"] != SERIES_ID]
    data["posters"] = [p for p in data["posters"] if p["series_id"] != SERIES_ID]
    data["cards"] = [c for c in data["cards"] if c["series_id"] != SERIES_ID]

    SVG_DIR.mkdir(parents=True, exist_ok=True)
    n = len(KURS_POSTERS)
    series_meta = {
        "id": SERIES_ID,
        "name": "Kurs Plus",
        "english_name": "Course Plus",
        "level": "A1/A2",
        "badge": "A1/A2 · KURS PLUS",
        "concepts_file": "scripts/complete_course.py",
        "output_dir": "output-kurs-plus",
        "color": SERIES_COLOR,
        "description": "Course closer: future with werden, relative clauses, infinitive with zu, passive, listening drills, speaking scripts",
        "poster_count": n,
        "card_count": 0,
    }

    new_posters = []
    new_cards = []
    for i, spec in enumerate(KURS_POSTERS, start=1):
        (SVG_DIR / spec["file"]).write_text(svg_poster(spec["title"], spec["english_title"], f"{i:02d} / {n:02d}", SERIES_COLOR), encoding="utf-8")
        poster_cards = []
        for j, raw in enumerate(spec["cards"], start=1):
            item = attach_card(raw, SERIES_ID, spec["id"], spec["title"], spec["english_title"], j, spec["how_it_works"])
            poster_cards.append(item)
            new_cards.append(item)
        poster = {
            "id": spec["id"],
            "plate_number": f"{i:02d} / {n:02d}",
            "title": spec["title"],
            "english_title": spec["english_title"],
            "subtitle": spec["subtitle"],
            "how_it_works": spec["how_it_works"],
            "image_file": f"output-kurs-plus/{spec['file']}",
            "series_id": SERIES_ID,
            "series_name": "Kurs Plus",
            "series_english_name": "Course Plus",
            "series_level": "A1/A2",
            "series_badge": "A1/A2 · KURS PLUS",
            "series_color": SERIES_COLOR,
            "card_count": len(poster_cards),
            "cards": poster_cards,
        }
        new_posters.append(poster)

    series_meta["card_count"] = len(new_cards)
    data["series"].append(series_meta)
    data["posters"].extend(new_posters)
    data["cards"].extend(new_cards)


def recount(data: dict) -> None:
    series_posters = {}
    series_cards = {}
    for p in data["posters"]:
        series_posters[p["series_id"]] = series_posters.get(p["series_id"], 0) + 1
        p["card_count"] = len(p["cards"])
        series_cards[p["series_id"]] = series_cards.get(p["series_id"], 0) + p["card_count"]
    for s in data["series"]:
        s["poster_count"] = series_posters.get(s["id"], 0)
        s["card_count"] = series_cards.get(s["id"], 0)
    data["stats"] = {
        "total_series": len(data["series"]),
        "total_posters": len(data["posters"]),
        "total_cards": len(data["cards"]),
        "levels": ["A1", "A2"],
    }
    data["generated_at"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def main() -> None:
    data = json.loads(SRC_JSON.read_text(encoding="utf-8"))
    thicken(data)
    add_kurs_plus(data)
    recount(data)
    text = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    SRC_JSON.write_text(text, encoding="utf-8")
    PUBLIC_JSON.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC_JSON.write_text(text, encoding="utf-8")
    SCRIPTS_JSON.write_text(text, encoding="utf-8")
    print(
        f"series={data['stats']['total_series']} posters={data['stats']['total_posters']} cards={data['stats']['total_cards']}"
    )


if __name__ == "__main__":
    main()
