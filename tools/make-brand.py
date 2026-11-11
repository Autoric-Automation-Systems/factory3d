"""Deriva os assets de marca a partir de public/logo.png e public/logo_name.png.

O arquivo de origem logo_name.png é um lockup empilhado (símbolo sobre o nome);
o cabeçalho e o trilho lateral precisam de um lockup horizontal, gerado aqui.

Uso: python3 tools/make-brand.py   (requer Pillow)
"""

from pathlib import Path

from PIL import Image

PUBLIC = Path(__file__).resolve().parent.parent / "public"
MARK_HEIGHT = 160
WORD_HEIGHT = 62
WORD_GAP = 34
CANVAS = 256
MARGIN = 0.06
WORD_BAND_TOP = 308  # início da faixa com o nome dentro de logo_name.png


def load_mark() -> Image.Image:
    mark = Image.open(PUBLIC / "logo.png").convert("RGBA")
    box = mark.split()[-1].getbbox()
    if box:
        mark = mark.crop(box)
    return mark


def write_mark(mark: Image.Image) -> None:
    side = max(mark.size)
    pad = int(side * MARGIN)
    canvas = Image.new("RGBA", (side + 2 * pad, side + 2 * pad), (0, 0, 0, 0))
    canvas.paste(mark, ((canvas.width - mark.width) // 2, (canvas.height - mark.height) // 2))
    out = PUBLIC / "brand/logo/logo.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.resize((CANVAS, CANVAS), Image.LANCZOS).save(out)
    print("logo:", out)


def load_word() -> Image.Image:
    lock = Image.open(PUBLIC / "logo_name.png").convert("RGBA")
    band = lock.crop((0, WORD_BAND_TOP, lock.width, lock.height))
    box = band.split()[-1].getbbox()
    if not box:
        raise SystemExit("faixa do nome vazia em logo_name.png")
    return band.crop(box)


def write_lockup(mark: Image.Image, word: Image.Image) -> None:
    symbol = mark.resize((MARK_HEIGHT, MARK_HEIGHT), Image.LANCZOS)
    width = round(word.width * WORD_HEIGHT / word.height)
    label = word.resize((width, WORD_HEIGHT), Image.LANCZOS)

    out = Image.new(
        "RGBA", (MARK_HEIGHT + WORD_GAP + width, MARK_HEIGHT), (0, 0, 0, 0)
    )
    out.paste(symbol, (0, 0), symbol)
    out.paste(label, (MARK_HEIGHT + WORD_GAP, (MARK_HEIGHT - WORD_HEIGHT) // 2), label)

    path = PUBLIC / "brand/logo-name/logo-name.png"
    path.parent.mkdir(parents=True, exist_ok=True)
    out.save(path)
    print("lockup:", path, out.size)


if __name__ == "__main__":
    mark = load_mark()
    write_mark(mark)
    write_lockup(mark, load_word())
