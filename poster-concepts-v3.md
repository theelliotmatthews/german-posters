# GRUNDLAGEN v3 — audited phrases + pictograms

Same dense study-sheet content as v2, with two language fixes from the audit ("Er kommt heute nicht", "Du hast Recht"), plus flat geometric pictograms in every section to anchor meaning visually. Icon style: Otl Aicher 1972 Munich Olympics pictograms — single ink colour, geometric, no faces, no cartoons.

Generate with `python3 scripts/generate.py --concepts poster-concepts-v3.md --outdir output-v3`.

---

## Series lock (paste at the top of every prompt)

```
SERIES LOCK v3 — dense study sheet with pictograms. Apply exactly, do not invent a new style.

Format: vertical 4:5 educational reference wall chart, DENSELY packed with text like a well-designed dictionary page or airline safety card. Designed graphic artefact, flat printed ink on paper, not a photograph, not a 3D mockup.

Style: 1960s West German Schulwandkarte crossed with Swiss International Typographic Style (Müller-Brockmann). Strict 12-column grid, 16mm margins. Flat solid ink. No photography. No cartoon mascots. No flags. No chalkboards. No 3D. No gradients. No drop shadows.

Pictogram system: flat geometric pictograms in the style of Otl Aicher's 1972 Munich Olympics icons — built from circles, rectangles and 45-degree angles, single solid ink colour each, no outlines-plus-fills, no faces, no shading, no cartoon features. Pictograms sit in fixed small squares aligned to the grid and never overpower the type. Each pictogram uses the colour of its section.

Paper: warm uncoated cream stock #F4EFE4, faint paper tooth kept off letterforms. Faint corner crop marks.

Type system: one neo-grotesque family only (Akzidenz-Grotesk / Helvetica Neue). Title is condensed bold but COMPACT — max 12% of sheet height, top left. Hierarchy from weight and scale. Table and list text is small, regular, highly legible, tabular alignment. Clean kerning, sharp letterforms, no warped type, no extra words, no duplicate text, no misspellings.

Colour grammar (do not invent new colours):
- Ground: cream #F4EFE4
- Ink / rules / most type: near-black #1A1A1A
- Masculine: Prussian blue #1B4B8A
- Feminine: signal red #C41E3A
- Neuter: forest green #2D6A4F
- Highlight / accent: amber #C9A227
Accent covers at most 15% of the sheet.

Every sheet must contain, in this order:
1. Header chrome: top-left small caps "DEUTSCH · ENGLISCH", top-right plate number like "01 / 10", thin full-width rule beneath.
2. Compact title block, top left, with English sub-line.
3. A boxed "HOW IT WORKS" panel: a short English explanation paragraph in 3 to 5 lines, thin black border, amber corner tick.
4. The main content zones as specified per poster: tables, example columns, diagrams, pictograms.
5. Footer, one line: "A1 · GRUNDLAGEN"

German example sentences always in medium weight; their English translations directly beneath in smaller lighter type. This German-then-English pairing must stay perfectly aligned throughout.
```

---

## 01 — DER DIE DAS

### Prompt

