# GRUNDLAGEN — 10 German wall-chart posters

A matched series of A1 educational infographic posters for an English speaker learning German. One idea per sheet. Same paper, type, colour grammar, and plate chrome on every poster so they read as a set on a wall.

Image models will garble long grammar tables. These prompts keep every on-poster string short and quoted. After generation, treat type as a draft: fix spelling in Figma / Illustrator before print.

**Best model for these:** GPT Image 2 (text-heavy). Seedream 5 is second. Flux 2 Pro if you want the series to stay colour-locked across all 10.

**Format for all:** vertical 4:5 designed poster, graphic design artefact, not a photo of a poster on a wall.

---

## Series lock (paste at the top of every prompt)

```
SERIES LOCK — apply to this poster and do not invent a new style.

Format: vertical 4:5 educational wall chart, designed graphic artefact, flat printed ink on paper, not a photograph of a poster, not a 3D mockup.

Style: 1960s West German Schulwandkarte crossed with Swiss International Typographic Style (Josef Müller-Brockmann / Karl Gerstner). Strict asymmetric 12-column grid, 20mm margins, one geometric device that breaks the grid once. Flat solid ink. No photography. No illustration of smiling students. No cartoon mascots. No flags. No chalkboards. No 3D. No gradients. No drop shadows. No lens flare. No floating particles. No teal-orange grade. No centered-everything composition.

Paper: warm uncoated cream stock #F4EFE4, faint paper tooth, 2% letterpress impression on large type only. Corner crop marks and a tiny registration star, very faint.

Type system: one neo-grotesque family only (Akzidenz-Grotesk / Helvetica Neue). Hierarchy from weight and scale. Title is ultra-condensed black, slightly tight tracking. Body and table cells are the same family, regular and medium, never a second font. Clean kerning, sharp letterforms, no warped type, no extra words, no duplicate text, no misspellings.

Colour grammar (do not invent new colours):
- Ground: cream #F4EFE4
- Ink / rules / most type: near-black #1A1A1A
- Masculine: Prussian blue #1B4B8A
- Feminine: signal red #C41E3A
- Neuter: forest green #2D6A4F
- Plural / accent: amber #C9A227
Accent colour covers at most 15% of the sheet.

Series chrome, every poster:
- Top-left small caps: "DEUTSCH · ENGLISCH"
- Top-right tabular: plate number like "01 / 10"
- Thin horizontal rule under the header, full width inside the margins
- Footer, one line only, small: "A1 · GRUNDLAGEN"
```

---

## Colour grammar (use this in real life too)

| Role | Colour | Hex | Use |
|---|---|---|---|
| Ground | cream stock | `#F4EFE4` | paper |
| Ink | near-black | `#1A1A1A` | rules, most type |
| Masculine | Prussian blue | `#1B4B8A` | der, er, ihn, ihm |
| Feminine | signal red | `#C41E3A` | die, sie, ihr |
| Neuter | forest green | `#2D6A4F` | das, es |
| Plural / accent | amber | `#C9A227` | die (pl), series marks |

Cases (posters 02, 03, 10): Nominative = black, Accusative = blue, Dative = red, Genitive = green.

---

## 01 — DER DIE DAS

**One idea:** English has one "the". German has three, and the gender lives on the noun, not the object.

**Teaches:** definite articles; reliable ending patterns; plural is always *die*.

**Visual:** three equal vertical columns (blue / red / green) under a huge cropped title. Each column is a noun stack plus a small "endings" strip. Amber bar along the bottom for the plural rule.

### Prompt

