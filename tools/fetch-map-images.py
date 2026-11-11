"""Baixa as fotos dos cards de mapa do Wikimedia Commons e recorta em 16:9.

Uso: python3 tools/fetch-map-images.py
Requer Pillow. As imagens de origem, licenças e autores ficam em
public/maps/CREDITS.md — mantendo a atribuição ao redistribuir.
"""

import json
from io import BytesIO
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen

from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "public" / "maps"
SIZE = (720, 405)
API = "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&iiurlwidth=1600&titles=File:"
UA = "Factory3D/1.0 (educational; dev@factory3d.app.br)"

SOURCES = [
    {slug: "agua", file: "Kangso Yaksu Mineral Water Bottling Plant (11360507045).jpg"},
    {slug: "refrigerante", file: "Tallulah Coca-Cola Bottling Plant 08.jpg"},
    {slug: "cerveja", file: "Zhaoqing Brewery bottling line 1999.jpg"},
    {slug: "molho-de-tomate", file: "FMIB 45013 Putting Sauce in Cans for Tomato Pack.jpeg"},
    {slug: "azeite", file: "Aceite de Oliva Virgen Extra DOP Priego de Córdoba.jpg"},
    {slug: "carro-combustao", file: "002 Production line - car assembly line in General Motors Manufacturing Poland - Gliwice, Poland.jpg"},
    {slug: "carro-eletrico", file: "18650 and 21700 lithium ion battery cell.jpg"},
    {slug: "moto", file: "Ardilla assembly 50s.JPG"},
    {slug: "bicicleta", file: "1896 Bicycle factory assembly room.png"},
    {slug: "geladeira", file: "French Refrigerator Plant Increases its Productivity - DPLA - 95f3ac5808bd87d40bb4379003218b75.jpg"},
    {slug: "tv", file: "Tv Assembly Line 1.jpg"},
    {slug: "pc", file: "RS 42471-12 PCB 02.jpg"},
    {slug: "notebook", file: "Dulmont Magnum Kookaburra Laptop PCB.jpg"}
]


def fetch(slug: str, filename: str) -> None:
    req = Request(API + quote(filename), headers={"User-Agent": UA})
    with urlopen(req, timeout=60) as response:
        data = json.load(response)
    pages = data["query"]["pages"]
    info = next(iter(pages.values()))["imageinfo"][0]
    with urlopen(Request(info["thumburl"], headers={"User-Agent": UA}), timeout=120) as response:
        raw = response.read()

    image = Image.open(BytesIO(raw)).convert("RGB")
    target = SIZE[0] / SIZE[1]
    width, height = image.size
    if width / height > target:
        new_w = int(height * target)
        image = image.crop(((width - new_w) // 2, 0, (width + new_w) // 2, height))
    else:
        new_h = int(width / target)
        image = image.crop((0, (height - new_h) // 2, width, (height + new_h) // 2))

    image.resize(SIZE, Image.LANCZOS).save(OUT / f"{slug}.jpg", quality=82, optimize=True)
    print(f"{slug}.jpg")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for entry in SOURCES:
        fetch(entry["slug"], entry["file"])