```
SERIES LOCK as specified.

Scene: vertical 4:5 dense reference chart, plate 01 of 10, teaching German noun gender.

Title block: "DER DIE DAS" with sub-line "WHY GERMAN HAS THREE WORDS FOR THE"

HOW IT WORKS panel, English text:
"Every German noun has a gender: masculine, feminine or neuter. The gender belongs to the WORD, not the thing. A table is masculine, a door is feminine, a girl is neuter. You cannot guess from meaning — learn every noun WITH its article, and use the ending patterns below to predict hundreds of nouns at once."

Main zone: three tall columns, blue DER, red DIE, green DAS. Each column holds TEN noun rows. Each row: a small flat pictogram square in the column colour on the left, then the German noun with a small English gloss beneath. Pictograms are Aicher-style geometric signs matching each noun:

DER column, blue header "DER — MASCULINE", blue pictograms:
"der Mann — the man" (standing figure)
"der Tisch — the table" (table side view)
"der Hund — the dog" (dog side view)
"der Tag — the day" (sun disc)
"der Stuhl — the chair" (chair side view)
"der Schlüssel — the key" (key)
"der Apfel — the apple" (apple)
"der Zug — the train" (train front)
"der Kaffee — the coffee" (cup)
"der Morgen — the morning" (half sun on horizon)
Endings strip: "-ER -LING -ISMUS -OR usually DER"
Extra rule line: "days, months, seasons: DER"

DIE column, red header "DIE — FEMININE", red pictograms:
"die Frau — the woman" (standing figure with skirt)
"die Tür — the door" (door frame)
"die Katze — the cat" (cat side view)
"die Zeit — the time" (clock face)
"die Wohnung — the flat" (floor plan square)
"die Stadt — the city" (three building blocks)
"die Blume — the flower" (flower)
"die Sprache — the language" (speech square)
"die Arbeit — the work" (hammer)
"die Nacht — the night" (crescent moon)
Endings strip: "-UNG -HEIT -KEIT -SCHAFT -ION usually DIE"
Extra rule line: "most nouns ending -E: DIE"

DAS column, green header "DAS — NEUTER", green pictograms:
"das Kind — the child" (small figure)
"das Haus — the house" (house gable)
"das Buch — the book" (open book)
"das Jahr — the year" (calendar square)
"das Auto — the car" (car side view)
"das Wasser — the water" (three waves)
"das Fenster — the window" (four-pane window)
"das Zimmer — the room" (room corner)
"das Brot — the bread" (bread loaf)
"das Mädchen — the girl" (small figure with skirt)
Endings strip: "-CHEN -LEIN -UM -MENT usually DAS"
Extra rule line: "infinitives as nouns: DAS"

Bottom amber bar: "PLURAL IS ALWAYS DIE"
Under it, four short plural examples in one row:
"der Hund - die Hunde"
"die Katze - die Katzen"
"das Buch - die Bücher"
"das Auto - die Autos"

Footer: "A1 · GRUNDLAGEN"

Constraints: exact text only, no extra words, no duplicate text, pictograms flat and geometric with no faces, no cartoons, no flags, no 3D, no gradients. Correct umlauts on Tür, Schlüssel, Mädchen, Bücher.
```

---

## 02 — 4 FÄLLE

### Prompt

```
SERIES LOCK as specified.

Scene: vertical 4:5 dense reference chart, plate 02 of 10, teaching the four German cases.

Title block: "4 FÄLLE" with sub-line "THE FOUR CASES — WHO DOES WHAT TO WHOM"

HOW IT WORKS panel, English text:
"English shows who does what with word order: the man bites the dog is different from the dog bites the man. German shows it by changing the word THE. The subject is nominative, the direct object accusative, the receiver dative, the owner genitive. Once you read the article, word order becomes flexible."

Zone 1, a pictogram sentence diagram, full width: Aicher-style flat figures acting out the model sentence. A black standing man figure labelled "DER MANN — NOM", an arrow with the word "GIBT" over it, a small red-outlined child figure labelled "DEM KIND — DAT", and a blue ball disc labelled "DEN BALL — AKK" travelling along the arrow. Under the diagram the full sentence:
"Der Mann gibt dem Kind den Ball. — The man gives the child the ball."

Zone 2, the article table, full width, hairline rules, header row near-black with cream type:
Columns: "" "M" "F" "N" "PL"
"NOM  der  die  das  die"
"AKK  den  die  das  die"
"DAT  dem  der  dem  den"
"GEN  des  der  des  der"
Row labels coloured: NOM black, AKK blue, DAT red, GEN green. Column headers: M blue, F red, N green, PL amber.

Zone 3, four case panels stacked, each with a small pictogram, a case label, an English job description, and TWO German examples with English beneath:

Panel NOM, black, pictogram of a single standing figure, label "NOMINATIV — the subject, the doer":
"Der Mann liest. — The man is reading."
"Die Katze schläft. — The cat is sleeping."

Panel AKK, blue, pictogram of an eye, label "AKKUSATIV — the direct object":
"Ich sehe den Mann. — I see the man."
"Sie kauft einen Apfel. — She buys an apple."

Panel DAT, red, pictogram of an open hand receiving, label "DATIV — the receiver, to whom":
"Ich gebe dem Kind den Ball. — I give the child the ball."
"Er hilft der Frau. — He helps the woman."

Panel GEN, green, pictogram of a key, label "GENITIV — the owner, whose":
"das Auto des Mannes — the man's car"
"die Tasche der Frau — the woman's bag"

Zone 4, a slim amber panel:
"ALWAYS DATIVE: helfen · danken · gehören · antworten"
"Ich danke dir. — I thank you."

Footer: "A1 · GRUNDLAGEN"

Constraints: exact text only, tabular table, figures flat geometric Aicher style with no faces, no cartoons, no 3D, no gradients, correct umlauts on Fälle and schläft.
```

