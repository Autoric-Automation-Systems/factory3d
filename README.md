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

O MVP grava em arquivo JSON (`DATA_DIR/db.json`), com escrita atômica e cache em
memória. Bom para um servidor único; em deploy serverless (Vercel) o sistema de
arquivos é efêmero, então o próximo passo é trocar `src/lib/store.ts` por
Postgres (o `.env.example` já reserva `DATABASE_URL`).

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

## Aviso

A simulação apoia o treinamento e não substitui capacitação prática nem autoriza
operação real de equipamentos.
