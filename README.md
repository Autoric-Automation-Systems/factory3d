# Fábrica 3D

Ambiente de aprendizagem em 3D, em primeira pessoa, para treinamento industrial.
A pessoa caminha pela fábrica, chega na máquina, lê o funcionamento e marca cada
conteúdo como visto. O progresso é por usuário, por estação, e libera troféus por
módulo.

## Estado atual (MVP)

- Módulo **Envase · Água mineral** com 8 estações navegáveis.
- Mundo 3D procedural (sem arquivos de modelo): galpão, esteira, máquinas
  animadas e etiquetas 3D.
- Tour interativo: painéis por estação com processo, funcionamento, componentes,
  ajuste/partida, segurança, falhas comuns e quiz.
- Progresso por usuário: estação aberta (10%), blocos vistos (70%), quiz
  aprovado (20%).
- Troféus por módulo: bronze (todas abertas), prata (todo o conteúdo lido),
  ouro (quiz aprovado em todas).
- Favoritos, conquistas, planos e anúncios no plano gratuito.
- Login com Google (quando configurado) e acesso de demonstração.

## Como rodar

```bash
npm install
cp .env.example .env.local   # ajuste AUTH_SECRET
npm run dev                  # http://localhost:12000
```

Build de produção:

```bash
npm run build
npm start
```

## Login com Google

1. Crie credenciais OAuth em <https://console.cloud.google.com/apis/credentials>.
2. Origens autorizadas: `http://localhost:12000` e o domínio de produção.
3. Redirect URI: `https://SEU_DOMINIO/api/auth/callback/google`.
4. Preencha `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` no `.env.local`.

Sem essas variáveis o botão do Google fica desabilitado e o acesso de
demonstração continua funcionando.

## Dados

O `src/lib/store.ts` escolhe o backend em tempo de execução pela presença de
`DATABASE_URL` (ou `POSTGRES_URL`):

| Backend | Quando | Persistência |
| --- | --- | --- |
| Postgres (Neon) | `DATABASE_URL` definida | Permanente, funciona em serverless |
| Arquivo JSON | sem `DATABASE_URL` | `DATA_DIR/db.json`, bom só para uso local |

As tabelas `f3d_users` e `f3d_orgs` são criadas automaticamente na primeira
consulta (`create table if not exists`), então não há passo de migração. Progresso
e favoritos ficam em colunas `jsonb`.

Em produção sem `DATABASE_URL` o progresso não sobrevive entre requisições, e o
hub mostra um aviso vermelho dizendo exatamente isso.

> **Sessões:** `AUTH_SECRET` precisa ser estável. Se ele mudar (ou se antes o app
> rodava sem ele), os cookies já emitidos não podem ser decifrados e o log mostra
> `no matching decryption secret`. Basta limpar os cookies do site — o usuário
> apenas precisa entrar novamente.

## Deploy na Vercel

1. Conecte o repositório em *Add New Project* (o build é o padrão do Next.js).
2. Em **Settings → Environment Variables**, cadastre:

| Variável | Valor |
| --- | --- |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_TRUST_HOST` | `true` |
| `GOOGLE_CLIENT_ID` | do Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | do Google Cloud Console |

3. Conecte o banco **Neon** ao projeto (Storage → Neon). A integração injeta
   `DATABASE_URL` automaticamente; o app cria as tabelas no primeiro acesso.
4. No Google Cloud Console, adicione o domínio de produção:
   - Origem: `https://SEU-DOMINIO.vercel.app`
   - Redirect: `https://SEU-DOMINIO.vercel.app/api/auth/callback/google`
5. Redeploy. O hub não deve mais exibir o aviso de armazenamento.

Ao trocar qualquer uma dessas variáveis, faça um **Redeploy** — variáveis novas só
entram em vigor numa nova implantação.

Sem `GOOGLE_CLIENT_ID`/`SECRET` o botão do Google fica desabilitado e o acesso de
demonstração continua disponível — útil para revisar a aplicação antes de criar
as credenciais.

## Estrutura

```
src/
  app/
    page.tsx                 landing
    entrar/                  login
    hub/                     painel do jogador
    modulos/[slug]/          lista de estações do módulo
    materias/                conteúdo por disciplina (todas as estações)
    jogar/[slug]/            jogo 3D (canvas + HUD)
    favoritos/  conquistas/  precos/
    api/progress|favorites|state|reset|auth
  components/
    game/                    World, Player, machines, HUD, minimap, joystick, painel
    SiteHeader, AdSlot
  content/
    catalog.ts               catálogo de linhas e módulos
    envase/agua/01..10       conteúdo técnico das estações
  lib/
    types.ts  store.ts  progress.ts  session.ts  materias.ts
  auth.ts                    NextAuth (Google + demonstração)
```

## Conteúdo

Cada estação é um objeto em `src/content/envase/agua/*.ts`:

```ts
{
  id, name, role, disciplines, minutes, machine,
  position: [x, z],            // posição no galpão
  specs, blocks[], safety[], faults[], quiz[], videoNote,
  materias[]                   // recortes por disciplina
}
```

`blocks` conta a estação do ponto de vista do processo. `materias` quebra a
mesma estação por disciplina (`mecanica`, `pneumatica`, `eletrica`,
`automacao`, `eletronica`, `hidraulica`, `qualidade`, `operacao`, `seguranca`).
Cada tópico é `{ id, discipline, level, title, summary, bullets[] }`, com
`level` 1–3 (fundamento, operação, diagnóstico) definindo a ordem de leitura.
Os tópicos entram no progresso da estação: `stationChecklist` em
`lib/progress.ts` soma blocos, matérias e as abas de revisão.

Para criar uma estação nova, copie um arquivo existente, ajuste o conteúdo e
registre no `catalog.ts`. A posição `[x, z]` define onde a máquina aparece no
galpão; o tipo visual vem de `machine`.

## Controles

- Desktop: `WASD` ou setas para andar, mouse para olhar (clique para capturar),
  `Shift` para correr, `E` para examinar, `Esc`/`Tab` para o menu.
- Celular: joystick à esquerda, arraste na tela para olhar, toque na estação
  quando o aviso aparecer.

## Planos

| Plano | Preço | Escopo |
| --- | --- | --- |
| Gratuito | R$ 0 | Módulo Água completo, com anúncios discretos |
| Individual | R$ 29/mês | Todos os mapas, sem anúncios, certificado |
| Escola | R$ 99/mês a partir de 10 vagas rotativas | Cada mapa ocupa 1 vaga; a escola indica o mapa de cada aluno; vaga volta ao pacote quando o aluno conclui |

A cobrança ainda não está implementada: as páginas existem, o checkout é o próximo
passo (Stripe ou Mercado Pago).

## Roadmap

1. Publicar (Vercel + Neon + Google OAuth).
2. Linha **Automotivo** — carro a combustão, carro elétrico, moto, bicicleta.
3. Turmas: painel da escola, atribuição de vaga por mapa, relatório.
4. Modelo de cobrança e checkout.
5. Vídeos curtos por estação (`videoUrl` já existe no tipo `Station`).
6. Modo prática com validação de sequência de partida.

## Aviso

A simulação apoia o treinamento e não substitui capacitação prática nem autoriza
operação real de equipamentos.
