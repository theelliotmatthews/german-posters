#!/usr/bin/env python3
"""Fix the four errors found in the GRUNDLAGEN II / III and WORTSCHATZ II batch."""

import os
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from generate import QUEUE, ROOT, download, fal_request, load_env, poll  # noqa: E402

PLATE_NUMBER_PROMPT = (
    "In the header chrome at the top right of this poster, the plate number "
    "currently reads '01 / 10'. Correct it to read '10 / 10' in exactly the same "
    "font, size, weight and position. "
    "Change nothing else anywhere on the poster: keep every other letter, colour, "
    "pictogram, table row, layout element and texture exactly identical."
)

KONNEKTOREN_PROMPT = (
    "In the section headed with 'VERB TO THE END', one example sentence is wrong: "
    "it currently reads 'Ich bleibe zu Hause, denn ich bin krank krank.'. "
    "Correct that sentence to read 'Ich bleibe zu Hause, weil ich krank bin.' "
    "in the same font, size and position, keeping its English translation line "
    "'I am staying home because I am sick.' beneath it unchanged. "
    "Change nothing else anywhere on the poster: keep every other letter, colour, "
    "pictogram, table row, layout element and texture exactly identical."
)

FIXES = [
    {
        "label": "g2-10 WECHSELPRÄPOSITIONEN plate number",
        "url": "https://v3b.fal.media/files/b/0aa68ca6/bafnA-4710fJcjQ6OcGKe_bZa69xey.png",
        "dest": ROOT / "output-g2" / "10-wechselpraepositionen.png",
        "prompt": PLATE_NUMBER_PROMPT,
    },
    {
        "label": "g3-05 KONNEKTOREN weil sentence",
        "url": "https://v3b.fal.media/files/b/0aa68ca5/Np-k6BAIXhMKSpUoWrgzL_EU8id6mb.png",
        "dest": ROOT / "output-g3" / "05-konnektoren.png",
        "prompt": KONNEKTOREN_PROMPT,
    },
    {
        "label": "g3-10 FALSCHE FREUNDE plate number",
        "url": "https://v3b.fal.media/files/b/0aa68ca6/Mkni26YBTfKXTpef3YQqx_k2DFifGj.png",
        "dest": ROOT / "output-g3" / "10-falsche-freunde.png",
        "prompt": PLATE_NUMBER_PROMPT,
    },
    {
        "label": "vocab2-10 FESTE + WÜNSCHE plate number",
        "url": "https://v3b.fal.media/files/b/0aa68ca6/tLq4LnXrwdPTfbi9Ma0tZ_J8feXhy8.png",
        "dest": ROOT / "output-vocab2" / "10-feste-wuensche.png",
        "prompt": PLATE_NUMBER_PROMPT,
    },
]


def main() -> int:
    load_env()
    key = os.environ["FAL_KEY"]

    jobs = []
    for fix in FIXES:
        result = fal_request(
            f"{QUEUE}/edit",
            key,
            {
                "prompt": fix["prompt"],
                "image_urls": [fix["url"]],
                "image_size": {"width": 1536, "height": 1920},
                "quality": "high",
                "num_images": 1,
                "output_format": "png",
            },
        )
        request_id = result.get("request_id") or result.get("requestId")
        print(f"queued {fix['label']} -> {request_id}", flush=True)
        jobs.append({**fix, "request_id": request_id})
        time.sleep(1)

    for job in jobs:
        final = poll(key, job["request_id"], job["label"])
        url = final["images"][0]["url"]
        print(f"downloading {job['label']}: {url}", flush=True)
        download(url, job["dest"])
        print(f"saved {job['dest']}", flush=True)

    print("All fixes done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
