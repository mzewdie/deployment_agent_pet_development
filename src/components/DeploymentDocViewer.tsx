import React, { useState } from 'react';
import { Copy, Check, FileText, Code, FileCode } from 'lucide-react';
import { DeploymentConfig } from '../types';
import { SPECIFICATION_MARKDOWN } from '../data/specification';

interface DeploymentDocViewerProps {
  config: DeploymentConfig;
}

export const DeploymentDocViewer: React.FC<DeploymentDocViewerProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<'deployment_md' | 'dockerfile' | 'compose' | 'spec'>('deployment_md');
  const [copied, setCopied] = useState(false);

  const envLines = config.envVars.length > 0
    ? config.envVars.map(e => `      - ${e.key}=${e.value}`).join('\n')
    : '      # (No additional non-secret environment variables configured)';

  const generatedDeploymentMd = `# Deployment Documentation - PET Development

## Application Name
Master Deployment Agent - PET Development

## Repository
${config.repoUrl || "*Pending Human Coordinator Input* (Awaiting specific GitHub repository URL)"}

## Deployed Commit / Version
${config.ref || "*Pending Human Coordinator Input* (Awaiting specific branch, tag, or commit SHA)"}

## Docker Image Name and Tag
${config.imageName}:${config.imageTag}

## Required Environment Variables
- PORT: ${config.port}
- NODE_ENV: production
${config.envVars.map(e => `- ${e.key}: ${e.value}`).join('\n')}

## Ports
- ${config.port}: Container listening port mapped to host ${config.port}

## Build Command
\`\`\`bash
docker build -t ${config.imageName}:${config.imageTag} .
\`\`\`

## Run / Start Command
\`\`\`bash
docker run -d --name ${config.imageName}-container -p ${config.port}:${config.port} ${config.imageName}:${config.imageTag}
# or via compose:
docker compose up -d --build
\`\`\`

## Health Checks
\`\`\`bash
# 1. Container status check
docker ps --filter "name=${config.imageName}-container"

# 2. Frontend / endpoint HTTP check
curl -I http://localhost:${config.port}${config.healthEndpoint}
\`\`\`

## How to Stop / Remove Deployment
\`\`\`bash
docker stop ${config.imageName}-container && docker rm ${config.imageName}-container
# or via compose:
docker compose down
\`\`\`

## Reproduction Procedure
1. Clone repository delivery at specified ref:
   git clone ${config.repoUrl || '<repository-url>'}
   git checkout ${config.ref || '<ref>'}
2. Build Docker container using provided Dockerfile:
   docker build -t ${config.imageName}:${config.imageTag} .
3. Run container locally exposing port ${config.port}.
4. Verify HTTP endpoint responds cleanly without any modifications to application source code.

## Known Deployment Limitations / Manual Steps
- The human coordinator must provide the authorized GitHub repository and commit reference.
- Sandboxed execution environments must have Docker runtime daemon access.
`;

  const generatedDockerfile = `# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependency manifests
COPY package*.json ./
RUN npm ci

# Copy application source code (strict zero-modification rule)
COPY . .

# Build application bundle
RUN npm run build

# Runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=${config.port}

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE ${config.port}
USER node

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \\
  CMD wget -qO- http://localhost:${config.port}${config.healthEndpoint} || exit 1

CMD ["npx", "serve", "-s", "dist", "-l", "${config.port}"]
`;

  const generatedCompose = `version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    image: ${config.imageName}:${config.imageTag}
    container_name: ${config.imageName}-container
    ports:
      - "${config.port}:${config.port}"
    environment:
      - NODE_ENV=production
      - PORT=${config.port}
${envLines}
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:${config.port}${config.healthEndpoint} || exit 1"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 10s
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