```
SERIES LOCK as specified.

Scene: a vertical 4:5 German-language wall chart, plate 01 of 10.

Subject: three tall equal columns that teach the three German words for "the".

Title zone, top, left-aligned, enormous condensed grotesk, cropped by the top edge: "DER DIE DAS"
Sub-line under the title, medium grotesk: "THE THREE THE'S"
Top-left chrome: "DEUTSCH · ENGLISCH"
Top-right chrome: "01 / 10"

Column 1, left third, Prussian blue #1B4B8A field or blue rules on cream:
Header: "DER"
Small English gloss: "MASCULINE"
Stacked nouns, each on its own line, black type with a small blue square bullet:
"der Mann"
"der Tisch"
"der Hund"
"der Tag"
"der Name"
Endings strip at the foot of the column, small:
"-ER  -LING  -ISMUS  -OR"

Column 2, centre third, signal red #C41E3A:
Header: "DIE"
Gloss: "FEMININE"
Stacked nouns:
"die Frau"
"die Tür"
"die Katze"
"die Zeit"
"die Wohnung"
Endings strip:
"-UNG  -HEIT  -KEIT  -SCHAFT  -ION"

Column 3, right third, forest green #2D6A4F:
Header: "DAS"
Gloss: "NEUTER"
Stacked nouns:
"das Kind"
"das Haus"
"das Buch"
"das Jahr"
"das Mädchen"
Endings strip:
"-CHEN  -LEIN  -UM  -MENT"

Bottom amber #C9A227 horizontal bar, full width inside margins, black type:
"PLURAL IS ALWAYS DIE"

One small caption, lower left, not on the amber bar:
"GENDER LIVES ON THE NOUN"

Footer: "A1 · GRUNDLAGEN"

Important details: asymmetric grid, generous cream margins, one thin black rule under the header. Columns are flat colour blocks or ruled panels, not cards with shadows. Pictograms optional and tiny (a man, a door, a house) as simple geometric signs, not cartoons. Texture is uncoated paper grain only, kept off the letterforms.

Use case: printable A2 classroom wall chart for an English adult learning German.

Constraints: exact text only, no extra words, no duplicate text, no German flags, no lederhosen, no beer, no smiling teacher, no 3D, no gradients, no centered title block, no misspellings of Mann, Tür, Katze, Wohnung, Mädchen.
```

---

## 02 — 4 FÄLLE

**One idea:** German marks who does what to whom by changing *the*, not by word order.

**Teaches:** Nominative / Accusative / Dative / Genitive; the definite-article grid; one model sentence.

**Visual:** a sentence strip as a flow diagram across the upper half; a 5-column article table in the lower half.

### Prompt

```
SERIES LOCK as specified.

Scene: a vertical 4:5 German case wall chart, plate 02 of 10.

Subject: one model sentence drawn as a flow, then a definite-article table.

Title zone, top left, enormous condensed: "4 FÄLLE"
Sub-line: "WHO DOES WHAT"
Chrome: "DEUTSCH · ENGLISCH" and "02 / 10"

Upper half, a left-to-right flow of four labelled boxes connected by thin black arrows, not centered, sitting on the grid:

Box 1, black outline: "DER MANN"
Tiny label above: "NOM"
Tiny English under: "THE DOER"

A small verb chip between boxes: "GIBT"

Box 2, signal red outline: "DEM KIND"
Tiny label: "DAT"
English: "TO WHOM"

Box 3, Prussian blue outline: "DEN BALL"
Tiny label: "AKK"
English: "WHAT"

Full sentence under the flow, medium weight:
"Der Mann gibt dem Kind den Ball."

Lower half: a clean 5-by-5 table, black hairline rules, cream cells, no shading except the header row in near-black with cream type.

Header row cells: "" then "M" then "F" then "N" then "PL"
Row 2: "NOM" "der" "die" "das" "die"
Row 3: "AKK" "den" "die" "das" "die"
Row 4: "DAT" "dem" "der" "dem" "den"
Row 5: "GEN" "des" "der" "des" "der"

Colour the four row labels: NOM black, AKK blue #1B4B8A, DAT red #C41E3A, GEN green #2D6A4F.
Colour the M column header blue, F red, N green, PL amber.

Right of the table, a tight four-line key:
"NOM = who"
"AKK = what / whom"
"DAT = to whom"
"GEN = whose"

Footer: "A1 · GRUNDLAGEN"

Important details: Swiss grid, one diagonal amber rule behind the flow boxes as the single grid-break. Table type is tabular, same grotesk, no serif. Paper tooth only. No people illustrations. No 3D boxes.

Use case: printable A2 grammar wall chart.

Constraints: exact strings only, no extra words, no duplicate tables, no misspellings, no cartoon ball or child drawings that compete with type, no gradients, no drop shadows on the boxes.
```

---

## 03 — EIN KEIN NICHT

**One idea:** *kein* is "not a". *nicht* is "not" for everything else.

**Teaches:** ein-words; kein mirrors ein; nicht vs kein placement.

**Visual:** two small article grids side by side (EIN / KEIN), then a large split rule at the bottom with one example each.

### Prompt

