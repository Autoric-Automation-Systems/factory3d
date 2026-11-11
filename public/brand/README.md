# Marca da Fábrica 3D

Pasta pública: tudo aqui é servido em `/brand/...`. Basta soltar os arquivos com os
nomes abaixo — nenhum código precisa mudar.

```
public/brand/
├── icons/         ícones do app / favicon (quadrados)
├── logo/          símbolo, sem o nome (quadrado, fundo transparente)
└── logo-name/     símbolo + nome (horizontal, fundo transparente)
```

## Nomes esperados

| Arquivo                              | Uso                                        | Tamanho sugerido |
| ------------------------------------ | ------------------------------------------ | ---------------- |
| `icons/favicon.svg`                   | aba do navegador                           | 64 × 64 (viewBox) |
| `icons/icon-192.png`                  | atalho em Android / PWA                    | 192 × 192        |
| `icons/icon-512.png`                  | splash / loja de apps                      | 512 × 512        |
| `icons/apple-touch-icon.png`          | atalho em iOS                              | 180 × 180        |
| `logo/logo.svg`                      | marca no trilho e no cabeçalho             | 1:1              |
| `logo-name/logo-name.svg`            | marca com nome (trilho expandido)          | ~3:1             |

Se um arquivo não existir, a interface cai automaticamente no texto `F3` /
`Fábrica 3D` — nada quebra enquanto os arquivos não chegam.

## Preferências

- SVG quando possível; PNG com fundo transparente quando não.
- Deixe ~8% de respiro nas bordas do `logo`, porque ele é aplicado em um quadrado
  de 34 px e o canto arredondado recorta a imagem.
- Use a mesma cor de acento do app (`#ffc53d`) para manter a leitura do tema escuro.
