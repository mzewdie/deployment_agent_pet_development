# Deployment Documentation — Personal Expense Tracker (PET Development)

## Application Name
Personal Expense Tracker

## Repository
`https://github.com/mzewdie/pet_development_agent.git`

## Deployed Commit / Version
- **Branch**: `main`
- **Commit SHA**: `3864c379f1a6cbddbe7cdfe08d1858f056f681aa`
- **Commit Subject**: `feat(ui): improve expense form UX and styling`
- **Commit Timestamp**: `2026-09-09 23:44:51 +0200`

---

## Architecture & Component Breakdown
The delivered application is a full-stack system consisting of:
1. **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons.
2. **Backend**: Python 3.10+, FastAPI, Pydantic v2, SQLite (with WAL mode, foreign keys, and integrity constraints).
3. **Unified Server (`server.ts`)**: An Express-based reverse proxy that automatically launches the Python FastAPI backend process on `127.0.0.1:8001`, proxies `/api/*`, `/docs`, and `/openapi.json` to FastAPI, and serves compiled static frontend assets from `dist/` on port 3000.

---

## Docker Deployment Configuration

### Docker Image
- **Image Name**: `pet-app`
- **Tag**: `local-test`

### Dockerfile (`Dockerfile`)
```dockerfile
# syntax=docker/dockerfile:1
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Install Python 3, pip, and SQLite for backend build/runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-setuptools \
    sqlite3 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install required Python backend packages
RUN python3 -m pip install --no-cache-dir --break-system-packages \
    fastapi==0.115.6 \
    uvicorn==0.34.0 \
    pydantic==2.10.4

# Install Node dependencies
COPY package*.json ./
RUN npm ci

# Copy application source code (strict zero-modification)
COPY . .

# Compile frontend and server bundle
RUN npm run build

# -------------------------------------------------------------
# Runtime stage
# -------------------------------------------------------------
FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV PYTHONUNBUFFERED=1

# Install runtime dependencies: Python 3, SQLite, and curl
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    sqlite3 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python runtime packages
RUN python3 -m pip install --no-cache-dir --break-system-packages \
    fastapi==0.115.6 \
    uvicorn==0.34.0 \
    pydantic==2.10.4

# Install production Node dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled frontend and bundled server from builder
COPY --from=builder /app/dist ./dist

# Copy Python backend application directory
COPY --from=builder /app/backend ./backend

# Copy package.json for runtime metadata
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Health check verifies that both Express proxy and FastAPI backend respond
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "dist/server.cjs"]
```

### Docker Compose (`docker-compose.yml`)
```yaml
version: '3.8'

services:
  personal-expense-tracker:
    build:
      context: .
      dockerfile: Dockerfile
    image: pet-app:local-test
    container_name: pet-app-local
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - PYTHONUNBUFFERED=1
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:3000/api/health || exit 1"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 20s
```

---

## Required Environment Variables
*(No secret values required)*
- `NODE_ENV`: `production`
- `PORT`: `3000` (Default application listening port)
- `PYTHONUNBUFFERED`: `1` (Ensures real-time Python logging)
- `EXPENSE_DB_PATH`: *(Optional)* Custom path to SQLite database (defaults to `expenses.db` in working directory).

---

## Ports
- `3000`: Primary unified application port (serves React frontend and proxies `/api/*` to FastAPI backend).
- `8001`: Internal localhost port for FastAPI (bound to `127.0.0.1` inside container, not exposed externally).

---

## Execution Commands

### 1. Build Command
```bash
docker build -t pet-app:local-test .
```

### 2. Run Command (Standalone Docker)
```bash
docker run -d \
  --name pet-app-local \
  -p 3000:3000 \
  pet-app:local-test
```

### 3. Run Command (Docker Compose)
```bash
docker compose up -d --build
```

---

## Health Checks & Verification Procedures

### 1. Check Container Status
```bash
docker ps --filter "name=pet-app-local"
```
*Expected*: Status `Up` with `(healthy)` flag.

### 2. Check Backend API Health Endpoint
```bash
curl -i http://localhost:3000/api/health
```
*Expected Output*:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{"status":"healthy","service":"Personal Expense Tracker API","version":"1.0.0","database":"SQLite","expense_count":0}
```

### 3. Check Frontend Response
```bash
curl -i http://localhost:3000/
```
*Expected Output*:
```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
...
<title>Personal Expense Tracker</title>
```

### 4. Interactive OpenAPI Docs Check
```bash
curl -i http://localhost:3000/docs
```
*Expected Output*: HTTP 200 with Swagger UI.

---

## How to Stop and Remove Deployment

```bash
# Standalone Docker
docker stop pet-app-local && docker rm pet-app-local

# Docker Compose
docker compose down
```

---

## How to Reproduce the Deployment from the Specified Delivery

```bash
# 1. Clone delivery repository at authoritative commit
git clone https://github.com/mzewdie/pet_development_agent.git
cd pet_development_agent
git checkout 3864c379f1a6cbddbe7cdfe08d1858f056f681aa

# 2. Place Dockerfile, docker-compose.yml, and .dockerignore in the root (if not already present)

# 3. Build Docker container
docker build -t pet-app:local-test .

# 4. Run Docker container
docker run -d --name pet-app-local -p 3000:3000 pet-app:local-test

# 5. Verify health
curl -f http://localhost:3000/api/health
```

---

## Known Deployment Limitations & Agent Environment Execution Record
1. **Application Source Code Integrity**: 100% preserved. Zero modifications were made to application source files (`backend/`, `src/`, `server.ts`, `Readme.md`).
2. **Local Agent Sandbox Constraints**:
   - The master deployment agent runs within a secure sandboxed container environment (Google Cloud Run / gVisor) that does not provide root privileges to run a nested Docker daemon or mount `/var/run/docker.sock`.
   - Direct execution of `docker` or `dockerd` inside this sandboxed container produces `docker: not found` / permission denied on cgroups.
   - However, the application's build pipeline (`npm run build` using Vite and esbuild) and the backend runtime (`python3 -m uvicorn backend.main:app` with FastAPI) were both independently tested and validated to build and respond with `HTTP 200 OK` on `/api/health`.
   - For complete local container execution, run the provided `Dockerfile` and `docker-compose.yml` on any host system with Docker Engine / Docker Desktop installed.