---

## 03 — EIN KEIN NICHT

### Prompt

```
SERIES LOCK as specified.

Scene: vertical 4:5 dense reference chart, plate 03 of 10, teaching German negation.

Title block: "EIN KEIN NICHT" with sub-line "A / NOT A / NOT — SAYING NO IN GERMAN"

HOW IT WORKS panel, English text:
"German has two ways to say not. KEIN negates a noun: it means not a or no, and it takes the same endings as EIN. NICHT negates everything else: verbs, adjectives, places, or a specific noun with THE. Rule of thumb: if English says not a or no thing, use kein. Otherwise use nicht."

Zone 1, two matching tables side by side:
Left, "EIN", columns M F N:
"NOM  ein  eine  ein"
"AKK  einen  eine  ein"
"DAT  einem  einer  einem"
Right, "KEIN", columns M F N:
"NOM  kein  keine  kein"
"AKK  keinen  keine  kein"
"DAT  keinem  keiner  keinem"
One line between them: "KEIN IS EIN WITH A K"

Zone 2, header "KEIN — negating a noun", four rows. Each row: a small amber pictogram of the negated thing struck through with one diagonal rule (dog, clock, car, cup), then the pair:
"Ich habe keinen Hund. — I have no dog."
"Sie hat keine Zeit. — She has no time."
"Wir haben kein Auto. — We have no car."
"Er trinkt keinen Kaffee. — He drinks no coffee."

Zone 3, header "NICHT — negating everything else", five pairs, each with a tiny grey category tag:
tag "VERB": "Ich schlafe nicht. — I am not sleeping."
tag "ADJECTIVE": "Das ist nicht teuer. — That is not expensive."
tag "PLACE": "Wir wohnen nicht in Berlin. — We do not live in Berlin."
tag "SPECIFIC NOUN": "Ich habe den Schlüssel nicht. — I do not have the key."
tag "TIME": "Er kommt heute nicht. — He is not coming today."

Zone 4, amber panel, placement rule:
"NICHT GOES LATE — after the object, before the thing it denies"
"Ich kaufe das Buch nicht. — I am not buying the book."

Footer: "A1 · GRUNDLAGEN"

Constraints: exact text only, no duplicate grids, struck-through pictograms flat and geometric, no cartoons, no 3D, no gradients, correct spellings of keinen, keinem, keiner, Schlüssel.
```

---

## 04 — SEIN + HABEN

### Prompt