```
SERIES LOCK as specified.

Scene: a vertical 4:5 German negation wall chart, plate 03 of 10.

Subject: EIN and KEIN as matching grids, then NICHT as a different tool.

Title zone: "EIN KEIN NICHT"
Sub-line: "A / NO / NOT"
Chrome: "DEUTSCH · ENGLISCH" and "03 / 10"

Upper half, two tables side by side, same 4-by-4 structure, hairline rules.

Left table title: "EIN"
Headers: "M" "F" "N"
Row NOM: "ein" "eine" "ein"
Row AKK: "einen" "eine" "ein"
Row DAT: "einem" "einer" "einem"

Right table title: "KEIN"
Headers: "M" "F" "N"
Row NOM: "kein" "keine" "kein"
Row AKK: "keinen" "keine" "kein"
Row DAT: "keinem" "keiner" "keinem"

A small note under the tables, one line:
"KEIN IS EIN WITH A K"

Lower third, two large example panels split by a vertical black rule:

Left panel, amber tick mark:
"Ich habe keinen Hund."
Gloss under: "I HAVE NO DOG"
Tiny label: "KEIN + NOUN"

Right panel:
"Ich habe den Hund nicht."
Gloss: "I DO NOT HAVE THE DOG"
Tiny label: "NICHT + THE REST"

Footer strip, one line:
"KEIN REPLACES A / THE · NICHT NEGATES THE VERB"

Footer chrome: "A1 · GRUNDLAGEN"

Important details: tables aligned to the same baseline. Masculine cells have a thin blue left rule, feminine a red left rule, neuter a green left rule. No cartoons of dogs. One geometric bone or collar sign is allowed, tiny, amber.

Use case: printable A2 classroom chart.

Constraints: exact text only, no extra example sentences, no duplicate grids, no misspellings of einen, keinem, keiner, no 3D, no gradients, no speech bubbles.
```

---

## 04 — SEIN + HABEN

**One idea:** these two verbs run half of beginner German. Learn them as ladders, not lists.

**Teaches:** full present tense of *sein* and *haben*; ich/du/er/wir/ihr/sie.

**Visual:** two tall ladders, left SEIN in black, right HABEN in amber. Person labels as a shared spine down the gutter.

### Prompt

```
SERIES LOCK as specified.

Scene: a vertical 4:5 conjugation wall chart, plate 04 of 10.

Subject: two verb ladders sharing a person spine.

Title zone: "SEIN + HABEN"
Sub-line: "I AM / I HAVE"
Chrome: "DEUTSCH · ENGLISCH" and "04 / 10"

Centre gutter, six small person labels stacked, medium grotesk, black:
"ICH"
"DU"
"ER SIE ES"
"WIR"
"IHR"
"SIE / SIE"

Left ladder, tall, black rules, title at top of ladder: "SEIN"
Six rungs, large type:
"bin"
"bist"
"ist"
"sind"
"seid"
"sind"
Tiny English to the left of the ladder, one column:
"I AM"
"YOU ARE"
"HE IS"
"WE ARE"
"YOU ARE"
"THEY ARE"

Right ladder, amber #C9A227 rules, title: "HABEN"
Six rungs:
"habe"
"hast"
"hat"
"haben"
"habt"
"haben"
Tiny English to the right:
"I HAVE"
"YOU HAVE"
"HE HAS"
"WE HAVE"
"YOU HAVE"
"THEY HAVE"

Bottom caption, one line:
"IRREGULAR ON PURPOSE · LEARN AS SOUND"

Footer: "A1 · GRUNDLAGEN"

Important details: ladders are graphic (thick horizontal rungs, one vertical rail), not cute illustrations. The two "sind" and two "haben" cells may use a thin repeated-rule mark to show the repeat. Asymmetric: SEIN ladder starts higher than HABEN. Cream ground, paper tooth, no people drawings, no faces.

Use case: printable A2 drill chart.

Constraints: exact forms only, no extra verbs, no past tense, no misspellings of seid or habt, no 3D metal ladders, no gradients, no clip-art people.
```

---

## 05 — V2

**One idea:** in a German statement the conjugated verb is always the second *thing*, not the second word.

**Teaches:** V2; Time-Manner-Place; verb-last after *weil / dass / ob*.

**Visual:** three numbered diagrams stacked. A TMP colour bar. One English vs German pair at the top.

### Prompt

