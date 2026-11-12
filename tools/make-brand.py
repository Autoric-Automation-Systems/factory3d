"""Deriva os assets de marca a partir das fontes em public/brand/.

Fontes (não geradas):
  public/brand/logo.png         símbolo da Fábrica 3D
  public/brand/logo-name.png    lockup empilhado (símbolo sobre a palavra)
  public/brand/dev-logo.png     logo da Autoric, com símbolo, nome e assinatura

Derivados:
  public/brand/logo-name-wide.png  lockup horizontal do app (header, trilho, login)
  public/brand/logo-icon.png       símbolo quadrado com respiro (rodapé, PWA)
  public/brand/dev-mark.png        símbolo + AUTORIC, sem a assinatura miúda

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
WORD_COLOR = (232, 238, 244)  # a interface é escura: o nome precisa de contraste
DEV_HEIGHT = 96


def tight(image: Image.Image) -> Image.Image:
    box = image.split()[-1].getbbox()
    return image.crop(box) if box else image


def load_mark() -> Image.Image:
    return tight(Image.open(BRAND / "logo.png").convert("RGBA"))


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
    word = tight(band)
    if not word.width:
        raise SystemExit("faixa do nome vazia em logo-name.png")
    return word


def tint(image: Image.Image, color: tuple[int, int, int]) -> Image.Image:
    """Silhueta na cor pedida, preservando o antialias do original."""
    solid = Image.new("RGBA", image.size, color + (0,))
    solid.putalpha(image.split()[-1])
    return solid


def write_lockup(mark: Image.Image, word: Image.Image) -> None:
    symbol = mark.resize((MARK_HEIGHT, MARK_HEIGHT), Image.LANCZOS)
    width = round(word.width * WORD_HEIGHT / word.height)
    label = tint(word.resize((width, WORD_HEIGHT), Image.LANCZOS), WORD_COLOR)

    out = Image.new("RGBA", (MARK_HEIGHT + WORD_GAP + width, MARK_HEIGHT), (0, 0, 0, 0))
    out.paste(symbol, (0, 0), symbol)
    out.paste(label, (MARK_HEIGHT + WORD_GAP, (MARK_HEIGHT - WORD_HEIGHT) // 2), label)

    path = BRAND / "logo-name-wide.png"
    out.save(path)
    print("lockup:", path, out.size)


def write_dev_mark() -> None:
    """Recorta símbolo + AUTORIC do logo da Autoric, descartando a assinatura."""
    full = Image.open(BRAND / "dev-logo.png").convert("RGBA")
    alpha = full.split()[-1]

    # o símbolo é mais alto que as letras, então a assinatura é detectada só na
    # coluna à direita dele, onde as linhas de texto ficam separadas por respiro
    columns = [
        x
        for x in range(full.width)
        if alpha.crop((x, 0, x + 1, full.height)).getbbox() is not None
    ]
    gap_column = next(
        (x for previous, x in zip(columns, columns[1:]) if x - previous > 12),
        full.width // 3,
    )
    text = alpha.crop((gap_column, 0, full.width, full.height))
    filled = [
        y for y in range(text.height) if text.crop((0, y, text.width, y + 1)).getbbox() is not None
    ]
    if not filled:
        raise SystemExit("dev-logo.png vazio")

    bottom = filled[-1] + 1
    for previous, current in zip(filled, filled[1:]):
        if current - previous > 12:
            bottom = previous + 1
            break

    mark = tight(full.crop((0, 0, full.width, bottom)))
    width = round(mark.width * DEV_HEIGHT / mark.height)
    path = BRAND / "dev-mark.png"
    mark.resize((width, DEV_HEIGHT), Image.LANCZOS).save(path)
    print("dev:", path, (width, DEV_HEIGHT))


if __name__ == "__main__":
    mark = load_mark()
    write_icon(mark)
    write_lockup(mark, load_word())
    write_dev_mark()