```
SERIES LOCK as specified.

Scene: vertical 4:5 dense reference chart, plate 04 of 10, teaching the verbs to be and to have.

Title block: "SEIN + HABEN" with sub-line "TO BE AND TO HAVE — THE TWO ENGINES OF GERMAN"

HOW IT WORKS panel, English text:
"Sein (to be) and haben (to have) are the two most used verbs in German and both are irregular, just like in English: I am, you are, he is. You will use them in almost every sentence and later to build the past tense. Do not translate form by form — memorise each line as a complete sound."

Zone 1, two full conjugation tables side by side, each headed by one pictogram: SEIN gets a black standing figure (being), HABEN gets an amber hand holding a square (having). Three columns each: pronoun, German form, English:

Left table, header "SEIN — TO BE", black rules:
"ich bin — I am"
"du bist — you are"
"er/sie/es ist — he/she/it is"
"wir sind — we are"
"ihr seid — you all are"
"sie/Sie sind — they/you are"

Right table, header "HABEN — TO HAVE", amber rules:
"ich habe — I have"
"du hast — you have"
"er/sie/es hat — he/she/it has"
"wir haben — we have"
"ihr habt — you all have"
"sie/Sie haben — they/you have"

Zone 2, header "SEIN IN USE", four pairs:
"Ich bin müde. — I am tired."
"Du bist mein Freund. — You are my friend."
"Wir sind aus England. — We are from England."
"Sie ist Lehrerin. — She is a teacher."

Zone 3, header "HABEN IN USE", four pairs:
"Ich habe Hunger. — I am hungry. (German HAS hunger)"
"Du hast Recht. — You are right. (German HAS right)"
"Er hat keine Zeit. — He has no time."
"Wir haben eine Frage. — We have a question."

Zone 4, amber panel, the trap for English speakers, with four tiny black pictograms above the German words — fork and knife, drinking glass, alarmed exclamation triangle, tick mark:
"GERMAN USES HABEN WHERE ENGLISH USES TO BE"
"Hunger haben · Durst haben · Angst haben · Recht haben"
"hungry · thirsty · afraid · right"

Footer: "A1 · GRUNDLAGEN"

Constraints: exact forms only, no extra verbs, no past tense forms, pictograms flat geometric, no cartoons, no 3D, no gradients, correct spellings of seid, habt, müde, Recht capitalised.
```

---

## 05 — WORTSTELLUNG

### Prompt

```
SERIES LOCK as specified.

Scene: vertical 4:5 dense reference chart, plate 05 of 10, teaching German word order.

Title block: "WORTSTELLUNG" with sub-line "WORD ORDER — THE VERB IS ALWAYS SECOND"

HOW IT WORKS panel, English text:
"In a German statement the conjugated verb sits in position two — always. Position one can be the subject, the time, or the place; whatever you promote to the front, the verb stays second and the subject slips behind it. Questions put the verb first. And after little words like weil, dass and ob, the verb runs to the very end of the clause."

Zone 1, header "STATEMENT — VERB SECOND", with a small blue Aicher-style train pictogram at the right of the header. Three pairs showing the same sentence rotated, verb "fahre" boxed in black each time:
"Ich fahre morgen nach Berlin. — I am going to Berlin tomorrow."
"Morgen fahre ich nach Berlin. — Tomorrow I am going to Berlin."
"Nach Berlin fahre ich morgen. — To Berlin I am going tomorrow."
Caption: "FRONT SLOT CHANGES · VERB STAYS SECOND"

Zone 2, header "QUESTION — VERB FIRST", with a small red question-slot pictogram (empty square before a row of filled squares). Three pairs:
"Fährst du morgen? — Are you going tomorrow?"
"Hast du Zeit? — Do you have time?"
"Bist du müde? — Are you tired?"

Zone 3, header "WEIL / DASS / OB — VERB LAST", with a small green arrow-to-end pictogram (arrow jumping over squares to the last position). Three pairs, final verb boxed in amber:
"Ich bleibe hier, weil ich müde bin. — I am staying here because I am tired."
"Ich glaube, dass er kommt. — I think that he is coming."
"Ich weiß nicht, ob sie Zeit hat. — I do not know if she has time."

Zone 4, TIME MANNER PLACE bar: blue block "TIME" with a tiny clock pictogram, red block "MANNER" with a tiny train pictogram, green block "PLACE" with a tiny map-pin pictogram, then one worked pair:
"Ich fahre am Montag mit dem Zug nach Berlin."
"— I go to Berlin by train on Monday."
Small labels under the German: "am Montag = TIME · mit dem Zug = MANNER · nach Berlin = PLACE"
Caption: "GERMAN ORDERS IT TIME, MANNER, PLACE — ENGLISH IS THE REVERSE"

Footer: "A1 · GRUNDLAGEN"

Constraints: exact sentences only, no extra clauses, pictograms flat geometric, no cartoons, no 3D, no gradients, correct umlauts on fährst, müde, weiß.
```

---

## 06 — DU / SIE

### Prompt