```
SERIES LOCK as specified.

Scene: a vertical 4:5 German word-order wall chart, plate 05 of 10.

Subject: three sentence machines that show where the verb sits.

Title zone: "V2"
Sub-line: "THE VERB IS SECOND"
Chrome: "DEUTSCH · ENGLISCH" and "05 / 10"

Top comparison, two lines, left-aligned:
English, smaller, grey-black: "I often go to Berlin on Monday."
German, larger: "Ich fahre am Montag oft nach Berlin."

A horizontal TMP bar under that, three blocks:
Blue block: "TIME"
Red block: "MANNER"
Green block: "PLACE"
Tiny caption: "AM MONTAG · OFT · NACH BERLIN"

Diagram 1, labelled "01 STATEMENT":
Four numbered slots in a row:
Slot 1: "ICH"
Slot 2, filled black with cream type, the only filled slot: "FAHRE"
Slot 3: "MORGEN"
Slot 4: "NACH BERLIN"
Caption: "THING 1 · VERB · THE REST"

Diagram 2, labelled "02 QUESTION":
Slot 1 filled black: "FÄHRST"
Slot 2: "DU"
Slot 3: "MORGEN"
Caption: "VERB FIRST · THEN THE PERSON"

Diagram 3, labelled "03 WEIL":
A long sentence on one line:
"Ich bleibe hier, weil ich müde bin."
Underline or box the final word "bin" in amber.
Caption: "WEIL / DASS / OB · VERB GOES LAST"

Footer: "A1 · GRUNDLAGEN"

Important details: slots are flat rectangles on the grid, numbered in tabular grotesk. Slot 2 in diagram 1 and slot 1 in diagram 2 are the only solid black fills. One amber circle around "bin" as the single grid-break. No comic strips. No road illustrations.

Use case: printable A2 syntax chart.

Constraints: exact sentences only, no extra clauses, no misspellings of fährst, müde, bleibe, no 3D, no gradients, no speech bubbles, no extra words.
```

---

## 06 — DU / SIE

**One idea:** German has two yous. Using the wrong one is the first social mistake English speakers make.

**Teaches:** du vs Sie; greeting pairs; the *duzen* switch.

**Visual:** the sheet is split vertically. Left warm / informal. Right cold / formal. A small handshake/switch plate at the bottom centre.

### Prompt

```
SERIES LOCK as specified.

Scene: a vertical 4:5 register wall chart, plate 06 of 10.

Subject: a split sheet that teaches the two German words for "you".

Title zone sits on the centre axis, overlapping both halves: "DU / SIE"
Sub-line: "YOU AND YOU"
Chrome: "DEUTSCH · ENGLISCH" and "06 / 10"

Left half, cream with a thin blue #1B4B8A vertical edge:
Giant word: "DU"
Gloss: "INFORMAL"
Stacked short lines, left-aligned:
"FRIENDS"
"FAMILY"
"KIDS"
"PEERS"
"DOGS"
Greeting pair:
"HALLO"
"TSCHÜSS"
Example, medium:
"Kommst du mit?"
Gloss: "ARE YOU COMING?"

Right half, near-black #1A1A1A field with cream type (the one dark panel in the series):
Giant word: "SIE"
Gloss: "FORMAL"
Stacked:
"STRANGERS"
"SHOPS"
"WORK"
"ANYONE OLDER"
"UNTIL INVITED"
Greeting pair:
"GUTEN TAG"
"AUF WIEDERSEHEN"
Example:
"Kommen Sie mit?"
Gloss: "ARE YOU COMING?"

Bottom centre, a small cream plate overlapping both halves, amber rule:
"Wollen wir uns duzen?"
Gloss: "SHALL WE SWITCH TO DU?"

Footer: "A1 · GRUNDLAGEN"

Important details: the split is a hard vertical cut, not a gradient blend. Title straddles the cut. No people, no handshake photo, no suits vs jeans illustration. Geometry only. Paper tooth on the cream half; the black half is flat ink.

Use case: printable A2 social-grammar chart.

Constraints: exact strings only, Sie always capital S in German examples, no extra greetings, no flags, no lederhosen, no 3D, no gradients, no misspellings of Wiedersehen or duzen.
```

---

## 07 — W-FRAGEN

**One idea:** German questions are a wheel of W-words plus verb-second.

**Teaches:** wer, was, wo, wann, warum, wie, wohin, woher, wie viel, welcher; inversion.

**Visual:** a 2-5-3 cluster (not a dead-centre circle). Each W-word is a tile with English under it. One worked question at the bottom.

### Prompt

