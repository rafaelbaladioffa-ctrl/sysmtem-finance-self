# Desenvolvimento

## Requisitos

- Docker 29+ e Docker Compose v2.
- Node.js 24.22.0+ para executar os scripts fora de containers.

O host usado na Etapa 1 não tinha Node instalado. As validações locais foram executadas com o tarball oficial verificado de Node `v24.22.0`; a imagem `node:24.22.0-bookworm-slim` é usada pelo Dockerfile quando o daemon está disponível.

## Configuração local

```sh
cp .env.example .env
```

Para executar a aplicação diretamente no host, altere `DATABASE_URL` de `db` para `localhost` e suba somente o banco:

```sh
docker compose --env-file .env up -d db
```

Para executar toda a base em containers:

```sh
docker compose --env-file .env up --build -d
docker compose --env-file .env ps
```

A aplicação fica acessível localmente em `http://localhost:3000` por meio do bind em loopback. O banco e o worker não publicam portas. Em produção, um proxy HTTPS deve ficar à frente do serviço `app`.

## Scripts

```sh
npm run typecheck
npm run lint
npm test
npm run db:check
npm run build
npm run db:migrate
```

A migração é versionada em `drizzle/migrations/` e deve ser aplicada por `db:migrate`; não usar `db push` em produção.

## Saúde

- App liveness: `GET /api/health/live` confirma apenas que o processo HTTP responde.
- App readiness: `GET /api/health/ready` confirma também conexão ao PostgreSQL.
- Worker liveness/readiness: `/health/live` e `/health/ready` na porta interna 3001.

As respostas não contêm dados pessoais. O worker ainda não processa jobs de negócio; o endpoint confirma somente processo e conexão.

## Resultado da Etapa 1

Passaram localmente: `npm run lint`, `npm run typecheck`, `npm test`, `npm run db:check`, `npm run build` e `docker compose config --quiet`. O app também respondeu ao liveness com HTTP 200 e ao readiness com HTTP 503 quando o PostgreSQL não estava disponível, confirmando a distinção entre processo vivo e dependência pronta.

A execução real de `docker compose up`, aplicação da migração em PostgreSQL limpo, reinício dos containers e teste de persistência ficou bloqueada neste ambiente porque o usuário da sessão não tem permissão para acessar `/var/run/docker.sock` (socket pertence ao grupo `docker`, enquanto a sessão não é membro dele). Não marcar R-32 como verificado até repetir essas validações em uma sessão com acesso ao daemon.

## Escopo da Etapa 1

Esta etapa entrega ambiente, estrutura, banco e health checks. Autenticação, autorização, operações financeiras, importação, relatórios e UI funcional ficam para as etapas seguintes.
