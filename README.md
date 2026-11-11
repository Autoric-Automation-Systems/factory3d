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

O `src/lib/store.ts` escolhe o backend em tempo de execução:

| Backend | Quando | Persistência |
| --- | --- | --- |
| Redis REST (Upstash / Vercel KV) | `KV_REST_API_URL` + `KV_REST_API_TOKEN` (ou `UPSTASH_REDIS_REST_*`) | Permanente, funciona em serverless |
| Arquivo JSON | sem essas variáveis | `DATA_DIR/db.json`, bom só para uso local |

Em produção sem Redis o progresso não sobrevive entre requisições, e o hub mostra
um aviso vermelho dizendo exatamente isso. **Antes de divulgar o link, configure
o Redis.**

## Deploy na Vercel

1. Conecte o repositório em *Add New Project* (o build é o padrão do Next.js).
2. Em **Settings → Environment Variables**, cadastre:

| Variável | Valor |
| --- | --- |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_TRUST_HOST` | `true` |
| `GOOGLE_CLIENT_ID` | do Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | do Google Cloud Console |

3. Em **Storage / Marketplace**, adicione **Upstash Redis** (plano free serve) e
   conecte ao projeto. As variáveis `KV_REST_API_URL` e `KV_REST_API_TOKEN` são
   criadas automaticamente.
4. No Google Cloud Console, adicione o domínio de produção:
   - Origem: `https://SEU-DOMINIO.vercel.app`
   - Redirect: `https://SEU-DOMINIO.vercel.app/api/auth/callback/google`
5. Redeploy. O hub não deve mais exibir o aviso de armazenamento.

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
    jogar/[slug]/            jogo 3D (canvas + HUD)
    favoritos/  conquistas/  precos/
    api/progress|favorites|state|reset|auth
  components/
    game/                    World, Player, machines, HUD, minimap, joystick, painel
    SiteHeader, AdSlot
  content/
    catalog.ts               catálogo de linhas e módulos
    envase/agua/01..08       conteúdo técnico das estações
  lib/
    types.ts  store.ts  progress.ts  session.ts
  auth.ts                    NextAuth (Google + demonstração)
```

## Conteúdo

Cada estação é um objeto em `src/content/envase/agua/*.ts`:

```ts
{
  id, name, role, disciplines, minutes, machine,
  position: [x, z],            // posição no galpão
  specs, blocks[], safety[], faults[], quiz[], videoNote
}
```

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

1. Publicar (Vercel + Redis + Google OAuth).
2. Linha **Automotivo** — carro a combustão, carro elétrico, moto, bicicleta.
3. Turmas: painel da escola, atribuição de vaga por mapa, relatório.
4. Modelo de cobrança e checkout.
5. Vídeos curtos por estação (`videoUrl` já existe no tipo `Station`).
6. Modo prática com validação de sequência de partida.

## Aviso

A simulação apoia o treinamento e não substitui capacitação prática nem autoriza
operação real de equipamentos.
