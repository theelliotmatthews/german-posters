#!/usr/bin/env python3
"""
Comprehensive flashcard and knowledge extractor for German Posters.
Parses all poster concept markdown files and output manifests.
Synchronizes data and images directly into the flashcard web app.
Automatically invoked whenever a new poster is generated!
"""

import json
import os
import re
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Series configurations mapping concept files to output directories
SERIES_CONFIG = [
    {
        "id": "grundlagen-1",
        "name": "Grundlagen I",
        "level": "A1",
        "badge": "A1 · GRUNDLAGEN",
        "concepts_file": "poster-concepts-v3.md",
        "output_dir": "output-v3",
        "color": "#1B4B8A",
        "description": "Core A1 Foundations: Gender, 4 Cases, Negation, Sein/Haben, Word Order, Du/Sie, W-Questions, Modals, Separables, Wo/Wohin",
    },
    {
        "id": "wortschatz-1",
        "name": "Wortschatz I",
        "level": "A1",
        "badge": "A1 · WORTSCHATZ",
        "concepts_file": "poster-concepts-vocab.md",
        "output_dir": "output-vocab",
        "color": "#2D6A4F",
        "description": "Essential A1 Vocabulary: Food, Restaurants, Colours, Body, Home, Dates & Times, Numbers, Seasons, Clothes, Travel",
    },
    {
        "id": "grundlagen-2",
        "name": "Grundlagen II",
        "level": "A1",
        "badge": "A1 · GRUNDLAGEN II",
        "concepts_file": "poster-concepts-g2.md",
        "output_dir": "output-g2",
        "color": "#C9A227",
        "description": "Expanded A1 Grammar: Accusative, Modals In Depth, Separable Verbs, Perfect Tense, Possessives, Pronouns, Word Order, Dative, Two-Way Prepositions",
    },
    {
        "id": "grundlagen-3",
        "name": "Grundlagen III",
        "level": "A2",
        "badge": "A2 · GRUNDLAGEN III",
        "concepts_file": "poster-concepts-g3.md",
        "output_dir": "output-g3",
        "color": "#C41E3A",
        "description": "A2 Grammar & Fluency: Imperative, Comparatives, Adjective Endings, War & Hatte, Connectors, Es gibt / Man, Feelings, Daily Routine, Politeness, False Friends",
    },
    {
        "id": "wortschatz-2",
        "name": "Wortschatz II",
        "level": "A1/A2",
        "badge": "A1 · WORTSCHATZ II",
        "concepts_file": "poster-concepts-vocab2.md",
        "output_dir": "output-vocab2",
        "color": "#6B4C9A",
        "description": "Situational Vocabulary: Family, Shopping, Work & Jobs, Directions, At The Doctor, Hobbies, Phone & Internet, Money & Bureaucracy, Animals & Nature, Celebrations",
    },
    {
        "id": "bausteine",
        "name": "Bausteine",
        "level": "A1",
        "badge": "A1 · BAUSTEINE",
        "concepts_file": "poster-concepts-bausteine.md",
        "concepts_files": [
            "poster-concepts-bausteine.md",
            "poster-concepts-bausteine-2.md",
        ],
        "output_dir": "output-bausteine",
        "color": "#8B1E1E",
        "description": "Sentence glue: small words, survival phrases, workhorse verbs, useful opposites",
    },
    {
        "id": "gender-worlds",
        "name": "Gender Worlds",
        "level": "A1",
        "badge": "A1 · GENDER WORLDS",
        "concepts_file": "poster-concepts-gender-worlds.md",
        "concepts_files": [
            "poster-concepts-gender-worlds.md",
            "poster-concepts-gender-worlds-2.md",
        ],
        "output_dir": "output-gender-worlds",
        "color": "#C41E7A",
        "description": "Gender as colour: pink DIE, blue DER, green DAS — food, appliances, vehicles, household, sports",
    },
]


def clean_text(t: str) -> str:
    return t.strip().strip('"').strip("'").strip()


def detect_gender(german: str) -> str | None:
    words = german.strip().split()
    if not words:
        return None
    first = words[0].lower()
    if first in ("der", "den", "dem", "des", "ein", "einen", "einem"):
        if first == "der" or first == "den":
            return "masculine"
        if first == "ein" and not any(w in german.lower() for w in ("eine", "keine", "das", "die")):
            return "masculine"
    if first in ("die", "eine", "einer", "keine"):
        return "feminine"
    if first in ("das", "ein", "kein"):
        if first == "das":
            return "neuter"
    if german.lower().startswith("der "):
        return "masculine"
    if german.lower().startswith("die "):
        return "feminine"
    if german.lower().startswith("das "):
        return "neuter"
    return None


