# Fábrica 3D — Plataforma de Aprendizagem Imersiva

Documento de visão, estrutura e análise da ideia original.
Versão 0.1 — 11/11/2026

---

## 1. Visão em uma frase

Um **campus industrial navegável em primeira pessoa** onde o aluno caminha até a
máquina, entende o princípio de funcionamento, pratica a operação e comprova o
aprendizado — com progresso visível, trilhas por disciplina e troféus por módulo.

Não é um "tour 3D": é um **ambiente de treinamento técnico** com estética de jogo.

---

## 2. Público e proposta de valor

| Público | Dor | O que a plataforma entrega |
|---|---|---|
| Indústria (clientes Autoric) | Onboarding lento, dependência de instrutor, alta rotatividade | Treinamento padronizado, repetível, sem parar a linha |
| Escolas técnicas / SENAI | Falta de bancada e de equipamento real | Visita virtual + prática simulada + relatório de turma |
| Time interno Autoric | Explicar solução comercial sem levar o cliente à fábrica | Demo imersiva e memorável |
| Profissional individual | Curso técnico fragmentado em vídeos | Trilha guiada com progresso e certificado |

**Formato:** web (desktop primeiro), PWA para tablet/quiosque, WebXR como evolução.

---

## 3. Princípios pedagógicos (o que muda em relação à ideia original)

1. **Ver não é aprender.** Cada estação tem 4 camadas: entender, reconhecer,
   praticar e comprovar. O "clique de visto" vira apenas a primeira camada.
