# Deployment Documentation - PET Development

## Application Name
Master Deployment Agent - PET Development

## Repository
*Pending Human Coordinator Input* (Awaiting specific GitHub repository URL)

## Deployed Commit / Version
*Pending Human Coordinator Input* (Awaiting specific branch, tag, or commit SHA)

## Status
**AWAITING REPOSITORY INPUT** - Deployment cannot proceed without an application repository delivery.

---

## Deployment Integrity Policy
Adhering to Master Deployment Agent protocol:
- **Never modify application source code** to solve deployment problems.
- **Never change application behavior** or business rules.
- **Never remove or weaken application functionality**.
- **Never invent repositories, credentials, agents, tools, or infrastructure**.

---

## Docker Deployment Specification

### Docker Image
- **Image Name**: `pet-app`
- **Tag**: `local-test`

### Dockerfile (Standard Node.js Full-Stack / Container Deployment Reference)
```dockerfile
# Multi-stage production / test build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Runtime stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts 2>/dev/null || true

EXPOSE 3000
USER node
CMD ["npm", "start"]
```

### Docker Compose (`docker-compose.yml`)
```yaml
version: '3.8'

services:
  app:
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
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:3000/api/health || wget -qO- http://localhost:3000/ || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
```

---

## Environment Variables
*(Do not include secret values)*
- `PORT`: 3000 (default port for container traffic)
- `NODE_ENV`: `production` or `test`
- *(Additional variables required by the delivery repository will be documented upon receipt)*

---

## Execution Commands

### Build Command
```bash
docker build -t pet-app:local-test .
```

### Run Command
```bash
docker run -d --name pet-app-local -p 3000:3000 pet-app:local-test
```
or via docker compose:
```bash
docker compose up -d --build
```

### Health Check Verification
```bash
# Verify container is running
docker ps --filter "name=pet-app-local"

# Verify port availability & frontend response
curl -i http://localhost:3000/

# Verify API health endpoint (if provided by delivery)
curl -i http://localhost:3000/api/health
```

### Stop / Remove Command
```bash
docker stop pet-app-local && docker rm pet-app-local
# Or via compose:
docker compose down
```

---

## Verification Criteria Checklist
- [ ] Container starts cleanly
- [ ] Required ports (3000) are available and listening
- [ ] Frontend responds (HTTP 200)
- [ ] Backend/API health endpoint responds
- [ ] Inter-service communication operational (if multi-service)
- [ ] Source code remains 100% unmodified

---

## Known Deployment Limitations & Manual Steps
1. Target GitHub repository and commit/tag must be supplied by the human coordinator.
2. In sandboxed container environments without nested Docker daemon socket access (`/var/run/docker.sock`), local Docker execution requires host Docker engine access or an external Docker runtime.
