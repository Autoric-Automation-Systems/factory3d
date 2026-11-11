# Marca da Fábrica 3D

Tudo em `public/` é servido na raiz. A marca tem duas fontes:

```
public/
├── logo.png            símbolo (fonte)
├── logo_name.png       símbolo + nome, empilhados (fonte)
├── hero.jpg            imagem da home
├── favicon.ico         favicon multi-tamanho
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
├── android-chrome-192x192.png
├── android-chrome-512x512.png
└── brand/
    ├── logo/logo.png            símbolo quadrado, com respiro
    └── logo-name/logo-name.png  lockup horizontal (símbolo + palavra)
```

`src/lib/brand.ts` procura nesta ordem: `brand/*.svg`, `brand/*.png` e, por
último, `logo.png` / `logo_name.png`. Se nada existir, a interface cai no texto
`F3` / `Fábrica 3D` — nada quebra.

## Por que existe o lockup horizontal

`logo_name.png` é quadrado, com o símbolo em cima e a palavra embaixo. No
cabeçalho e no trilho lateral o espaço é horizontal, então `brand/logo-name`
guarda uma versão lado a lado gerada a partir das mesmas peças (símbolo de
`logo.png` + faixa da palavra recortada de `logo_name.png`).

Para trocar a marca, substitua `logo.png` e `logo_name.png` e regere o lockup:

```bash
python3 tools/make-brand.py
```

## Ícones

Os `<link rel="icon">`, `apple-touch-icon` e o manifesto são declarados em
`src/app/layout.tsx` (`metadata.icons` e `metadata.manifest`). O
`public/site.webmanifest` aponta para os PNGs acima. Ao trocar o símbolo,
regerencie também `favicon.ico`, `favicon-16`, `favicon-32`, `apple-touch-icon`
e `android-chrome-*` a partir de `logo.png`.

## Preferências

- PNG com fundo transparente; 400 × 400 é suficiente para os dois arquivos.
- Deixe ~6% de respiro nas bordas do símbolo, porque ele é aplicado em um
  quadrado de 28–34 px com canto arredondado.