2. **Objetivo antes de liberdade.** O aluno sempre tem uma missão ("encontre a
   válvula de bloqueio", "religue a linha na sequência correta"), não só andar.
3. **Microlearning.** Blocos de 3–7 min por estação, com quiz de 1–3 questões.
4. **Reuso de ativos.** Motor, válvula, sensor, esteira e painel são componentes
   compartilhados entre linhas — reduz custo de produção 3D.
5. **Progresso honesto.** Percentual do mapa reflete exploração; troféu de
   especialista exige prática e avaliação.
6. **Acessibilidade desde o início.** Legendas, contraste, opção sem head bob,
   navegação por teclado, modo "sem caminhada" (teleporte).
7. **Simulação não substitui treinamento prático.** Disclaimer e, quando fizer
   sentido, checklist presencial complementar.

---

## 4. Hierarquia do mundo

```
Campus (mapa geral)
└── Linha de produção (ex.: Envase)
    └── Módulo / Produto (ex.: Água mineral)
        └── Estação / Máquina (ex.: Enchimento)
            └── Conteúdo (blocos + quiz + prática)
```

- **Campus:** pátio com prédios/módulos, utilidades (caldeira, ar comprimido,
  ETA), refeitório/vestiário como cenário, sala de aula para o "modo instrutor".
- **Linha:** corredor com fluxo de processo visível (sentido do produto).
- **Módulo:** conjunto de estações daquele produto/processo, com porta de entrada
  e painel de progresso.
- **Estação:** máquina ou célula com painel interativo, hotspots e conteúdo.

**Troféus:** um por módulo (Bronze/Prata/Ouro) e um global ("Fábrica Completa").

---

## 5. Mapa de conteúdo

### 5.1 Envase — bebidas e líquidos

| Produto | Estações principais |
|---|---|
| Água mineral | Captação, filtração, osmose reversa, ozonização/UV, enchimento, capsulagem, rótulo, codificação, embalagem, paletização |
| Refrigerante | Xarope simples/composto, dosagem, carbonatação (chiller + carbonatador), enchimento isobárico, recapagem, rótulo, pack |
| Cerveja | CIP, desaeração, enchimento isobárico/asséptico, coroamento, pasteurização em túnel, rótulo, pack |
| Molho de tomate | Preparo/mistura, pasteurização flash, enchimento hot-fill, resfriamento, rótulo, shrink |
| Azeite | Filtração, enchimento a frio, capsulagem, rótulo, caixa |

Utilidades compartilhadas: **caldeira/vapor, ar comprimido, chiller, CIP, ETE**.

### 5.2 Automotivo

| Produto | Estações principais |
|---|---|
| Carro combustão | Estamparia (prensas), solda robotizada, pintura (e-coat/primer/topcoat), montagem final, teste em rolo, motor (usinagem/montagem/teste) |
| Carro elétrico | Células → pack (stacking, BMS, teste), motor elétrico (estator/rotor/ímãs), inversor, montagem final, teste HV, carregador |
| Moto | Solda de quadro, pintura, montagem de motor, montagem final, teste de rolo |
| Bicicleta | Corte de tubos, solda de quadro, pintura, montagem de rodas, montagem final, ajuste |

### 5.3 Eletrônicos e eletrodomésticos

| Produto | Estações principais |
|---|---|
| Geladeira | Termoformagem de liner, injeção de gabinete, linha de espuma PU, montagem de compressor/condensador, carga de gás, teste de vazamento, teste elétrico |
| TV | SMT da placa principal, montagem de painel/backlight, montagem final, teste de imagem, burn-in |
| PC | SMT de placa-mãe, montagem, teste funcional, burn-in |
| Notebook | SMT, montagem de tela/dobradiças, flash de BIOS, teste, embalagem |

Processos eletrônicos compartilhados: **pick-and-place, forno de refusão, SPI/AOI,
solda wave/THT, ICT/FCT, controle ESD**.

### 5.4 Matérias (eixo transversal)

Automação, Elétrica, Eletrônica, Mecânica, Pneumática, Hidráulica, Operação,
Segurança (LOTO/EPI), Qualidade, Manutenção.

Cada estação é etiquetada com **1–4 disciplinas** e um **nível** (fundamental,
intermediário, avançado). Isso permite:
- filtrar o mapa por matéria;
- montar **trilhas** (ex.: Operador de Envase, Eletricista Industrial, Técnico de
  Automação, Mecânico de Manutenção, Analista de Qualidade);
- relatório de competências por aluno/turma.

---

## 6. Menu do jogador (revisado)

A ideia original mistura produto e disciplina no mesmo nível. Separe em **eixos**:

```
[TAB / M] Menu
├── Continuar                  → última estação
├── Mapa da fábrica            → fast travel para locais desbloqueados
├── Linhas de produção
│   ├── Envase                 → Água, Refrigerante, Cerveja, Molho, Azeite
│   ├── Automotivo             → Carro combustão, Carro elétrico, Moto, Bicicleta
│   └── Eletrônicos            → Geladeira, TV, PC, Notebook
├── Disciplinas                → Automação, Elétrica, Eletrônica, Mecânica,
│                                 Pneumática, Hidráulica, Operação, Segurança,
│                                 Qualidade, Manutenção
├── Trilhas                    → caminhos guiados com pré-requisitos
├── Favoritos                  → estações marcadas pelo aluno
├── Conquistas                 → troféus por módulo + troféu global
└── Perfil                     → % por módulo/disciplina, tempo, certificados
```

**HUD in-game:** minimapa, bússola, prompt de interação (`E — Examinar`), toast de
progresso, indicador de objetivo atual e atalho para o menu.

**Modos de uso:**
- **Explorar** (livre)
- **Aula** (instrutor conduz, projetor, teleporte e pausa)
- **Avaliação** (quiz aleatório, sem dicas, certificado)
- **Quiosque** (tablet na recepção/feira, reinicia ao inativo)

---

## 7. Dinâmica de progresso

### 7.1 Estados de uma estação

| Estado | Critério | Peso no % do módulo |
|---|---|---|
| Não iniciada | — | 0% |
| Visitada | Abriu o painel da estação | 10% |
| Explorada | Concluiu os blocos obrigatórios (funcionamento, componentes, operação, segurança) | 40% |
| Praticada | Concluiu a interação/simulação da estação | 20% |
| Dominada | Acertou ≥ 80% no quiz da estação | 30% |

`% do módulo = Σ(peso da estação × estado) / Σ(pesos)`

O percentual exibido no mapa é o de **exploração** (estações exploradas / total).
O troféu considera profundidade:

| Troféu do módulo | Requisito |
|---|---|
| Bronze | 100% das estações exploradas |
| Prata | 100% exploradas + ≥ 70% praticadas |
| Ouro | 100% dominadas + desafio do módulo aprovado (≥ 70%) |
| Global "Fábrica Completa" | Todos os módulos com ao menos Bronze + desafio integrado final |

### 7.2 Desafio do módulo

Cenário de 5–10 min com falha ou meta de produção. Ex.: "a linha parou no
enchimento — identifique a causa entre 3 hipóteses usando o painel e os
instrumentos". Isso transforma conhecimento passivo em diagnóstico.

### 7.3 Anti-frustração e anti-cola

- "Continuar de onde parei" e teleporte.
- Repetição ilimitada do quiz; nota usa a melhor tentativa.
- Progresso calculado no servidor a partir de eventos, não no cliente.
- Tempo mínimo de permanência por bloco (ex.: 15 s) para validar "explorado".
- Sem ranking público por padrão (opt-in por turma).

---

## 8. Template de conteúdo por estação

1. **Identificação:** nome, linha, disciplinas, nível, pré-requisitos, tempo estimado.
2. **Função no processo:** onde está, o que entra e o que sai.
3. **Como funciona:** animação 3D com hotspots, corte, vista explodida e slow motion.
4. **Componentes:** nomenclatura, simbologia e função de cada parte.
5. **Passo a passo:** sequência de partida/parada e ajustes operacionais.
6. **Segurança:** riscos, EPI, bloqueio e etiquetagem (LOTO), áreas restritas.
7. **Falhas comuns:** sintoma → causa provável → verificação.
8. **Qualidade e parâmetros:** faixas, tolerâncias, instrumentos.
9. **Quiz:** 3–5 questões (múltipla escolha, associação, ordenação).
10. **Prática 3D:** ligar/desligar, ajustar setpoint, localizar componente, corrigir falha.
11. **Apoio:** vídeo real, datasheet, PDF, glossário.
12. **Favoritar** e **marcar como visto** (com feedback visual).

---

## 9. UX e controles

- **Desktop:** WASD + mouse (pointer lock), `Shift` correr, `E` interagir, `Tab`
  menu, `M` mapa, `Esc` pausar.
- **Mobile/tablet:** joystick virtual + arrastar para olhar; botão de interação;
  teleporte como alternativa à caminhada.
- **Conforto:** FOV 75°, opção de desligar head bob, sensibilidade ajustável,
  snap turn para VR futuro.
- **Navegação assistida:** seta no chão até o objetivo, minimapa, "ir para" após
  desbloqueio.
- **Acessibilidade:** legendas PT-BR, transcrição, alto contraste, suporte a
  teclado, modo sem movimento, aviso de fotossensibilidade.
- **Feedback:** outline no objeto interativo, som espacial, animação de conclusão,
  troféu com cerimônia curta e compartilhável.

---

## 10. Arquitetura técnica sugerida

### 10.1 Stack

| Camada | Escolha | Motivo |
|---|---|---|
| App | Next.js 15 (App Router) + TypeScript | Ecossistema, SSR para catálogo/LMS, deploy simples |
| 3D | React Three Fiber + drei + postprocessing | Integra com React, comunidade ativa, hot reload |
| Física | Rapier (`@react-three/rapier`) | Colisão, rampas, portas, objetos |
| Estado | Zustand + TanStack Query | Estado de jogo local + cache de servidor |
| UI | Tailwind + shadcn/ui | Painéis diegéticos e menu consistentes |
| Backend | Route handlers/server actions + Postgres (Drizzle) | Um só deploy no MVP |
| Auth | Auth.js ou Clerk | Multi-tenant, SSO futuro |
| Assets | Cloudflare R2/S3 + CDN | glTF, KTX2, vídeos |
| Vídeo | MP4/WebM + legendas WebVTT | Simples e cacheável |
| Áudio | Web Audio/Howler + narração | Som espacial e acessível |

### 10.2 Pipeline 3D

```
Blender → glTF 2.0 → Draco (geometria) + KTX2 (texturas) → CDN
```

- 2 LODs por máquina; instancing para esteiras, parafusos, paletes.
- Luz assada (lightmap/AO) para cenário; luz dinâmica só no que importa.
- Orçamento: < 150 draw calls e < 300k triângulos por módulo visível.
- Streaming por módulo: carrega ao entrar, descarrega ao sair.
- Componentes reutilizáveis: motor, bomba, válvula, sensor, CLP, painel, esteira.

### 10.3 Progresso e dados

Tabelas principais:

```
organizations, users, memberships
lines, modules, stations, contents, assets
quizzes, questions, options
attempts, progress_events
station_progress, module_progress
achievements, user_achievements
favorites, trails, trail_items, certificates
challenge_runs
```

- Eventos imutáveis (`station_opened`, `block_completed`, `practice_completed`,
  `quiz_passed`, `challenge_passed`) → agregação em `station_progress`.
- Cálculo no servidor; cliente só envia eventos com idempotency key.
- Multi-tenant por `org_id` em todas as tabelas.
- xAPI opcional para LMS corporativo; SCORM 1.2 como adaptador.

### 10.4 Autoria (produção de conteúdo)

- **v1:** conteúdo em JSON/MDX no repositório + admin somente leitura.
- **v2:** CMS com editor de hotspots 3D, versionamento e preview.
- **v3:** importação de GLB + marcação de pontos de interesse dentro do navegador.

Sem ferramenta de autoria, cada nova máquina vira código — esse é o maior risco
de escala do projeto.

---

## 11. Roadmap sugerido

| Fase | Escopo | Duração estimada |
|---|---|---|
| 0. Descoberta | Definição de público, piloto, roteiro, estilo visual | 2–3 semanas |
| 1. MVP jogável | 1 linha (Envase/Água), 6–8 estações, 1 desafio, troféus, progresso | 8–10 semanas |
| 2. Piloto real | 1 turma/cliente, métricas, ajustes de UX e conteúdo | 4–6 semanas |
| 3. Expansão | 3 linhas × 3 produtos, 30–40 estações, trilhas, relatórios | 6–9 meses |
| 4. Plataforma | Autoria, LMS, multi-tenant, certificados, analytics | 3–4 meses |
| 5. Imersão | WebXR/VR, simulação com CLP/gêmeo digital | avaliar |

**Gargalo não é código, é conteúdo 3D.** Estimativa por estação: 5–10 dias
(modelagem + animação + texto + revisão técnica). Um módulo de 8 estações leva
2–3 meses com 1 artista 3D dedicado.

Equipe mínima para o piloto: 1 dev fullstack, 1 artista 3D, 1 designer
instrucional (part-time), 1 especialista técnico (SME) para validar.

---

## 12. Análise crítica da ideia original

### Pontos fortes

- Andar pela fábrica respeita o modelo mental real do operador.
- Conteúdo visual e animado é mais memorável que slide.
- Troféus e percentual dão senso de progresso e conclusão.
- Catálogo por linha/produto é facilmente vendável e expansível.

### Pontos a corrigir

1. **"Clique de visto" é raso e fácil de burlar.** Separar exploração de domínio
   (seção 7).
2. **Caminhada sem objetivo cansa.** Adicionar missões, guias e fast travel.
3. **Menu mistura eixos.** Produto, disciplina e nível precisam ser camadas
   distintas; trilhas resolvem o "por onde começo".
4. **Custo de conteúdo subestimado.** Reutilizar componentes e criar autoria cedo.
5. **Realismo fotorrealista é armadilha.** Estilo técnico estilizado (clean, com
   cores de segurança) entrega mais por menos.
6. **Mobile e VR exigem decisões de controle e conforto** desde o design.
7. **Sem avaliação, não há certificado** — e sem certificado, o uso corporativo
   perde força.
8. **Manutenção:** máquinas mudam; versionar estações e permitir conteúdo
   complementar sem refazer o 3D.
9. **Segurança jurídica:** deixar claro que a simulação não substitui treinamento
   prático nem autoriza operação real.
10. **LGPD** se houver menores em escolas: consentimento, minimização de dados e
    retenção definida.

---

## 13. Perguntas para a análise (decidir antes de codar)

1. **Cliente primário:** indústria cliente Autoric, escolas técnicas ou produto
   SaaS próprio?
2. **Objetivo:** vitrine comercial, onboarding de operador ou formação técnica
   ampla?
3. **Profundidade:** tour interativo, simulação de operação ou gêmeo digital
   conectado a CLP?
4. **Plataforma:** web desktop primeiro? tablet? VR já no MVP?
5. **Estilo visual:** estilizado técnico ou fotorrealista?
6. **Conteúdo:** quem são os SMEs e quanto tempo eles têm para validar?
7. **Idiomas:** PT-BR apenas ou PT/EN/ES desde o início?
8. **Certificação:** precisa integrar com LMS (SCORM/xAPI) já no piloto?
9. **Modelo de negócio:** assinatura por aluno, por planta, licença por curso?
10. **Piloto:** qual linha/produto e quais 6–8 estações entram na primeira versão?