def extract_cards_from_prompt(
    poster_id: str,
    poster_title: str,
    poster_subtitle: str,
    how_it_works: str,
    prompt_text: str,
    series_id: str,
) -> list[dict]:
    cards = []
    card_index = 1
    seen_pairs = set()

    def make_card(
        german: str,
        english: str,
        card_type: str,
        section: str = "General",
        hint: str = "",
        extra: str = "",
        pictogram: str = "",
        gender: str | None = None,
        rule: str = "",
    ):
        nonlocal card_index
        german = clean_text(german)
        english = clean_text(english)
        if not german or not english:
            return None

        # Filter out meta descriptions or non-content lines
        if any(bad in german.lower() for bad in [
            "series lock", "scene:", "title block", "how it works", "zone ", "column ",
            "constraints", "footer:", "main zone", "endings strip", "four case panels",
            "table rules", "paper:", "type system:", "colour grammar", "ground:", "ink /",
            "with sub", "sub-line", "subline", "plate number", "plate 0", "plate 1",
            "belongs to the word", "predict hundreds", "do not translate", "memorise each line",
            "title zone", "section bar", "exact text", "how it works", "series lock",
        ]):
            return None

        # Filter out long paragraphs or prompt prose
        if len(german) > 100 or len(english) > 100:
            return None

        # Filter out column header lines like "DER — MASCULINE"
        if german.lower() in ("der", "die", "das") and english.lower() in ("masculine", "feminine", "neuter"):
            return None

        # Filter out meta descriptions from english as well
        if any(bad in english.lower() for bad in [
            "sub-line", "subline", "series lock", "scene:", "title block", "constraints"
        ]):
            return None

        pair_key = (german.lower(), english.lower())
        if pair_key in seen_pairs:
            return None
        seen_pairs.add(pair_key)

        g = gender or detect_gender(german)
        cid = f"{series_id}-{poster_id}-{card_index:03d}"
        card_index += 1

        # Classify card type
        ctype = card_type
        if ctype == "unknown":
            is_noun = any(german.lower().startswith(art) for art in ("der ", "die ", "das ", "ein ", "eine ", "kein ", "keine "))
            is_sentence = any(p in german for p in (".", "?", "!")) or len(german.split()) >= 4
            is_verb_conj = any(german.lower().startswith(p) for p in ("ich ", "du ", "er/", "sie/", "wir ", "ihr ", "sie/sie ", "er/sie/es "))
            if "false friend" in poster_title.lower() or "falsche freunde" in poster_title.lower():
                ctype = "false_friend"
            elif is_noun and not is_sentence:
                ctype = "noun"
            elif is_verb_conj:
                ctype = "verb"
            elif english.lower().startswith("to ") and len(german.split()) <= 3:
                ctype = "verb"
            elif any(k in poster_title.lower() for k in ("verb", "verben", "workhorse")) and len(german.split()) <= 3:
                ctype = "verb"
            elif is_sentence:
                ctype = "sentence"
            else:
                ctype = "phrase"

        return {
            "id": cid,
            "german": german,
            "english": english,
            "type": ctype,
            "gender": g,
            "section": section,
            "hint": hint,
            "extra": extra,
            "pictogram": pictogram,
            "rule": rule or how_it_works,
            "poster_id": poster_id,
            "poster_title": poster_title,
            "series_id": series_id,
        }

    lines = prompt_text.splitlines()
    current_section = "Main"

    for line in lines:
        line_s = line.strip()
        if not line_s:
            continue

        # Skip prompt meta lines
        if any(line_s.lower().startswith(prefix) for prefix in (
            "title block:", "title zone", "how it works", "scene:", "footer:", "series lock",
            "constraints:", "format:", "style:", "paper:", "type system:", "colour grammar:",
            "accent covers", "every sheet must contain", "sub-line", "tiny top",
            "use case:", "exact text",
        )):
            continue

        # Check for section headers
        sec_bar = re.match(r'^Section bar\s+"([^"]+)"', line_s, re.IGNORECASE)
        if sec_bar:
            current_section = sec_bar.group(1).strip()
            continue

        sec_match = re.match(
            r'^(?:Zone \d+|Column \d+|Section \d+|Panel [A-Z0-9]+|\d+)\s*(?:header|[,:]|-)?\s*["\']?([^"\':]+)["\']?',
            line_s,
            re.IGNORECASE,
        )
        if sec_match and any(k in line_s.lower() for k in ("header", "column", "zone", "panel")):
            current_section = sec_match.group(1).strip()
            continue

        # "German" "English" quote pairs (Bausteine + Gender Worlds)
        pair_match = re.match(
            r'^["\']([^"\']+)["\']\s+["\']([^"\']+)["\']',
            line_s,
        )
        if pair_match:
            ger = re.sub(r"\s*\*\s*$", "", pair_match.group(1).strip()).strip()
            eng = pair_match.group(2).strip()
            if " — " in ger and " — " in eng:
                gparts = [p.strip() for p in ger.split(" — ")]
                eparts = [p.strip() for p in eng.split(" — ")]
                if len(gparts) == 2 and len(eparts) == 2:
                    for gpart, epart in zip(gparts, eparts):
                        c = make_card(gpart, epart, "unknown", section=current_section)
                        if c:
                            cards.append(c)
                    continue
            c = make_card(ger, eng, "unknown", section=current_section)
            if c:
                cards.append(c)
            continue

        # Check for tag "CATEGORY": "German — English"
        tag_match = re.match(r'^tag\s*["\']([^"\']+)["\']\s*:\s*["\']?([^—\-–]+)\s*[—\-–]\s*([^"\']+)["\']?', line_s)
        if tag_match:
            tag_name = tag_match.group(1).strip()
            ger = tag_match.group(2).strip()
            eng = tag_match.group(3).strip()
            c = make_card(ger, eng, "unknown", section=f"{current_section} ({tag_name})", hint=tag_name)
            if c:
                cards.append(c)
            continue

        # Check for (pictogram) "German — English"
        pic_noun_match = re.match(r'^\(([^)]+)\)\s*["\']?(.+?)\s+(?:—|–|-)\s+([^"\']+)["\']?', line_s)
        if pic_noun_match:
            pic = pic_noun_match.group(1).strip()
            ger = pic_noun_match.group(2).strip()
            eng = pic_noun_match.group(3).strip()
            c = make_card(
                ger,
                eng,
                "unknown",
                section=current_section,
                pictogram=pic,
            )
            if c:
                cards.append(c)
            continue

        # Check for "German — English" (pictogram)
        quote_pic_match = re.match(r'^["\']([^—\-–"\'\n]+)\s*[—\-–]\s*([^—\-–"\'\n]+)["\']\s*(?:\(([^)]+)\))?', line_s)
        if quote_pic_match:
            ger = quote_pic_match.group(1).strip()
            eng = quote_pic_match.group(2).strip()
            pic = (quote_pic_match.group(3) or "").strip()
            c = make_card(
                ger,
                eng,
                "unknown",
                section=current_section,
                pictogram=pic,
            )
            if c:
                cards.append(c)
            continue

        # Check for inline quotes with em-dash: "German — English"
        quotes = re.findall(r'["\']([^"\'\n]{2,80}?)\s*[—\-–]\s*([^"\'\n]{2,80}?)["\']', line_s)
        for ger, eng in quotes:
            c = make_card(ger, eng, "unknown", section=current_section)
            if c:
                cards.append(c)

    return cards


