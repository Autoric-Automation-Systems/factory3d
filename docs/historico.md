# Histórico do projeto

Registro do que foi pedido, decidido e entregue, para que o contexto não dependa
de uma sessão do agente. Complementa os outros dois documentos:

| Documento | Responde |
| --- | --- |
| `visao-produto-fabrica-3d.md` | O que o produto quer ser |
| `estado-atual.md` | O que está pronto agora, lacunas e próximos passos |
| `historico.md` (este) | Como chegamos aqui: pedidos, decisões e o que ficou pendente |

Toda a primeira versão nasceu em **11/11/2026**, em uma única sessão de trabalho
(15:59–20:00) interrompida antes do último pacote de ajustes.

## Linha do tempo

| Hora | Pedido | Entrega | Commit |
| --- | --- | --- | --- |
| 15:59 | Conceito do ambiente 3D em primeira pessoa, mapa de fábricas, "visto" por item, % por mapa | Visão de produto + MVP do tour 3D da linha de envase | `f857031` |
| 16:33 | SaaS próprio, free com anúncio, só tour interativo, progresso por usuário, login Google sem cobrança | Persistência e planos definidos | `517cf9c` |
| 17:28 | 3D por enquanto, deploy Vercel já, R$ 29 individual / R$ 99 escola, próxima linha automotivo | Aviso explícito de `AUTH_SECRET` ausente em produção | `8e5ad0f` |
| 18:01 | Erro `no matching decryption secret` no deploy | Persistência em Postgres (Neon) | `ebf56e4` |
| 18:16 | "Ao logar deve parecer jogo": palco vazio, menu lateral que expande, scroll anda, controles flutuando | Hub como lobby de jogo | `cb17332` |
| 19:33 | Faixa atrás dos controles, nome das estações em preto, badges de matéria não clicáveis, placas com nome da estação | Correções de interface | `16fe835` |
| 19:59 | Fonte maior no painel, três estações separadas no envase, "visto" em segurança/falhas, quiz não clica, usar imagens de `/public` | Apenas as imagens entraram | `4291b12` |

A sessão foi **pausada às 20:00**, 40 segundos depois do pedido das 19:59. Por
isso a última linha da tabela está incompleta.

## Decisões fechadas

Registradas aqui para não se perderem entre sessões.

**Produto**

- É uma **plataforma de treinamento técnico com estética de jogo**, não um tour.
  O jogo é a interface; o conteúdo técnico é o que vende.
- Navegação em quatro níveis fixos: **linha → módulo (produto) → estação
  (máquina) → item (visto)**. O jogador anda, não teleporta entre fábricas.
- Toda estação de toda linha tem os mesmos sete blocos: onde entra no processo,
  como funciona, componentes, ajuste e partida, segurança, falhas comuns, quiz.
- O "visto" é **explícito** (botão), nunca automático por tempo de tela.
- Progresso da estação: 10% abrir + 70% blocos vistos + 20% quiz aprovado.
- Troféus: bronze (todas abertas), prata (todo o conteúdo lido), ouro (quiz
  aprovado em todas). Quiz só é obrigatório para o ouro.
- Anúncio nunca sobre a cena: só no painel e nas telas de apoio.

**Arquitetura**

- Máquinas **procedurais** em vez de modelos comprados: repositório leve, partes
  animáveis (carrossel, pórtico), custo visual estilizado assumido.
- Persistência escolhida em tempo de execução por `src/lib/store.ts`: Postgres
  quando há `DATABASE_URL`/`POSTGRES_URL`, arquivo JSON local caso contrário.
  Em produção sem banco o hub avisa em vez de fingir que salvou.
- `AUTH_SECRET` é obrigatório em produção; o fallback de desenvolvimento não vale
  fora de `npm run dev`, senão as sessões poderiam ser forjadas.

**Negócio**

| Tema | Decisão |
| --- | --- |
| Demonstração | 3D por enquanto; vídeo real fica para depois |
| Deploy | Vercel conectada ao GitHub desde o início |
| Certificado | Incluído no Individual e no Escola |
| Próxima linha | Automotivo |
| Preço | Individual R$ 29/mês; Escola R$ 99/mês a partir de 10 vagas rotativas |
| Vagas | 1 mapa = 1 vaga, com rotatividade por aluno |
| Modo prática | Adiado |

## Pedido das 19:59 — o que ficou pendente

Verificado no código atual, não apenas no transcript.

| Pedido | Estado | Evidência |
| --- | --- | --- |
| Controle de tamanho de fonte no quadro de leitura | **falta** | `StationPanel.tsx` só usa `fontSize` fixo no título (linha 68); não há controle de zoom |
| Separar Empacotamento, Paletização e Envolvimento do Palete | **falta** | `src/content/envase/agua/08-paletizacao.ts` cobre as três etapas como uma estação só, "Embalagem e paletização" |
| Botão de "visto" nos cards de Segurança e Falhas comuns | **falta** | o bloco `<div className="block">` com botão só existe para os blocos de conteúdo; as abas `seguranca` e `falhas` renderizam listas sem botão |
| Respostas do quiz não estão sendo clicadas | **não confirmado** | `quiz-option` tem `onClick` e CSS de estado; a suspeita é captura de evento pela cena 3D por cima do painel, não a lógica |
| Usar as imagens enviadas em `/public` | **feito em 11/11 21:55** | ver "Sessão de 11/11 (noite)" abaixo |

