#!/usr/bin/env python3
"""Retry: fix the weil example in GRUNDLAGEN III plate 05 (KONNEKTOREN)."""

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from generate import QUEUE, ROOT, download, fal_request, load_env, poll  # noqa: E402

SOURCE_URL = "https://v3b.fal.media/files/b/0aa68cd4/ej1uQQi6cMGzC9LlVrVGT_8lp5GaNf.png"
DEST = ROOT / "output-g3" / "05-konnektoren.png"

PROMPT = (
    "In the red panel labelled '1B TRIBE 2 — VERB TO THE END', the first example "
    "sentence is shown as a row of word labels under small pictograms. The words "
    "currently read: 'Ich' 'bleibe' 'zu Hause' ',' 'ich' 'ich' 'krank' 'bin.' — "
    "the word 'ich' appears twice in a row, which is wrong. "
    "Replace the FIRST of the two 'ich' labels (the one immediately after the comma) "
    "with the word 'weil', so the row reads: 'Ich' 'bleibe' 'zu Hause' ',' 'weil' "
    "'ich' 'krank' 'bin.' Keep the same red font, size and chip layout. "
    "Change nothing else anywhere on the poster: keep every other letter, colour, "
    "pictogram, panel, table row, layout element and texture exactly identical."
)


def main() -> int:
    load_env()
    key = os.environ["FAL_KEY"]
    result = fal_request(
        f"{QUEUE}/edit",
        key,
        {
            "prompt": PROMPT,
            "image_urls": [SOURCE_URL],
            "image_size": {"width": 1536, "height": 1920},
            "quality": "high",
            "num_images": 1,
            "output_format": "png",
        },
    )
    request_id = result.get("request_id") or result.get("requestId")
    print(f"edit request {request_id}")
    final = poll(key, request_id, "g3-05 KONNEKTOREN retry")
    url = final["images"][0]["url"]
    print(f"downloading {url}")
    download(url, DEST)
    print(f"saved {DEST}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
