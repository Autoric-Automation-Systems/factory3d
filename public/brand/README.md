# Marca da Fábrica 3D

Tudo em `public/` é servido na raiz. Os arquivos ficam separados por tipo:
`brand/` (marca), `icons/` (favicons e PWA) e `maps/` (imagens dos cards de mapa).

```
public/
├── brand/
│   ├── logo.png            símbolo (fonte)
│   ├── logo-name.png       lockup empilhado, símbolo sobre a palavra (fonte)
│   ├── logo-lockup.png     lockup horizontal oficial em alta resolução (fonte)
│   ├── logo-name-wide.png  lockup horizontal, gerado — usado no header, trilho e footer
│   ├── logo-icon.png       ícone quadrado com respiro, gerado — usado no footer
│   └── hero.jpg            imagem de fundo da home
├── icons/
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png
│   ├── android-192.png
│   └── android-512.png
├── maps/                   fotos dos cards de mapa (ver CREDITS.md)
└── site.webmanifest
```

`src/lib/brand.ts` só devolve caminhos que existem de fato (checagem em disco), então
nada quebra se um arquivo for removido: a interface cai no texto `Fábrica 3D`.

## Por que existe o lockup horizontal

`logo-name.png` é quadrado, com o símbolo em cima e a palavra embaixo. No header, no
trilho e no footer o espaço é horizontal, então `brand/logo-name-wide.png` guarda uma
versão lado a lado de 160 px de altura, recortada de `logo-lockup.png`. Como esse
lockup já contém o símbolo, o header não deve renderizar `logo.png` junto — seria um
símbolo duplicado.

Para trocar a marca, substitua `logo.png` (símbolo) e `logo-lockup.png` (lockup
horizontal) e regere os derivados:

```bash
python3 tools/make-brand.py
```

## Ícones

Os `<link rel="icon">`, `apple-touch-icon` e o manifesto são declarados em
`src/app/layout.tsx` (`metadata.icons` e `metadata.manifest`). O manifesto aponta para
`/icons/android-*.png`. Ao trocar o símbolo, regerencie também os arquivos de `icons/`.

## Preferências

- PNG com fundo transparente; 400 × 400 é suficiente para `logo.png` e `logo-name.png`,
  e ~1200 px de largura para `logo-lockup.png`.
- Deixe ~6% de respiro nas bordas do símbolo: ele é aplicado em quadrados de 28–40 px
  com canto arredondado.