## Sessão de 11/11 (noite) — marca, home, placa e ícones

Quatro correções pedidas depois da primeira entrega.

| Pedido | O que estava errado | Correção |
| --- | --- | --- |
| Logo não aplicado | `brandAssets()` só procurava `/brand/logo/logo.svg` e `/brand/logo-name/logo-name.svg`, que não existiam; o login ainda tinha `F3` fixo no JSX | `brand.ts` cai para `*.png` e depois para `logo.png` / `logo_name.png`; `tools/make-brand.py` gera `brand/logo/logo.png` e o lockup horizontal `brand/logo-name/logo-name.png`; `/entrar` passou a usar `BrandMark`/`BrandName` |
| Hero não usado | `hero.jpg` estava no repositório e nenhuma página o mostrava | `next/image` em `page.tsx` com `fill`, `priority` e véu `.hero-veil` para manter o texto legível |
| Ícone não aparece | Nenhum `<link rel="icon">` era emitido; o manifesto estava com `name` vazio e tema branco | `metadata.icons` + `manifest` em `layout.tsx`, ícones 16/32/192/512/apple no HTML e `site.webmanifest` corrigido |
| Placa longe da máquina | A placa das estações era posicionada em `HALL.signZ` (z = 0), 7 m à frente da máquina, flutuando no meio do corredor | Agora fica a 0,45 m do centro da máquina, pendurada a 4,35 m (acima da parte mais alta, 3,9 m), com cabo até a treliça |

O `logo_name.png` original é um lockup **empilhado** (símbolo sobre o nome) num
quadrado de 400 px. No cabeçalho e no trilho o espaço é horizontal, então o
lockup é derivado — não recriado: símbolo de `logo.png` + faixa do nome recortada
de `logo_name.png`. Regerar com `python3 tools/make-brand.py`.

## O que está entregue

Resumo; o detalhe fica em `estado-atual.md`.

- Mundo 3D navegável: galpão 66×26 m, 8 máquinas procedurais animadas, esteira,
  etiquetas 3D, minimapa.
- Primeira pessoa em desktop (WASD + mouse + scroll para andar) e celular
  (joystick + arrastar).
- Tour interativo com painel por estação, sete blocos, visto por item e quiz.
- Progresso por usuário, troféus por módulo, favoritos e página de conquistas.
- Hub no formato de lobby: palco vazio, trilho lateral expansível, gaveta de
  mapas com percentual por mapa, HUD de teclas.
- Login Google (código pronto) e acesso de demonstração.
- Persistência em Postgres em produção, JSON em local.

## Lacunas conhecidas

- Credenciais Google não configuradas no ambiente de desenvolvimento.
- Cobrança não implementada; `/precos` é informativa.
- Só a linha de água está publicada; as outras existem como catálogo "em breve".
- Sem testes automatizados; validação manual no navegador.
- Sem som, narração ou trilha.
- Acessibilidade do 3D limitada: quem não joga depende da lista de estações.

## Próximos passos

1. Fechar o pacote das 19:59 (tabela acima), começando por fonte ajustável e
   imagens de `/public`.
2. `npm run build` e validação no navegador antes de cada push.
3. Linha Automotivo: 4 módulos (combustão, elétrico, moto, bicicleta).
4. Painel de turma: vagas rotativas, mapa por aluno, relatório.
5. Checkout (Stripe ou Mercado Pago) para Individual e Escola.
6. Vídeos curtos por estação, preenchendo `videoUrl`.

## Como recuperar as sessões anteriores

As conversas do agente vivem no OpenHands Cloud, não no repositório. Cada uma
roda em um sandbox descartável; quando o sandbox é destruído, o transcript
continua legível na nuvem.

| Data | Título | Repositório |
| --- | --- | --- |
| 11/11 15:59 | ✨ Fábrica 3D | este (criou o projeto) |
| 04/11 10:49 | 🔧 Store77 | store77 |
| 03/11 19:42 | ✨ NextGen | nextgen |
| 28/10 18:30 | ✨ Preço a crédito e parcelas no card | store77 |
| 18/10 12:39 | MyPlay — Melhorias estruturais iniciais | myplayapp |
| 18/10 00:20 | Store77 — Configurar pagamento e assinaturas SaaS | store77 |
| 17/10 13:54 | Store77 — Reset de senha e cadastro por email | store77 |

Consultar pelo terminal:

```bash
curl -s -H "Authorization: Bearer $OPENHANDS_API_KEY" \
  "https://app.all-hands.dev/api/v1/app-conversations/search?limit=50" \
  | python3 -c 'import json,sys; [print(i["id"], i["created_at"][:16], i["title"]) for i in json.load(sys.stdin)["items"]]'
```

Baixar o transcript completo de uma delas (zip com `meta.json` e um JSON por
evento):

```bash
curl -s -H "Authorization: Bearer $OPENHANDS_API_KEY" \
  -o conversa.zip \
  "https://app.all-hands.dev/api/v1/app-conversations/<ID>/download"
```