```
SERIES LOCK as specified.

Scene: vertical 4:5 dense reference chart, plate 06 of 10, teaching formal and informal address.

Title block: "DU / SIE" with sub-line "THE TWO YOUS — GERMANY'S FIRST SOCIAL RULE"

HOW IT WORKS panel, English text:
"German splits English you in two. DU is for friends, family, children and animals. SIE (always capital) is for strangers, officials, shops and colleagues until invited otherwise. The verb changes with it: du kommst but Sie kommen. When unsure, use Sie — too formal is polite, too informal is rude. Wait for the older or senior person to offer du."

Main zone, split sheet: left cream DU column, right near-black SIE panel with cream type.

DU column, blue header "DU — INFORMAL". Under the header a row of three small blue Aicher pictograms: two figures side by side, a small child figure, a dog.
Use list: "friends · family · children · pets · classmates"
Greetings: "Hallo — hello" and "Tschüss — bye"
Five example pairs:
"Kommst du mit? — Are you coming along?"
"Wie heißt du? — What is your name?"
"Wo wohnst du? — Where do you live?"
"Was machst du? — What are you doing?"
"Hast du Zeit? — Do you have time?"
Verb rule chip: "du + verb ends in -ST"

SIE panel, cream type on near-black, header "SIE — FORMAL". Under the header a row of three small cream Aicher pictograms: a figure with a briefcase, a counter/desk, an office building block.
Use list: "strangers · shops · offices · work · anyone older"
Greetings: "Guten Tag — good day" and "Auf Wiedersehen — goodbye"
Five example pairs:
"Kommen Sie mit? — Are you coming along?"
"Wie heißen Sie? — What is your name?"
"Wo wohnen Sie? — Where do you live?"
"Was machen Sie? — What are you doing?"
"Haben Sie Zeit? — Do you have time?"
Verb rule chip: "Sie + verb ends in -EN"

Bottom amber plate spanning both halves, with a small pictogram of two figures shaking hands:
"Wollen wir uns duzen? — Shall we switch to du?"
Second line: "THE OLDER OR SENIOR PERSON OFFERS FIRST"

Footer: "A1 · GRUNDLAGEN"

Constraints: exact strings only, Sie always capitalised in German, matching question pairs mirror each other line for line, pictograms flat geometric with no faces, no photos, no 3D, no gradients, correct spellings of heißt, heißen, Tschüss, Wiedersehen.
```

---

## 07 — W-FRAGEN

### Prompt

```
SERIES LOCK as specified.

Scene: vertical 4:5 dense reference chart, plate 07 of 10, teaching German question words.

Title block: "W-FRAGEN" with sub-line "QUESTION WORDS — HOW TO ASK ANYTHING"

HOW IT WORKS panel, English text:
"Every open question starts with a W-word, then the verb, then the subject: Wo wohnst du? Literally where live you. The pattern never changes, so ten words unlock every question you will ever need. Yes-no questions simply drop the W-word and start with the verb: Kommst du?"

Main zone, ten rows. Each row: a small flat pictogram square on the far left, the W-word large in its colour, then the full example pair. Pictograms Aicher-style, matching the question meaning:

Row 1, blue "WER — WHO" (single figure pictogram):
"Wer ist das? — Who is that?"
Row 2, red "WAS — WHAT" (square outline pictogram):
"Was machst du? — What are you doing?"
Row 3, green "WO — WHERE" (map pin pictogram):
"Wo wohnst du? — Where do you live?"
Row 4, amber "WANN — WHEN" (clock pictogram):
"Wann kommt der Zug? — When does the train come?"
Row 5, black "WARUM — WHY" (branching arrows pictogram):
"Warum lernst du Deutsch? — Why are you learning German?"
Row 6, black "WIE — HOW" (gear pictogram):
"Wie geht es dir? — How are you?"
Row 7, black "WOHIN — WHERE TO" (arrow leaving a square):
"Wohin gehst du? — Where are you going?"
Row 8, black "WOHER — WHERE FROM" (arrow entering a square):
"Woher kommst du? — Where are you from?"
Row 9, black "WIE VIEL — HOW MUCH" (three coins pictogram):
"Wie viel kostet das? — How much does that cost?"
Row 10, black "WELCHER — WHICH" (two squares, one ticked):
"Welcher Bus fährt zum Bahnhof? — Which bus goes to the station?"

Bottom panel, header "NO W-WORD? VERB GOES FIRST", two pairs:
"Kommst du morgen? — Are you coming tomorrow?"
"Sprechen Sie Englisch? — Do you speak English?"

Footer: "A1 · GRUNDLAGEN"

Constraints: exact strings only, ten rows exactly, aligned as a table, pictograms flat geometric, no cartoons, no question-mark art, no 3D, no gradients, correct spellings of warum, wohin, woher, fährt, Bahnhof.
```