def parse_concept_file(
    concepts_path: Path,
    series_conf: dict,
    manifest_map: dict,
    out_dir: Path,
) -> list[dict]:
    if not concepts_path.exists():
        print(f"Warning: {concepts_path} does not exist", file=sys.stderr)
        return []

    text = concepts_path.read_text()
    fences = re.findall(r"```\n(.*?)```", text, flags=re.S)
    headings = re.findall(r"^## (\d{2}) — (.+)$", text, flags=re.M)
    prompt_fences = fences[1:] if len(fences) > len(headings) else fences

    posters = []
    for idx, (num, heading_title) in enumerate(headings):
        prompt_body = prompt_fences[idx].strip() if idx < len(prompt_fences) else ""

        title_match = re.search(
            r'Title block:\s*["\']([^"\']+)["\'](?:\s+with sub-line\s+["\']([^"\']+)["\'])?',
            prompt_body,
        )
        title_zone = re.search(r'Title zone[^\n]*:\s*["\']([^"\']+)["\']', prompt_body, re.I)
        sub_line = re.search(r'Sub-line(?: under title)?:\s*["\']([^"\']+)["\']', prompt_body, re.I)

        if title_match:
            title = title_match.group(1).strip()
            subtitle = title_match.group(2).strip() if title_match.group(2) else ""
        else:
            title = heading_title
            subtitle = sub_line.group(1).strip() if sub_line else (
                title_zone.group(1).strip() if title_zone else ""
            )

        hiw_match = re.search(r'HOW IT WORKS[^:]*:\s*["\']([^"\']+)["\']', prompt_body, re.I | re.S)
        how_it_works = hiw_match.group(1).strip().replace("\n", " ") if hiw_match else ""

        manifest_entry = manifest_map.get(num, {})
        matches = list(out_dir.glob(f"{num}-*.png"))
        img_file = manifest_entry.get("file") or (
            f"{series_conf['output_dir']}/{matches[0].name}" if matches
            else f"{series_conf['output_dir']}/{num}.png"
        )
        img_url = manifest_entry.get("url")

        cards = extract_cards_from_prompt(
            poster_id=num,
            poster_title=title,
            poster_subtitle=subtitle,
            how_it_works=how_it_works,
            prompt_text=prompt_body,
            series_id=series_conf["id"],
        )

        posters.append({
            "id": num,
            "plate_number": f"{num} / 00",
            "title": title,
            "subtitle": subtitle,
            "how_it_works": how_it_works,
            "image_file": img_file,
            "image_url": img_url,
            "series_id": series_conf["id"],
            "series_name": series_conf["name"],
            "series_level": series_conf["level"],
            "series_badge": series_conf["badge"],
            "series_color": series_conf["color"],
            "card_count": len(cards),
            "cards": cards,
        })

    return posters