```
SERIES LOCK as specified.

Scene: a vertical 4:5 question-word wall chart, plate 07 of 10.

Subject: ten W-word tiles plus one worked question.

Title zone, top left: "W-FRAGEN"
Sub-line: "ASKING THINGS"
Chrome: "DEUTSCH · ENGLISCH" and "07 / 10"

A 5-by-2 tile grid, asymmetric, starting left of centre, hairline black rules, cream cells. Each tile has a huge German W-word and a tiny English gloss.

Tile 1: "WER" / "WHO"
Tile 2: "WAS" / "WHAT"
Tile 3: "WO" / "WHERE"
Tile 4: "WANN" / "WHEN"
Tile 5: "WARUM" / "WHY"
Tile 6: "WIE" / "HOW"
Tile 7: "WOHIN" / "WHERE TO"
Tile 8: "WOHER" / "WHERE FROM"
Tile 9: "WIE VIEL" / "HOW MUCH"
Tile 10: "WELCHER" / "WHICH"

Colour: WER blue, WAS red, WO green, WANN amber, the rest black type. No other colours.

Bottom worked example, full width, three slots:
Slot 1 filled black, cream type: "WANN"
Slot 2: "KOMMST"
Slot 3: "DU"
Full line under: "Wann kommst du?"
Caption: "W-WORD · VERB · PERSON"

Footer: "A1 · GRUNDLAGEN"

Important details: tiles are flat, not app-icon rounded cards. One tile (WARUM) is slightly larger and breaks the grid. No question-mark sculpture. No people. Paper tooth only.

Use case: printable A2 question chart.

Constraints: exact W-words only, no extra tiles, no misspellings of warum, wohin, woher, welcher, no 3D, no gradients, no cartoon question marks.
```

---

## 08 — MODAL

**One idea:** a modal is a second engine. It takes slot 2. The real verb waits at the end, naked infinitive.

**Teaches:** können, müssen, wollen, sollen, dürfen, mögen; the double-verb machine; möchten as the polite twin of mögen.

**Visual:** a sentence rail at the top, then a six-tile modal set, then one caution about mögen / möchten.

### Prompt

```
SERIES LOCK as specified.

Scene: a vertical 4:5 modal-verb wall chart, plate 08 of 10.

Subject: a sentence machine plus six modal tiles.

Title zone: "MODAL"
Sub-line: "CAN MUST WANT"
Chrome: "DEUTSCH · ENGLISCH" and "08 / 10"

Top rail, four slots in a row:
Slot 1: "ICH"
Slot 2, solid black, cream type: "KANN"
Slot 3: "DEUTSCH"
Slot 4, amber outline: "SPRECHEN"
Full sentence under the rail:
"Ich kann Deutsch sprechen."
Caption: "PERSON · MODAL · THE REST · VERB AT THE END"

Six tiles in a 3-by-2 grid:

Tile 1, blue: "KÖNNEN" / "CAN"
Tiny form: "ich kann"

Tile 2, red: "MÜSSEN" / "MUST"
Tiny form: "ich muss"

Tile 3, green: "WOLLEN" / "WANT"
Tiny form: "ich will"

Tile 4, black: "SOLLEN" / "SHOULD"
Tiny form: "ich soll"

Tile 5, black: "DÜRFEN" / "MAY"
Tiny form: "ich darf"

Tile 6, amber: "MÖGEN" / "LIKE"
Tiny form: "ich mag"

Bottom caution plate, thin red rule:
"MÖCHTE = I WOULD LIKE"
Second line: "polite twin of mögen"

Footer: "A1 · GRUNDLAGEN"

Important details: tiles are flat ruled panels, not icons. The amber outline on SPRECHEN is the single grid-break. No superhero "power" illustrations. No 3D engines. Paper tooth only.

Use case: printable A2 verb chart.

Constraints: exact verbs only, no extra modals, no past tense, umlauts must be correct on können, müssen, dürfen, mögen, möchte, no 3D, no gradients, no clip art.
```

---

## 09 — TRENNBAR

**One idea:** some German verbs snap in half. The prefix is a delayed explosion at the end of the clause.

**Teaches:** separable prefixes; statement vs infinitive vs *weil*; a core set of daily verbs.

**Visual:** one hero verb torn across the sheet (AN | RUFEN → ich rufe … an). A list of eight verbs as compact pairs.

### Prompt