---

## 08 — MODALVERBEN

### Prompt

```
SERIES LOCK as specified.

Scene: vertical 4:5 dense reference chart, plate 08 of 10, teaching German modal verbs.

Title block: "MODALVERBEN" with sub-line "CAN, MUST, WANT — THE SIX HELPER VERBS"

HOW IT WORKS panel, English text:
"A modal verb changes the mood of a sentence: ability, duty, desire, permission. The modal takes position two and the main verb waits at the END as a plain infinitive: Ich kann Deutsch sprechen — literally I can German to-speak. Master this bracket and half of spoken German opens up."

Zone 1, the sentence bracket, one worked example with slots:
"ICH" "KANN" (solid black) "DEUTSCH" "SPRECHEN" (amber outline)
"Ich kann Deutsch sprechen. — I can speak German."
Caption: "MODAL IN SLOT 2 · REAL VERB AT THE END"

Zone 2, six modal panels in a 2-by-3 grid. Each panel: one flat Aicher pictogram top right in the panel colour, verb, English meaning, ich/du/er forms, one example pair:

Panel blue "KÖNNEN — CAN" (swimmer pictogram):
"ich kann · du kannst · er kann"
"Ich kann schwimmen. — I can swim."

Panel red "MÜSSEN — MUST" (briefcase pictogram):
"ich muss · du musst · er muss"
"Ich muss arbeiten. — I must work."

Panel green "WOLLEN — WANT" (bed pictogram):
"ich will · du willst · er will"
"Ich will schlafen. — I want to sleep."

Panel black "SOLLEN — SHOULD" (clock pictogram):
"ich soll · du sollst · er soll"
"Du sollst warten. — You should wait."

Panel black "DÜRFEN — MAY" (raised hand pictogram):
"ich darf · du darfst · er darf"
"Darf ich fragen? — May I ask?"

Panel amber "MÖGEN — LIKE" (coffee cup pictogram):
"ich mag · du magst · er mag"
"Ich mag Kaffee. — I like coffee."

Zone 3, amber panel, the polite one:
"MÖCHTEN — WOULD LIKE · the polite twin of mögen"
"Ich möchte einen Kaffee, bitte. — I would like a coffee, please."
"Möchten Sie etwas trinken? — Would you like something to drink?"

Footer: "A1 · GRUNDLAGEN"

Constraints: exact verbs and forms only, no past tense, umlauts correct on können, müssen, dürfen, mögen, möchte, pictograms flat geometric with no faces, no cartoons, no 3D, no gradients.
```

---

## 09 — TRENNBARE VERBEN

### Prompt

