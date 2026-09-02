#!/usr/bin/env python3
"""Generate transparent, in-world Deutsch Welt sprites through fal.ai."""

from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODEL = "fal-ai/ideogram/v3/generate-transparent"
QUEUE = f"https://queue.fal.run/{MODEL}"
RAW_DIR = ROOT / "output-adventure-zoo/sprites"
PUBLIC_DIR = ROOT / "flashcard-app/public/adventure/zoo/sprites"

STYLE = (
    "strict 16-bit handheld color RPG game sprite, hard pixel edges, limited palette, "
    "compact readable silhouette, one subject centered with generous transparent padding, "
    "transparent background, no ground, no shadow, no text, no border"
)
NEGATIVE = (
    "Pokemon, fantasy monster, scenery, white background, multiple subjects, sprite sheet, "
    "smooth vector, 3D render, painterly illustration, blur"
)

ASSETS = [
    ("player-down", "young explorer, red cap, navy jacket, green trousers, tan backpack, strict front view facing directly down"),
    ("player-up", "young explorer seen from behind, red cap, navy jacket, green trousers, tan backpack, strict back view facing directly up"),
    ("player-right", "young explorer, red cap, navy jacket, green trousers, tan backpack, strict side profile facing directly right"),
    ("keeper", "friendly female zoo keeper NPC facing down, green uniform and ranger hat, 3/4 top-down view"),
    ("lion", "recognizable real adult male lion, full body side view, warm gold and brown palette"),
    ("elephant", "recognizable real African elephant, full body side view, grey palette"),
    ("giraffe", "recognizable real giraffe, full body side view including long neck, gold and brown palette"),
    ("monkey", "recognizable real brown monkey standing, full body side view, curled tail"),
    ("penguin", "recognizable real emperor penguin standing, full body side view, black white yellow palette"),
    ("zebra", "recognizable real zebra, full body side view, bold black and white stripes"),
    ("tiger", "recognizable real tiger, full body side view, orange black cream palette"),
    ("bear", "recognizable real brown bear, full body side view, warm brown palette"),
    ("gorilla", "recognizable real silverback gorilla, full body three-quarter view, charcoal grey palette"),
    ("crocodile", "recognizable real crocodile, full body side view, dark green palette"),
    ("flamingo", "recognizable real pink flamingo standing on one leg, full body side view"),
    ("kangaroo", "recognizable real kangaroo standing, full body side view, warm brown palette"),
    ("rhino", "recognizable real rhinoceros, full body side view with horn, grey palette"),
    ("hippo", "recognizable real hippopotamus, full body side view, purple grey palette"),
    ("seal", "recognizable real grey harbor seal, full body side view"),
    ("owl", "recognizable real brown owl perched upright, full body front three-quarter view"),
    ("polar-bear", "recognizable real polar bear, full body side view, white cream grey palette"),
    ("panda", "recognizable real giant panda, full body side view, black and white palette"),
    ("camel", "recognizable real dromedary camel with one hump, full body side view"),
    ("wolf", "recognizable real grey wolf standing, full body side view"),
    ("fox", "recognizable real red fox with bushy tail, full body side view"),
    ("parrot", "recognizable real scarlet macaw parrot perched upright, full body side view"),
    ("snake", "recognizable real green snake coiled with head raised, full body side view"),
    ("tortoise", "recognizable real land tortoise with domed shell, full body side view"),
]


def load_env() -> None:
    env_path = ROOT / ".env"
    if not env_path.exists():
        return
    for raw_line in env_path.read_text().splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def request(url: str, key: str, payload: dict | None = None) -> dict:
    req = urllib.request.Request(
        url,
        data=None if payload is None else json.dumps(payload).encode(),
        headers={"Authorization": f"Key {key}", "Content-Type": "application/json"},
        method="POST" if payload is not None else "GET",
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as error:
        detail = error.read().decode(errors="replace")
        raise RuntimeError(f"fal HTTP {error.code}: {detail[:800]}") from error


def download(url: str, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url, timeout=120) as response, destination.open("wb") as output:
        output.write(response.read())


def main() -> int:
    load_env()
    key = os.environ.get("FAL_KEY")
    if not key:
        print("FAL_KEY missing from .env", file=sys.stderr)
        return 1

    jobs: list[dict] = []
    for asset_id, subject in ASSETS:
        print(f"Queueing {asset_id}...")
        queued = request(
            QUEUE,
            key,
            {
                "prompt": f"ONE single {subject}, {STYLE}",
                "negative_prompt": NEGATIVE,
                "expand_prompt": False,
                "aspect_ratio": "1:1",
                "rendering_speed": "TURBO",
                "num_images": 1,
            },
        )
        jobs.append({"id": asset_id, **queued})
        time.sleep(0.35)

    manifest = []
    for job in jobs:
        while True:
            status = request(job["status_url"], key)
            state = status.get("status")
            print(f"  {job['id']}: {state}")
            if state == "COMPLETED":
                break
            if state in {"FAILED", "ERROR", "CANCELLED"}:
                raise RuntimeError(f"{job['id']} failed: {status}")
            time.sleep(3)

        result = request(job["response_url"], key)
        image_url = result["images"][0]["url"]
        raw_path = RAW_DIR / f"{job['id']}.png"
        download(image_url, raw_path)
        manifest.append(
            {
                "id": job["id"],
                "model": MODEL,
                "request_id": job["request_id"],
                "url": image_url,
                "raw_file": str(raw_path.relative_to(ROOT)),
            }
        )

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    (RAW_DIR / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n"
    )

    # The post-process deliberately reduces each AI render to a compact palette
    # and hard alpha edge so it behaves like a real in-game sprite.
    from process_adventure_sprites import main as process_sprites

    process_sprites()
    print(f"Generated {len(ASSETS)} sprites in {PUBLIC_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