def parse_series(series_conf: dict) -> dict:
    out_dir = ROOT / series_conf["output_dir"]
    manifest_path = out_dir / "manifest.json"

    manifest_map = {}
    if manifest_path.exists():
        try:
            mdata = json.loads(manifest_path.read_text())
            for item in mdata:
                manifest_map[item["id"]] = item
        except Exception as e:
            print(f"Error reading manifest {manifest_path}: {e}", file=sys.stderr)

    concept_files = series_conf.get("concepts_files") or [series_conf["concepts_file"]]
    posters: list[dict] = []
    for cf in concept_files:
        posters.extend(parse_concept_file(ROOT / cf, series_conf, manifest_map, out_dir))

    total = len(posters)
    total_cards = 0
    for poster in posters:
        poster["plate_number"] = f"{poster['id']} / {total:02d}"
        total_cards += poster["card_count"]

    saved_conf = {k: v for k, v in series_conf.items() if k != "concepts_files"}
    if len(concept_files) > 1:
        saved_conf["concepts_file"] = ", ".join(concept_files)

    return {
        "series": {
            **saved_conf,
            "poster_count": total,
            "card_count": total_cards,
        },
        "posters": posters,
    }


def sync_poster_images():
    """Copy generated poster images into flashcard-app/public/posters/ as real files (Vercel cannot follow outside symlinks)."""
    pub_posters = ROOT / "flashcard-app" / "public" / "posters"
    pub_posters.mkdir(parents=True, exist_ok=True)

    synced_count = 0
    for conf in SERIES_CONFIG:
        src_dir = ROOT / conf["output_dir"]
        if not src_dir.exists():
            continue
        dst_dir = pub_posters / conf["output_dir"]
        dst_dir.mkdir(parents=True, exist_ok=True)

        for img in src_dir.glob("*.png"):
            dst = dst_dir / img.name
            if dst.is_symlink() or dst.exists():
                dst.unlink()
            shutil.copy2(img, dst)
            synced_count += 1

    return synced_count


def main() -> int:
    all_series = []
    all_posters = []
    all_cards = []

    for conf in SERIES_CONFIG:
        res = parse_series(conf)
        all_series.append(res["series"])
        for p in res["posters"]:
            all_posters.append(p)
            all_cards.extend(p["cards"])

    database = {
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "stats": {
            "total_series": len(all_series),
            "total_posters": len(all_posters),
            "total_cards": len(all_cards),
            "levels": ["A1", "A2"],
        },
        "series": all_series,
        "posters": all_posters,
        "cards": all_cards,
    }

    # Save to src/data and public/data for web app
    paths = [
        ROOT / "flashcard-app" / "src" / "data" / "flashcards.json",
        ROOT / "flashcard-app" / "public" / "data" / "flashcards.json",
        ROOT / "scripts" / "flashcards-data.json",
    ]

    for p in paths:
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(json.dumps(database, indent=2, ensure_ascii=False) + "\n")
        print(f"Saved {len(all_cards)} cards across {len(all_posters)} posters -> {p}")

    # Mirror images into web app public directory
    synced_images = sync_poster_images()
    print(f"Synced poster assets into flashcard-app/public/posters/ (updated {synced_images} images)")

    print("\nBreakdown by Series:")
    for s in all_series:
        print(f"  {s['name']} ({s['level']}): {s['poster_count']} posters, {s['card_count']} cards")

    print(f"\nTotal extracted: {len(all_cards)} cards across {len(all_posters)} posters.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