```
SERIES LOCK as specified.

Scene: vertical 4:5 dense reference chart, plate 09 of 10, teaching separable verbs.

Title block: "TRENNBARE VERBEN" with sub-line "VERBS THAT SPLIT IN HALF"

HOW IT WORKS panel, English text:
"Many German verbs carry a prefix that snaps off: anrufen means to phone, but in a sentence the AN flies to the end: Ich rufe dich an — I phone you. Think of English phrasal verbs said backwards: I call you UP. The prefix returns to the front in the infinitive and after weil, dass and ob."

Zone 1, hero demonstration: "AN|RUFEN" large, AN in blue, RUFEN in black, thin amber gap between. Under it the living sentence:
"Ich rufe dich morgen an. — I will phone you tomorrow."
Caption: "THE PREFIX WAITS AT THE END OF THE SENTENCE"

Zone 2, ten verb rows, four aligned columns: a small black Aicher pictogram, infinitive with blue prefix, German sentence with blue prefix at the end, English translation beneath the sentence. Pictograms match the verbs:

(telephone handset) "anrufen" / "Ich rufe dich an." / "I phone you."
(alarm clock) "aufstehen" / "Ich stehe um sieben auf." / "I get up at seven."
(shopping basket) "einkaufen" / "Wir kaufen heute ein." / "We shop today."
(door with arrow out) "ausgehen" / "Sie geht am Freitag aus." / "She goes out on Friday."
(train at platform) "ankommen" / "Der Zug kommt um acht an." / "The train arrives at eight."
(two figures walking) "mitkommen" / "Kommst du mit?" / "Are you coming along?"
(television set) "fernsehen" / "Er sieht abends fern." / "He watches TV in the evening."
(closed door) "zumachen" / "Mach die Tür zu!" / "Close the door!"
(open window) "aufmachen" / "Ich mache das Fenster auf." / "I open the window."
(car with figure) "abholen" / "Ich hole dich ab." / "I pick you up."

Zone 3, amber panel, the exception:
"AFTER WEIL THE VERB REJOINS"
"weil ich früh aufstehe — because I get up early"
"weil er abends fernsieht — because he watches TV in the evening"

Footer: "A1 · GRUNDLAGEN"

Constraints: exact verb rows only, prefixes coloured blue consistently, tabular alignment, pictograms flat geometric with no faces, no cartoons, no 3D, no gradients, correct spellings of aufstehe, fernsieht, früh.
```

---

## 10 — WO / WOHIN

### Prompt

```
SERIES LOCK as specified.

Scene: vertical 4:5 dense reference chart, plate 10 of 10, teaching two-way prepositions.

Title block: "WO / WOHIN" with sub-line "IN OR INTO — WHEN PREPOSITIONS CHANGE CASE"

HOW IT WORKS panel, English text:
"Nine prepositions can take two cases. If you are STAYING somewhere, use the dative — answering WO, where. If you are MOVING somewhere, use the accusative — answering WOHIN, where to. English does the same with in and into. One question decides the case every single time: is anything changing location?"

Zone 1, plan diagram, larger than before: a top-down room with labelled blocks "TISCH", "STUHL", "TÜR". A red dot on the chair labelled "WO — DAT". A blue arrow from the door to the table labelled "WOHIN — AKK". Flat orthographic plan, no perspective, no people.

Zone 2, the nine prepositions as a strip; each cell holds a tiny black pictogram of a dot positioned relative to a square (dot beside, on top, behind, inside, next to, above, under, in front, between) with the word and gloss:
"AN — at/on" "AUF — on top" "HINTER — behind" "IN — in" "NEBEN — next to" "ÜBER — above" "UNTER — under" "VOR — in front" "ZWISCHEN — between"

Zone 3, paired examples table, two columns. Left column red header "WO? STAY = DATIVE" with a red dot pictogram, right column blue header "WOHIN? MOVE = ACCUSATIVE" with a blue arrow pictogram. Five rows, each row uses the same preposition on both sides, German with English beneath:

Row IN:
"Ich bin in der Küche. — I am in the kitchen."
"Ich gehe in die Küche. — I go into the kitchen."
Row AUF:
"Das Buch liegt auf dem Tisch. — The book lies on the table."
"Ich lege das Buch auf den Tisch. — I put the book onto the table."
Row AN:
"Das Bild hängt an der Wand. — The picture hangs on the wall."
"Ich hänge das Bild an die Wand. — I hang the picture onto the wall."
Row UNTER:
"Der Hund schläft unter dem Tisch. — The dog sleeps under the table."
"Der Hund läuft unter den Tisch. — The dog runs under the table."
Row VOR:
"Das Auto steht vor dem Haus. — The car is in front of the house."
"Ich fahre das Auto vor das Haus. — I drive the car to the front of the house."

Zone 4, two chips: red "DAT = STAY · WO?" and blue "AKK = MOVE · WOHIN?"
One memory line: "NO MOTION, NO ACCUSATIVE"

Footer: "A1 · GRUNDLAGEN"

Constraints: exact sentences only, five paired rows exactly, tabular alignment, dot-and-square pictograms flat geometric, no cartoons, no isometric room, no people, no 3D, no gradients, correct umlauts on über, Küche, hängt, läuft, schläft, Tür.
```
