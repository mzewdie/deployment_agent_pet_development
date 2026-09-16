import React, { useState } from 'react';
import { Copy, Check, FileText, Code, FileCode } from 'lucide-react';
import { DeploymentConfig } from '../../types';
import { SPECIFICATION_MARKDOWN } from '../../data/specification';

interface DeploymentDocViewerProps {
  config: DeploymentConfig;
}

export const DeploymentDocViewer: React.FC<DeploymentDocViewerProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<'deployment_md' | 'dockerfile' | 'compose' | 'spec'>('deployment_md');
  const [copied, setCopied] = useState(false);

  const envLines = config.envVars.length > 0
    ? config.envVars.map(e => `      - ${e.key}=${e.value}`).join('\n')
    : '      # (No additional non-secret environment variables configured)';

  const generatedDeploymentMd = `# Deployment Documentation — Personal Expense Tracker (PET Development)

## Application Name
Personal Expense Tracker

## Repository
${config.repoUrl || 'https://github.com/mzewdie/pet_development_agent.git'}

## Deployed Commit / Version
- **Branch**: main
- **Commit SHA**: ${config.ref || '3864c379f1a6cbddbe7cdfe08d1858f056f681aa'}
- **Commit Subject**: feat(ui): improve expense form UX and styling
- **Commit Timestamp**: 2026-09-09 23:44:51 +0200

---

## Architecture & Component Breakdown
1. **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons.
2. **Backend**: Python 3.10+, FastAPI, Pydantic v2, SQLite.
3. **Unified Server (\`server.ts\`)**: Express proxy spawning FastAPI on 127.0.0.1:8001, proxying \`/api/*\` and serving \`dist/\` on port 3000.

---

## Docker Image
- **Image**: ${config.imageName}:${config.imageTag}
- **Container Name**: pet-app-local
- **Port**: ${config.port}:3000

---

## Build Command
\`\`\`bash
docker build -t ${config.imageName}:${config.imageTag} .
\`\`\`

## Run / Start Command
\`\`\`bash
docker run -d --name pet-app-local -p ${config.port}:3000 ${config.imageName}:${config.imageTag}
# Or via Docker Compose:
docker compose up -d --build
\`\`\`

## Health Checks & Verification
\`\`\`bash
# 1. Container status check
docker ps --filter "name=pet-app-local"

# 2. Backend / API Health Check (expected 200 OK)
curl -i http://localhost:${config.port}/api/health

# 3. Frontend Web Check (expected 200 OK)
curl -i http://localhost:${config.port}/
\`\`\`

## How to Stop / Remove Deployment
\`\`\`bash
docker stop pet-app-local && docker rm pet-app-local
# Or via compose:
docker compose down
\`\`\`
`;

  const generatedDockerfile = `# syntax=docker/dockerfile:1
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Install Python 3, pip, and SQLite for backend build/runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \\
    python3 \\
    python3-pip \\
    python3-setuptools \\
    sqlite3 \\
    curl \\
    && rm -rf /var/lib/apt/lists/*

# Install required Python backend packages
RUN python3 -m pip install --no-cache-dir --break-system-packages \\
    fastapi==0.115.6 \\
    uvicorn==0.34.0 \\
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
RUN apt-get update && apt-get install -y --no-install-recommends \\
    python3 \\
    python3-pip \\
    sqlite3 \\
    curl \\
    && rm -rf /var/lib/apt/lists/*

# Install Python runtime packages
RUN python3 -m pip install --no-cache-dir --break-system-packages \\
    fastapi==0.115.6 \\
    uvicorn==0.34.0 \\
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
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \\
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "dist/server.cjs"]
`;

  const generatedCompose = `version: '3.8'

services:
  personal-expense-tracker:
    build:
      context: .
      dockerfile: Dockerfile
    image: ${config.imageName}:${config.imageTag}
    container_name: pet-app-local
    ports:
      - "${config.port}:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - PYTHONUNBUFFERED=1
${envLines}
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:3000/api/health || exit 1"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 20s
`;

  const getActiveContent = () => {
    switch (activeTab) {
      case 'deployment_md':
        return generatedDeploymentMd;
      case 'dockerfile':
        return generatedDockerfile;
      case 'compose':
        return generatedCompose;
      case 'spec':
        return SPECIFICATION_MARKDOWN;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getActiveContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('deployment_md')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              activeTab === 'deployment_md'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            DEPLOYMENT.md
          </button>
          <button
            onClick={() => setActiveTab('dockerfile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              activeTab === 'dockerfile'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Dockerfile
          </button>
          <button
            onClick={() => setActiveTab('compose')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              activeTab === 'compose'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            docker-compose.yml
          </button>
          <button
            onClick={() => setActiveTab('spec')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              activeTab === 'spec'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            specification_deployment.md
          </button>
        </div>

        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors self-start sm:self-auto"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy Document'}
        </button>
      </div>

      <div className="relative">
        <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-slate-300 overflow-x-auto max-h-96 leading-relaxed select-text">
          {getActiveContent()}
        </pre>
      </div>
    </div>
  );
};
