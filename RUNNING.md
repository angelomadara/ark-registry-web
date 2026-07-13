# 🚀 Running The Ark Registry (Full Stack)

## Quick Start — Everything at once

```bash
# From the backend repo
cd ~/Github/the-ark-registry

# Start backend + database + nginx
docker compose up -d --build

# From the frontend repo
cd ~/Github/ark-registry-web

# Start Nuxt frontend (joins the same ark-network)
docker compose up -d --build
```

After both are running, the stack is available at:

|| Service              | URL                                  |
||----------------------|--------------------------------------|
|| Frontend (Nuxt)      | http://localhost:3000                |
|| API (Express)        | http://localhost:3080                |
|| Database (PG)        | localhost:5433                       |

---

## Start Backend (ark-backend + ark-db)

```bash
cd ~/Github/the-ark-registry

# Build and start all backend services
docker compose up -d --build

# Check status
docker compose ps

# Tail logs
docker compose logs -f
```

The backend compose starts:
- `ark-backend` — Express API on port 3080 (mapped from container port 3000)
- `ark-db` — PostGIS on port 5433

---

## Start Frontend (ark-web)

```bash
cd ~/Github/ark-registry-web

# Build and start the Nuxt dev server
docker compose up -d --build

# Tail logs for HMR feedback
docker compose logs -f
```

The frontend compose starts:
- `ark-web` — Nuxt 4 dev server on port 3000 (joins `ark-network`)

The container runs in **development mode** with:
- Hot Module Replacement (HMR) via WebSocket
- Source code mounted as a volume (edit on host → instant reload)
- `NUXT_PUBLIC_API_BASE=http://ark-backend:3000` for API calls

### First time setup

Before running the frontend for the first time, ensure the `ark-network` Docker network exists:

```bash
docker network create ark-network 2>/dev/null || true
```

This is automatically created by the backend compose, but creating it explicitly ensures the frontend can start independently.

---

## Stack both compose files

You can also run both from a single directory:

```bash
cd ~/Github/the-ark-registry
docker compose \
  -f docker-compose.yml \
  -f ../ark-registry-web/docker-compose.yml \
  up -d --build
```

This merges the two compose files and starts **all** services at once.

---

## Verify connectivity

```bash
# Health check — API responds
curl http://localhost:3080/
# → {"message":"Welcome to The Ark Registry API","status":"Online"}

# Species endpoint
curl http://localhost:3080/api/species
# → {"success":true,"message":"Success","data":[]}

# Frontend (Nuxt dev server)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
# → 302 (redirects to /login)

# Internal DNS — from the frontend container, ark-backend is reachable
docker exec ark-web node -e "const h=require('http');h.get({hostname:'ark-backend',port:3000,path:'/',timeout:5000},r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>console.log('OK:',d))}).on('error',e=>console.log('FAIL:',e.message))"
```

---

## Stop everything

```bash
# Backend
cd ~/Github/the-ark-registry && docker compose down

# Frontend
cd ~/Github/ark-registry-web && docker compose down

# Stacked mode (from backend dir)
cd ~/Github/the-ark-registry && docker compose \
  -f docker-compose.yml \
  -f ../ark-registry-web/docker-compose.yml \
  down
```

To also remove the database volume (⚠️ data loss):

```bash
cd ~/Github/the-ark-registry && docker compose down -v
```

---

## Architecture

```
┌─────────────┐     ┌──────────────┐    ┌────────────┐
│  Browser     │ ──► │  ark-backend │    │  ark-web   │
│  :3000       │     │  :3080       │    │  :3000     │
│  :3080       │     └──────────────┘    └────────────┘
└─────────────┘                              │
   Direct API ──►                         ┌──▼─────────┐
   Nuxt UI   ──►                          │  ark-db    │
                                           │  :5433     │
                                           └────────────┘
              Docker network: ark-network (bridge)
```

## Files created

|| File | Location |
||------|----------|
|| Dockerfile | `~/Github/ark-registry-web/Dockerfile` |
|| docker-compose.yml | `~/Github/ark-registry-web/docker-compose.yml` |
|| .dockerignore | `~/Github/ark-registry-web/.dockerignore` |
|| RUNNING.md | `~/Github/ark-registry-web/RUNNING.md` |