```
SERIES LOCK as specified.

Scene: a vertical 4:5 separable-verb wall chart, plate 09 of 10.

Subject: one verb that physically splits, then a set of daily splits.

Title zone: "TRENNBAR"
Sub-line: "THE VERB SPLITS"
Chrome: "DEUTSCH · ENGLISCH" and "09 / 10"

Hero band, upper third: the infinitive "ANRUFEN" set huge, with a clean vertical cut between AN and RUFEN. AN is Prussian blue. RUFEN is black. A thin amber lightning-gap between the two halves. Not cartoon, just a gap and a hairline.

Under the hero, the living sentence in three pieces:
"ich"   "rufe"   "……"   "an"
with a long dotted rule where the middle of the sentence goes.
Caption: "PREFIX WAITS AT THE END"

Three small state labels in a row:
"INFINITIVE  aufstehen"
"STATEMENT  ich stehe auf"
"WEIL  weil ich aufstehe"

Lower half, eight compact pairs in two columns, hairline rules:

"anrufen" → "ich rufe an"
"aufstehen" → "ich stehe auf"
"einkaufen" → "ich kaufe ein"
"ausgehen" → "ich gehe aus"
"ankommen" → "ich komme an"
"mitkommen" → "ich komme mit"
"fernsehen" → "ich sehe fern"
"zumachen" → "ich mache zu"

Footer: "A1 · GRUNDLAGEN"

Important details: the cut through ANRUFEN is the only dramatic device. List type is tabular and quiet. No ringing-telephone illustration. No scissors clip-art. Paper tooth, slight letterpress on the hero word only.

Use case: printable A2 verb chart.

Constraints: exact verb pairs only, no extra verbs, no misspellings of fernsehen or aufstehe, no 3D, no gradients, no comic explosion effects, no extra words.
```

---

## 10 — WO / WOHIN

**One idea:** the same preposition changes case when you move. *Wo* sits. *Wohin* goes.

**Teaches:** the nine two-way prepositions; dative = location; accusative = movement.

**Visual:** a plan-view room diagram (not a cute isometric house). Dots for location, arrows for movement. A nine-word strip. Two example sentences.

### Prompt

```
SERIES LOCK as specified.

Scene: a vertical 4:5 two-way-preposition wall chart, plate 10 of 10.

Subject: a room plan that teaches WO versus WOHIN.

Title zone: "WO / WOHIN"
Sub-line: "IN OR INTO"
Chrome: "DEUTSCH · ENGLISCH" and "10 / 10"

Nine-word strip under the title, small condensed caps, letterspaced:
"AN  AUF  HINTER  IN  NEBEN  ÜBER  UNTER  VOR  ZWISCHEN"

Centre: a flat architectural plan of one room, black hairline walls on cream, no furniture drawings except three geometric blocks labelled
"TISCH"
"STUHL"
"TÜR"
A solid red dot labelled "WO" sits on the chair.
A blue arrow labelled "WOHIN" enters through the door toward the table.
This is a diagram, not an illustration. No people. No perspective. Top-down.

Two large example lines under the plan:

Red (dative / location):
"Ich bin in dem Café."
Gloss: "I AM IN THE CAFE"
Tiny label: "WO + DAT"

Blue (accusative / movement):
"Ich gehe in das Café."
Gloss: "I GO INTO THE CAFE"
Tiny label: "WOHIN + AKK"

Bottom key, two chips:
Red chip: "DAT = STAY"
Blue chip: "AKK = MOVE"

Footer: "A1 · GRUNDLAGEN"

Important details: plan is Swiss-diagram clean, like a Müller-Brockmann concert seating chart. One amber north-arrow as the grid-break. No isometric cute room. No coffee-cup drawings. Paper tooth only.

Use case: printable A2 preposition chart.

Constraints: exact sentences only, no extra prepositions, umlauts correct on über, no 3D furniture, no gradients, no cartoon people walking, no misspellings of Café, zwischen, hinter.
```

---

## How to generate the series

1. Paste **Series lock + one poster prompt** into GPT Image 2 first. Judge spelling before you fall in love with the layout.
2. If type is 80% right, use the edit endpoint: "Change only the palette of the M column to #1B4B8A. Keep layout, typography, and composition exactly the same."
3. If a table keeps collapsing, regenerate that poster with **no table text** (ask for empty ruled cells) and set the German in Figma.
4. For a tighter match across all 10, switch to Flux 2 Pro and keep the series lock identical; change only title, plate number, and the subject block.
5. Print test at A2. If a string is under 14pt, it was never going to survive AI type — set it yourself.

### Iterate one slot at a time

If 01 feels too busy: drop the pictograms, keep the three columns.  
If 02's table garbles: generate the flow sentence only, composite the table.  
If 06's black half floods: ask for a 60% black field, not 100%.  
If 10's room goes cute: add "orthographic plan, no isometric, no furniture icons".
