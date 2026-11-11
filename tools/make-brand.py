"""Deriva os assets de marca a partir das fontes em public/brand/.

Fontes (não geradas):
  public/brand/logo.png       símbolo
  public/brand/logo-name.png  lockup empilhado (símbolo sobre a palavra)

Derivados:
  public/brand/logo-name-wide.png  lockup horizontal usado no header e no trilho
  public/brand/logo-icon.png       ícone quadrado com respiro, usado no footer

Uso: python3 tools/make-brand.py   (requer Pillow)
"""

from pathlib import Path

from PIL import Image

BRAND = Path(__file__).resolve().parent.parent / "public" / "brand"
MARK_HEIGHT = 160
WORD_HEIGHT = 62
WORD_GAP = 34
ICON = 512
ICON_MARGIN = 0.08
WORD_BAND_TOP = 308  # início da faixa com o nome dentro de logo-name.png


def load_mark() -> Image.Image:
    mark = Image.open(BRAND / "logo.png").convert("RGBA")
    box = mark.split()[-1].getbbox()
    if box:
        mark = mark.crop(box)
    return mark


def write_icon(mark: Image.Image) -> None:
    side = max(mark.size)
    pad = int(side * ICON_MARGIN)
    canvas = Image.new("RGBA", (side + 2 * pad, side + 2 * pad), (0, 0, 0, 0))
    canvas.paste(mark, ((canvas.width - mark.width) // 2, (canvas.height - mark.height) // 2))
    out = BRAND / "logo-icon.png"
    canvas.resize((ICON, ICON), Image.LANCZOS).save(out)
    print("ícone:", out)


def load_word() -> Image.Image:
    lock = Image.open(BRAND / "logo-name.png").convert("RGBA")
    band = lock.crop((0, WORD_BAND_TOP, lock.width, lock.height))
    box = band.split()[-1].getbbox()
    if not box:
        raise SystemExit("faixa do nome vazia em logo-name.png")
    return band.crop(box)


def write_lockup(mark: Image.Image, word: Image.Image) -> None:
    symbol = mark.resize((MARK_HEIGHT, MARK_HEIGHT), Image.LANCZOS)
    width = round(word.width * WORD_HEIGHT / word.height)
    label = word.resize((width, WORD_HEIGHT), Image.LANCZOS)

    out = Image.new("RGBA", (MARK_HEIGHT + WORD_GAP + width, MARK_HEIGHT), (0, 0, 0, 0))
    out.paste(symbol, (0, 0), symbol)
    out.paste(label, (MARK_HEIGHT + WORD_GAP, (MARK_HEIGHT - WORD_HEIGHT) // 2), label)

    path = BRAND / "logo-name-wide.png"
    out.save(path)
    print("lockup:", path, out.size)


if __name__ == "__main__":
    mark = load_mark()
    write_icon(mark)
    write_lockup(mark, load_word())
