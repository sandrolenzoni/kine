# Kine - Sistema de Processamento de Tarefas em Segundo Plano

Painel para agendar e processar tarefas em background com atualização em tempo real via WebSocket.

## Stack

- **Backend:** Laravel 13 (PHP 8.4)
- **Frontend:** React 19 + TypeScript + Vite + Tailwind 4
- **Banco:** MySQL 8.0
- **Fila:** Redis
- **WebSocket:** Laravel Reverb
- **Infra:** Docker + Docker Compose

## Requisitos

- Docker + Docker Compose
- Portas disponíveis no host:
  - `5173` — frontend (Vite)
  - `8000` — API (Laravel)
  - `8080` — WebSocket (Reverb)
  - `3306` — MySQL
  - `6379` — Redis

> Para alterar uma porta, edite `docker-compose.yaml` e o `.env` correspondente.

## Como executar

```bash
# Opção 1 — script rápido (sobe tudo + migrations)
./start.sh

# Opção 2 — passo a passo
docker compose up -d
docker compose exec api php artisan migrate --force

# (opcional) Limpar cache de configuração
docker compose exec api php artisan optimize:clear
```

Acessar:
- **Frontend:** http://localhost:5173
- **API:** http://localhost:8000/api

### Verificando os containers

```bash
docker compose ps
```

Os workers `worker-high` e `worker-default` podem não aparecer no `ps` se estiverem ociosos (usam `--once`). Confirme com os logs:

```bash
docker compose logs worker-high
docker compose logs worker-default
```

## Estrutura do projeto

```
kine/
├── apps/
│   ├── api/              # Laravel (backend)
│   │   ├── app/
│   │   │   ├── Domain/         # Entidades, enums, interfaces
│   │   │   ├── Application/    # Casos de uso
│   │   │   ├── Infrastructure/ # Jobs, repositórios Eloquent
│   │   │   ├── Http/           # Controllers
│   │   │   └── Events/         # Eventos WebSocket
│   │   ├── routes/api.php      # Rotas da API
│   │   ├── tests/
│   │   │   ├── Unit/           # Testes unitários
│   │   │   └── Feature/        # Testes de feature
│   │   └── database/migrations/
│   └── web/              # React + Vite (frontend)
│       └── src/
│           ├── context/        # KineContext (tasks + logs)
│           ├── domain/         # Schemas Zod, tipos, interfaces
│           ├── infrastructure/ # API client, KineRepository
│           └── presentations/  # Componentes, hooks, páginas
├── docker-compose.yaml
├── start.sh
└── .gitignore
```

## API Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/tasks` | Lista todas as tarefas |
| POST | `/api/tasks` | Cria uma nova tarefa |
| GET | `/api/tasks/{id}` | Detalhes da tarefa + logs |
| POST | `/api/tasks/{id}/retry` | Reprocessa tarefa falha |
| GET | `/api/tasks/{id}/logs` | Logs de uma tarefa |
| GET | `/api/logs` | Lista todos os logs |
| GET | `/api/metrics` | Métricas gerais |

### Criar tarefa (exemplo)

```json
POST /api/tasks
{
  "name": "Enviar e-mail de boas-vindas",
  "type": "email",
  "priority": "high",
  "payload": {
    "to": "usuario@exemplo.com",
    "subject": "Bem-vindo!"
  }
}
```

## Filas

Duas filas com workers dedicados em containers separados:

- **high** (`worker-high`): prioridade alta, tenta 5x com backoff [5, 10, 20, 40, 80]s
- **default** (`worker-default`): prioridade normal, tenta 5x com backoff [5, 10, 20, 40, 80]s

Jobs expiram após 30s no Redis e são movidos para a fila de falhas automaticamente.

## WebSocket

Eventos emitidos em tempo real via Laravel Reverb (porta 8080):

| Evento | Canal | Descrição |
|--------|-------|-----------|
| `TaskStatusChanged` | `tasks` + `tasks.{id}` | Mudança de status da tarefa |
| `TaskStepExecuted` | `tasks.{id}` | Progresso de cada etapa |

O frontend escuta esses eventos via `laravel-echo` + `pusher-js` e invalida o cache do React Query automaticamente.

## Testes

```bash
# Todos os testes
docker compose exec api php artisan test

# Ou com PHPUnit diretamente
docker compose exec api ./vendor/bin/phpunit
```

O projeto possui **15 testes** (7 unitários + 8 de feature) cobrindo criação, listagem, retry, estratégias (Push, Report, Email), métricas e configuração de jobs.

## Containers

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| api | 8000 | Laravel PHP-FPM |
| web | 5173 | Vite dev server |
| mysql | 3306 | Banco de dados |
| redis | 6379 | Fila + cache |
| reverb | 8080 | WebSocket server |
| worker-high | — | Worker fila high |
| worker-default | — | Worker fila default |

## Troubleshooting

| Problema | Solução |
|----------|---------|
| `Connection refused` no frontend | Verificar se `REVERB_APP_ID` e `REVERB_KEY` no `apps/api/.env` batem com `apps/web/.env` |
| Worker não processa jobs | `docker compose logs worker-high` para ver erros |
| Migration falha | `docker compose exec api php artisan migrate --force` |
| Porta ocupada | Alterar a porta em `docker compose.yaml` e no `.env` correspondente
