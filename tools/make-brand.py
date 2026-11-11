"""Deriva os assets de marca a partir das fontes em public/brand/.

Fontes (não geradas):
  public/brand/logo.png         símbolo
  public/brand/logo-name.png    lockup empilhado (símbolo sobre a palavra)
  public/brand/logo-lockup.png  lockup horizontal oficial, em alta resolução

Derivados:
  public/brand/logo-name-wide.png  lockup horizontal usado no header e no trilho
  public/brand/logo-icon.png       ícone quadrado com respiro, usado no footer

Uso: python3 tools/make-brand.py   (requer Pillow)
"""

from pathlib import Path

from PIL import Image

BRAND = Path(__file__).resolve().parent.parent / "public" / "brand"
MARK_HEIGHT = 160
LOCKUP_HEIGHT = 160
ICON = 512
ICON_MARGIN = 0.08


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


def write_lockup() -> None:
    lockup = Image.open(BRAND / "logo-lockup.png").convert("RGBA")
    box = lockup.split()[-1].getbbox()
    if box:
        lockup = lockup.crop(box)

    width = round(lockup.width * LOCKUP_HEIGHT / lockup.height)
    path = BRAND / "logo-name-wide.png"
    lockup.resize((width, LOCKUP_HEIGHT), Image.LANCZOS).save(path)
    print("lockup:", path, (width, LOCKUP_HEIGHT))


if __name__ == "__main__":
    mark = load_mark()
    write_icon(mark)
    write_lockup()
