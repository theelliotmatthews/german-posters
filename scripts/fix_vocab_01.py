#!/usr/bin/env python3
"""One-off: fix the 'iiterally' typo on vocab plate 01 via the edit endpoint."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from generate import QUEUE, ROOT, download, fal_request, load_env, poll  # noqa: E402

import os

SOURCE_URL = "https://v3b.fal.media/files/b/0aa68a96/ZlsUA3Ch04H3NgBFkT21w_kcWcxWc5.png"
DEST = ROOT / "output-vocab" / "01-essen.png"

PROMPT = (
    "In the HOW IT WORKS panel at the top right, one word is misspelled: "
    "the text currently reads 'der Apfelsaft is iiterally apple juice'. "
    "Correct the misspelled word 'iiterally' to 'literally' so the line reads "
    "'der Apfelsaft is literally apple juice'. "
    "Change nothing else anywhere on the poster: keep every other letter, colour, "
    "pictogram, table row, layout element and texture exactly identical."
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
    final = poll(key, request_id, "01 ESSEN fix")
    url = final["images"][0]["url"]
    print(f"downloading {url}")
    download(url, DEST)
    print(f"saved {DEST}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
