# Estado do MVP

Documento de acompanhamento entre a visão (`visao-produto-fabrica-3d.md`) e o
que está implementado no código. Atualizar a cada entrega.

## Entregue nesta versão

| Área | Estado | Observação |
| --- | --- | --- |
| Mundo 3D navegável | pronto | Galpão 66×26 m, 8 máquinas procedurais, esteira animada, etiquetas 3D |
| Primeira pessoa | pronto | Desktop (mouse + WASD) e celular (joystick + arrastar) |
| Tour interativo | pronto | Painel por estação com 4 blocos de conteúdo, segurança e falhas |
| Visto por item | pronto | Botão explícito por bloco, com marcação no painel e no mundo |
| Progresso por usuário | pronto | 10% abrir + 70% blocos + 20% quiz |
| Troféus | pronto | Bronze/Prata/Ouro por módulo + percentual geral |
| Favoritos | pronto | Marcação na estação e página dedicada |
| Quiz | pronto | 3 questões por estação, correção imediata, melhor nota salva |
| Login | parcial | Código pronto para Google; falta criar credenciais OAuth |
| Plano gratuito com anúncios | pronto | Blocos de anúncio no hub, módulo, landing e painel da estação |
| Persistência | pronta | Postgres (Neon) em produção, JSON em local, selecionado por `DATABASE_URL` |
| Vídeos | preparado | Campo `videoUrl` por estação; hoje a "animação" é a própria cena 3D |
| Marca | pronto | Logo e nome em `public/brand` (derivados de `logo.png` / `logo_name.png`), usados no cabeçalho, no trilho e no login |
| Ícones | pronto | `favicon.ico`, PNGs 16/32/192/512, apple-touch e `site.webmanifest` declarados em `metadata` |
| Home | pronto | Imagem `hero.jpg` no topo, atrás de véu de contraste |

## Decisões de projeto

1. **Máquinas procedurais em vez de modelos comprados.** Reduz peso, permite
   animar partes (carrossel, pórtico) e mantém o repositório leve. O custo é um
   visual estilizado, não fotorrealista.
2. **Um galpão por linha.** O jogador não "teleporta" entre fábricas: cada
   módulo é uma navegação em primeira pessoa. Mantém a metáfora de caminhar.
3. **Visto explícito.** Ler um bloco não conta sozinho; a pessoa clica em
   "Marcar como visto". Evita progresso acidental e dá ritmo ao estudo.
4. **Quiz obrigatório só para Ouro.** Bronze e Prata são alcançáveis só com
   leitura, para não travar quem está explorando.
5. **Anúncio fora da cena.** Nada de banner sobre a máquina: o anúncio aparece
   no painel e nas telas de apoio, preservando a imersão.

## Decisões de negócio (2026-11)

| Tema | Decisão |
| --- | --- |
| Demonstração | 3D por enquanto; vídeo real fica para depois |
| Deploy | Vercel conectada ao GitHub desde o início |
| Certificado | Incluído no Individual e no Escola; turmas entram com o Escola |
| Próxima linha | Automotivo |
| Preço | Individual R$ 29/mês; Escola R$ 99/mês a partir de 10 vagas rotativas, 1 mapa por vaga |
| Modo prática | Adiado |

## Lacunas conhecidas

- Credenciais Google não configuradas neste ambiente (login de demonstração).
- Cobrança não implementada; a página de planos é informativa.
- Só a linha de água está publicada; as outras existem como catálogo "em breve".
- Sem testes automatizados; validação foi manual no navegador.
- Sem som, sem narração, sem trilha.
- Acessibilidade do 3D é limitada: quem não joga ainda depende da lista de
  estações (`/modulos/agua`) para chegar ao conteúdo.

## Próximos passos priorizados

1. Publicar na Vercel, conectar o Neon (`DATABASE_URL`) e as credenciais Google.
2. Linha Automotivo: 4 módulos (combustão, elétrico, moto, bicicleta).
3. Painel de turma: vagas rotativas, mapa por aluno, relatório.
4. Checkout (Stripe/Mercado Pago) para Individual e Escola.
5. Vídeos curtos (30–60 s) por estação e preencher `videoUrl`.
6. Modo prática: checklist de partida com validação de ordem.
6. Painel do instrutor: turma, progresso agregado, exportação.
7. Áudio ambiente e feedback sonoro de acerto/erro.
8. Testes: Playwright para o fluxo de tour e unitários para `progress.ts`.
