#!/usr/bin/env python3
"""Turn transparent FAL renders into compact, hard-edged game sprites."""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "output-adventure-zoo/sprites"
DEST = ROOT / "flashcard-app/public/adventure/zoo/sprites"


def process(source: Path, destination: Path) -> None:
    image = Image.open(source).convert("RGBA")
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        raise ValueError(f"{source.name} contains no visible pixels")

    cropped = image.crop(bbox)
    max_width = 72
    max_height = 78
    scale = min(max_width / cropped.width, max_height / cropped.height)
    size = (
        max(1, round(cropped.width * scale)),
        max(1, round(cropped.height * scale)),
    )
    small = cropped.resize(size, Image.Resampling.LANCZOS)

    # A restricted palette plus binary-ish alpha makes AI artwork read as a
    # deliberate handheld-game sprite when enlarged with nearest-neighbour.
    quantized = small.quantize(
        colors=24,
        method=Image.Quantize.FASTOCTREE,
        dither=Image.Dither.NONE,
    ).convert("RGBA")
    hard_alpha = small.getchannel("A").point(lambda value: 255 if value >= 72 else 0)
    quantized.putalpha(hard_alpha)

    canvas = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
    x = (96 - quantized.width) // 2
    y = 88 - quantized.height
    canvas.alpha_composite(quantized, (x, y))
    destination.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(destination, optimize=True)


def main() -> None:
    files = sorted(SOURCE.glob("*.png"))
    if not files:
        raise SystemExit(f"No source sprites found in {SOURCE}")
    for source in files:
        destination = DEST / source.name
        process(source, destination)
        print(f"{source.name} -> {destination.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
