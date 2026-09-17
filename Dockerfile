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
RUN if [ -f package-lock.json ]; then npm ci || npm install; else npm install; fi

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

# Install runtime dependencies: Python 3 and curl (for healthcheck)
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
RUN if [ -f package-lock.json ]; then npm ci --omit=dev || npm install --omit=dev; else npm install --omit=dev; fi

# Copy compiled frontend and bundled server from builder
COPY --from=builder /app/dist ./dist

# Copy Python backend application directory
COPY --from=builder /app/backend ./backend

# Copy package.json for runtime metadata
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000 8001

# Health check verifies that both Express proxy and FastAPI backend are operational
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "dist/server.cjs"]
