#!/usr/bin/env python3
"""Generate the GRUNDLAGEN poster series via fal.ai GPT Image 2."""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

MODEL = "openai/gpt-image-2"
QUEUE = f"https://queue.fal.run/{MODEL}"
# 4:5 portrait, multiples of 16, inside fal's pixel budget
IMAGE_SIZE = {"width": 1536, "height": 1920}
QUALITY = "high"


def load_env() -> None:
    env_path = ROOT / ".env"
    if not env_path.exists():
        return
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


UMLAUTS = str.maketrans({"ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss"})


def parse_concepts(concepts_path: Path) -> tuple[str, list[dict]]:
    text = concepts_path.read_text()
    fences = re.findall(r"```\n(.*?)```", text, flags=re.S)
    if not fences:
        raise SystemExit(f"No fenced prompts found in {concepts_path.name}")

    series_lock = fences[0].strip()
    posters: list[dict] = []
    headings = re.findall(r"^## (\d{2}) — (.+)$", text, flags=re.M)
    prompt_fences = fences[1:]
    if len(prompt_fences) != len(headings):
        raise SystemExit(
            f"Mismatch: {len(headings)} headings but {len(prompt_fences)} prompts"
        )

    for (number, title), body in zip(headings, prompt_fences):
        body = body.strip()
        if body.startswith("SERIES LOCK as specified."):
            body = series_lock + "\n\n" + body.split("\n", 1)[1].lstrip()
        slug = re.sub(r"[^a-z0-9]+", "-", title.lower().translate(UMLAUTS)).strip("-")
        posters.append(
            {
                "id": number,
                "title": title,
                "slug": slug,
                "filename": f"{number}-{slug}.png",
                "prompt": body,
            }
        )
    return series_lock, posters


def fal_request(url: str, key: str, payload: dict | None = None) -> dict:
    data = None if payload is None else json.dumps(payload).encode()
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Authorization": f"Key {key}",
            "Content-Type": "application/json",
        },
        method="POST" if payload is not None else "GET",
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode(errors="replace")
        raise RuntimeError(f"fal HTTP {exc.code} on {url}: {detail[:800]}") from exc


def submit(key: str, prompt: str) -> str:
    result = fal_request(
        QUEUE,
        key,
        {
            "prompt": prompt,
            "image_size": IMAGE_SIZE,
            "quality": QUALITY,
            "num_images": 1,
            "output_format": "png",
        },
    )
    request_id = result.get("request_id") or result.get("requestId")
    if not request_id:
        raise RuntimeError(f"No request_id in submit response: {result}")
    return request_id


def poll(key: str, request_id: str, label: str) -> dict:
    status_url = f"{QUEUE}/requests/{request_id}/status"
    result_url = f"{QUEUE}/requests/{request_id}"
    started = time.time()
    while True:
        status = fal_request(status_url, key)
        state = status.get("status") or status.get("state") or "?"
        elapsed = int(time.time() - started)
        print(f"  {label}: {state} ({elapsed}s)", flush=True)
        if state in {"COMPLETED", "OK"}:
            return fal_request(result_url, key)
        if state in {"FAILED", "ERROR", "CANCELLED"}:
            raise RuntimeError(f"{label} failed: {status}")
        if elapsed > 600:
            raise TimeoutError(f"{label} timed out after {elapsed}s")
        time.sleep(8)


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url, timeout=120) as resp, dest.open("wb") as fh:
        fh.write(resp.read())


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--concepts", default="poster-concepts.md")
    parser.add_argument("--outdir", default="output")
    parser.add_argument(
        "--no-sync",
        action="store_true",
        help="Skip auto-running extract_flashcards after generation (use for visual-only posters)",
    )
    parser.add_argument("only", nargs="*", help="poster ids or slugs to generate")
    args = parser.parse_args()

    load_env()
    key = os.environ.get("FAL_KEY")
    if not key:
        print("FAL_KEY missing from environment / .env", file=sys.stderr)
        return 1

    out_dir = ROOT / args.outdir
    meta_path = out_dir / "manifest.json"

    _, posters = parse_concepts(ROOT / args.concepts)
    out_dir.mkdir(parents=True, exist_ok=True)

    if args.only:
        posters = [p for p in posters if p["id"] in args.only or p["slug"] in args.only]
        if not posters:
            print(f"No matching posters for {args.only}", file=sys.stderr)
            return 1

    manifest: list[dict] = []
    if meta_path.exists():
        manifest = json.loads(meta_path.read_text())

    print(f"Generating {len(posters)} posters on {MODEL} at {IMAGE_SIZE['width']}x{IMAGE_SIZE['height']}")

    jobs: list[dict] = []
    for poster in posters:
        print(f"Queueing {poster['id']} {poster['title']}…", flush=True)
        request_id = submit(key, poster["prompt"])
        jobs.append({**poster, "request_id": request_id})
        time.sleep(1)

    for job in jobs:
        label = f"{job['id']} {job['title']}"
        print(f"Waiting on {label} ({job['request_id']})…", flush=True)
        result = poll(key, job["request_id"], label)
        images = result.get("images") or []
        if not images:
            raise RuntimeError(f"No images for {label}: {result}")
        url = images[0]["url"]
        dest = out_dir / job["filename"]
        print(f"  downloading {url} -> {dest.name}", flush=True)
        download(url, dest)
        entry = {
            "id": job["id"],
            "title": job["title"],
            "file": str(dest.relative_to(ROOT)),
            "request_id": job["request_id"],
            "url": url,
            "width": images[0].get("width"),
            "height": images[0].get("height"),
        }
        manifest = [m for m in manifest if m.get("id") != job["id"]] + [entry]
        meta_path.write_text(json.dumps(sorted(manifest, key=lambda m: m["id"]), indent=2))
        print(f"  saved {dest}", flush=True)

    if not args.no_sync:
        try:
            from extract_flashcards import main as sync_flashcards
            print("\nUpdating flashcard web app database with new poster data…")
            sync_flashcards()
        except Exception as e:
            print(f"Note: could not auto-sync flashcard app: {e}", file=sys.stderr)
    else:
        print("\nSkipping flashcard sync (--no-sync).")

    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
