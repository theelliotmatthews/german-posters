#!/usr/bin/env python3
"""Register Bausteine Visual posters in the flashcard database."""
from __future__ import annotations

import json
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC_JSON = ROOT / "flashcard-app/src/data/flashcards.json"
PUBLIC_JSON = ROOT / "flashcard-app/public/data/flashcards.json"
SCRIPTS_JSON = ROOT / "scripts/flashcards-data.json"

SERIES_ID = "bausteine-visual"
SERIES_COLOR = "#A63D40"

# visual poster id -> source bausteine poster id (cards copied from source)
VISUAL_POSTERS = [
    {
        "id": "01",
        "title": "OPPOSITE TWINS",
        "english_title": "Opposite twins — learn as pairs",
        "subtitle": "OPPOSITE TWINS — LEARN AS PAIRS",
        "how_it_works": "Each row is a seesaw twin. If you know groß, you already own klein.",
        "image_file": "output-bausteine-visual/01-opposite-twins.png",
        "source_id": "04",
        "plate_number": "01 / 04",
    },
    {
        "id": "02",
        "title": "PHRASE SCENES",
        "english_title": "Useful phrases — say the whole chunk",
        "subtitle": "USEFUL PHRASES — SAY THE WHOLE CHUNK",
        "how_it_works": "Say these whole. Do not rebuild them word by word on the street.",
        "image_file": "output-bausteine-visual/02-phrase-scenes.png",
        "source_id": "02",
        "plate_number": "02 / 04",
    },
    {
        "id": "03",
        "title": "VERB ENGINES",
        "english_title": "Workhorse verbs — the daily engine room",
        "subtitle": "WORKHORSE VERBS — THE DAILY ENGINE ROOM",
        "how_it_works": "Learn the infinitive. * = vowel change. Separable verbs show the prefix splitting off.",
        "image_file": "output-bausteine-visual/03-verb-engines.png",
        "source_id": "03",
        "plate_number": "03 / 04",
    },
    {
        "id": "04",
        "title": "CONNECTOR MAP",
        "english_title": "Connector map — how sentences stick together",
        "subtitle": "CONNECTOR MAP — HOW SENTENCES STICK TOGETHER",
        "how_it_works": "These glue sentences together. Colours show the job. Use the sentence railway for weil, dass, wenn.",
        "image_file": "output-bausteine-visual/04-connector-map.png",
        "source_id": "01",
        "plate_number": "04 / 04",
    },
]


def main() -> None:
    data = json.loads(SRC_JSON.read_text(encoding="utf-8"))
    by_key = {(p["series_id"], p["id"]): p for p in data["posters"]}

    data["series"] = [s for s in data["series"] if s["id"] != SERIES_ID]
    data["posters"] = [p for p in data["posters"] if p["series_id"] != SERIES_ID]
    data["cards"] = [c for c in data["cards"] if c["series_id"] != SERIES_ID]

    new_posters = []
    new_cards = []

    for spec in VISUAL_POSTERS:
        source = by_key.get(("bausteine", spec["source_id"]))
        if not source:
            raise SystemExit(f"Missing bausteine poster {spec['source_id']}")

        poster_cards = []
        for i, raw in enumerate(source["cards"], start=1):
            card = deepcopy(raw)
            card["id"] = f"{SERIES_ID}-{spec['id']}-{i:03d}"
            card["series_id"] = SERIES_ID
            card["poster_id"] = spec["id"]
            card["poster_title"] = spec["title"]
            card["poster_title_en"] = spec["english_title"]
            poster_cards.append(card)
            new_cards.append(card)

        manifest_url = None
        manifest_path = ROOT / "output-bausteine-visual/manifest.json"
        if manifest_path.exists():
            manifest = json.loads(manifest_path.read_text())
            entry = next((m for m in manifest if m["id"] == spec["id"]), None)
            if entry:
                manifest_url = entry.get("url")

        poster = {
            "id": spec["id"],
            "plate_number": spec["plate_number"],
            "title": spec["title"],
            "english_title": spec["english_title"],
            "subtitle": spec["subtitle"],
            "how_it_works": spec["how_it_works"],
            "image_file": spec["image_file"],
            "image_url": manifest_url,
            "series_id": SERIES_ID,
            "series_name": "Bausteine Visual",
            "series_english_name": "Building Blocks Visual",
            "series_level": "A1",
            "series_badge": "A1 · BAUSTEINE VISUAL",
            "series_color": SERIES_COLOR,
            "paired_series_id": "bausteine",
            "paired_poster_id": spec["source_id"],
            "card_count": len(poster_cards),
            "cards": poster_cards,
        }
        new_posters.append(poster)

        text_poster = by_key.get(("bausteine", spec["source_id"]))
        if text_poster:
            text_poster["paired_series_id"] = SERIES_ID
            text_poster["paired_poster_id"] = spec["id"]

    series_meta = {
        "id": SERIES_ID,
        "name": "Bausteine Visual",
        "english_name": "Building Blocks Visual",
        "level": "A1",
        "badge": "A1 · BAUSTEINE VISUAL",
        "concepts_file": "poster-concepts-bausteine-visual.md",
        "output_dir": "output-bausteine-visual",
        "color": SERIES_COLOR,
        "description": "Pictogram companion charts for Bausteine: opposite twins, phrase scenes, verb engines, connector map",
        "poster_count": len(new_posters),
        "card_count": len(new_cards),
    }

    data["series"].append(series_meta)
    data["posters"].extend(new_posters)
    data["cards"].extend(new_cards)

    for p in data["posters"]:
        if p["series_id"] == "bausteine" and "paired_series_id" not in p:
            # ensure unmapped bausteine posters still work
            pass

    data["stats"] = {
        "total_series": len(data["series"]),
        "total_posters": len(data["posters"]),
        "total_cards": len(data["cards"]),
        "levels": data["stats"].get("levels", ["A1", "A2"]),
    }
    data["generated_at"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    text = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    SRC_JSON.write_text(text, encoding="utf-8")
    PUBLIC_JSON.write_text(text, encoding="utf-8")
    SCRIPTS_JSON.write_text(text, encoding="utf-8")
    print(
        f"Added {SERIES_ID}: {len(new_posters)} posters, {len(new_cards)} cards "
        f"(total {data['stats']['total_posters']} posters, {data['stats']['total_cards']} cards)"
    )


if __name__ == "__main__":
    main()
