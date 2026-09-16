# Master Deployment & Delivery Verification System

> **Automated Containerization, Deployment Orchestration, and Zero-Modification Verification for the Personal Expense Tracker (PET)**

[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Port](https://img.shields.io/badge/Host_Port-3002-green.svg)](#6-quick-start-docker-deployment-recommended)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Table of Contents
1. [Overview](#1-overview)
2. [Delivered Application Specification](#2-delivered-application-specification)
3. [Architecture & Port Allocation Strategy (Port 3002)](#3-architecture--port-allocation-strategy-port-3002)
4. [Master Deployment Dashboard (Interactive Console)](#4-master-deployment-dashboard-interactive-console)
5. [Repository Structure](#5-repository-structure)
6. [Prerequisites](#6-prerequisites)
7. [Quick Start: Docker Deployment (Recommended)](#7-quick-start-docker-deployment-recommended)
8. [Alternative: Bare-Metal Local Execution](#8-alternative-bare-metal-local-execution)
9. [Running the Deployment Agent Dashboard Locally](#9-running-the-deployment-agent-dashboard-locally)
10. [Verification & Health Checks](#10-verification--health-checks)
11. [Configuration & Environment Variables](#11-configuration--environment-variables)
12. [Strict Zero-Modification Guarantee](#12-strict-zero-modification-guarantee)
13. [Troubleshooting & FAQ](#13-troubleshooting--faq)

---

## 1. Overview

This project provides an automated, reproducible deployment system and live verification harness for the **Personal Expense Tracker (PET)** full-stack application.

Key responsibilities fulfilled by this project:
- **Zero-Modification Packaging**: Generates production-ready Docker deployment artifacts (`Dockerfile`, `docker-compose.yml`, `.dockerignore`) without altering any delivered application source code or documentation.
- **Port Conflict Protection (Port 3002)**: Configured with host port `3002` (mapped to container port `3000`) so the containerized application can run concurrently alongside local development servers that use port 3000.
- **Unified Multi-Runtime Orchestration**: Builds and runs a containerized dual-runtime environment containing both Node.js (Vite frontend + Express reverse proxy) and Python (FastAPI + SQLite).
- **Automated Verification Harness**: Validates build pipelines, internal inter-process communication, API health status, and UI serving.
- **Interactive Deployment Dashboard**: A real-time web console displaying verification checks, build stage progression, raw logs, and deployment documentation.

---

## 2. Delivered Application Specification

The delivery deployed and verified by this system is sourced from the official development repository:

| Property | Value |
| :--- | :--- |
| **Application Name** | Personal Expense Tracker |
| **Source Repository** | `https://github.com/mzewdie/pet_development_agent.git` |
| **Branch** | `main` |
| **Authoritative Commit SHA** | `3864c379f1a6cbddbe7cdfe08d1858f056f681aa` |
| **Commit Subject** | `feat(ui): improve expense form UX and styling` |
| **Commit Timestamp** | `2026-09-09 23:44:51 +0200` |
| **Integrity Status** | 100% Unmodified (`git status` reports 0 tracked modifications) |

---

## 3. Architecture & Port Allocation Strategy (Port 3002)

### Why Host Port 3002?
Standard development environments (Vite, Next.js, Create React App, Express) frequently bind to port `3000`. To prevent frustrating port-binding collisions (`EADDRINUSE`) when developers or testing coordinators run local services simultaneously:
- **Host Interface**: Mapped to **`3002`** (accessible at `http://localhost:3002`).
- **Container Interface**: Operates on port **`3000`** internally, preserving strict zero-modification compliance with the delivered application's `server.ts`.
- **Backend Internal Interface**: Python FastAPI binds strictly to **`127.0.0.1:8001`** inside the container and is never exposed directly to the outside network.

```
                  [ Host Machine / Coordinator Browser ]
                                     │
                             HTTP Port 3002
                                     ▼
         ┌─────────────────────────────────────────────────────────┐
         │                 Docker Container                        │
         │           (Mapped: -p 3002:3000)                        │
         │                                                         │
         │   ┌─────────────────────────────────────────────────┐   │
         │   │   Unified Express Server (server.ts)            │   │
         │   │   Listens internally on Port 3000               │   │
         │   └──────┬───────────────────────────────────┬──────┘   │
         │          │                                   │          │
         │  Routes: /api/*, /docs                       │ Static   │
         │  (Reverse proxy to localhost:8001)           │ files    │
         │          │                                   │ (dist/)  │
         │          ▼                                   ▼          │
         │   ┌────────────────────────────┐    ┌───────────────┐   │
         │   │  FastAPI Backend (Python)  │    │ React 19 SPA  │   │
         │   │  Bound to 127.0.0.1:8001   │    │ Static Assets │   │
         │   └──────────────┬─────────────┘    └───────────────┘   │
         │                  │                                      │
         │                  ▼                                      │
         │   ┌────────────────────────────┐                        │
         │   │      SQLite Database       │                        │
         │   │   (/app/data/expenses.db)  │                        │
         │   └────────────────────────────┘                        │
         └─────────────────────────────────────────────────────────┘
```

---

## 4. Master Deployment Dashboard (Interactive Console)

This project features an interactive, real-time **Master Deployment Dashboard** accessible via the browser. It provides total operational observability over the deployment lifecycle, automated verification, container configurations, and execution logs.

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  MASTER DEPLOYMENT AGENT       [ SUCCESS ]  Target: Docker Engine / Compose    │
├────────────────────────────────────────────────────────────────────────────────┤
│  STATUS: SUCCESS — Verified Operational (Commit: 3864c379... / Main)          │
├────────────────────────────────────────────────────────────────────────────────┤
│  WORKFLOW WIZARD:                                                              │
│  [1. UNDERSTAND] → [2. INGEST] → [3. IDENTIFY REF] → ... → [10. REPORT]        │
├──────────────────────────────────────┬─────────────────────────────────────────┤
│  5-POINT VERIFICATION MATRIX         │  COORDINATOR CONFIGURATION FORM         │
│  ✔ Containers Start                  │  Repo: https://github.com/.../pet_...   │
│  ✔ Required Ports Bound (Port 3002)  │  Commit Ref: 3864c379f1...             │
│  ✔ Frontend Responds                 │  Host Port: 3002                        │
│  ✔ API Health Endpoint Responds      │  Image: pet-app:local-test              │
│  ✔ Required Services Communicate     │  [ Re-run Verification Pipeline ]       │
├──────────────────────────────────────┴─────────────────────────────────────────┤
│  DEPLOYMENT ARTIFACTS & AUDIT LOGS                                             │
│  [ Dockerfile ]  [ docker-compose.yml ]  [ DEPLOYMENT.md ]  [ Spec ]  [ Logs ] │
│  (One-click clipboard copy, syntax highlighted previews, and runtime logs)     │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Dashboard Core Capabilities:

1. **Live Deployment Status & Target Banner**:
   - Dynamic health indicator showing `SUCCESS`, `BUILDING`, or `AWAITING_INPUT`.
   - Authoritative delivery repository metadata, target commit SHA, and zero-modification guarantee status.

2. **10-Step Workflow Lifecycle Tracker**:
   - Visual progress pipeline tracing:
     `UNDERSTAND` → `INGEST` → `IDENTIFY REF` → `PREPARE` → `INSPECT` → `BUILD DOCKER` → `RUN CONTAINER` → `VERIFY HEALTH` → `DOCUMENT` → `REPORT`.
   - Highlights the current stage and displays detailed descriptions of the automated tasks completed at each phase.

3. **5-Point Verification Matrix**:
   - **Containers Start**: Confirms Node 20 & Python 3.10 multi-stage container readiness with entrypoint `node dist/server.cjs`.
   - **Required Ports Bound (Port 3002)**: Validates host port `3002` mapped to container `3000` to avoid local dev port collisions, with internal FastAPI loopback on `127.0.0.1:8001`.
   - **Frontend Responds**: Confirms Vite production bundle generation (`dist/index.html`, CSS, and JavaScript bundles).
   - **API Health Endpoint Responds**: Verifies FastAPI `/api/health` returns `HTTP 200 OK` with SQLite database connectivity.
   - **Required Services Communicate**: Validates the internal Express reverse-proxy communication with FastAPI.

4. **Coordinator Delivery Intake & Controller**:
   - Allows human coordinators to review or change the repository URL, commit/branch ref, Docker image name, host port (`3002`), and environment variables.
   - Includes a **"Re-run Verification Pipeline"** button to simulate and re-verify the deployment steps dynamically.

5. **Multi-Tab Artifact & Runbook Inspector**:
   - Interactive tabbed viewer with one-click clipboard copy for:
     - `Dockerfile` (Multi-stage build recipe).
     - `docker-compose.yml` (Compose orchestration with `3002:3000` port mapping and persistent volumes).
     - `DEPLOYMENT.md` (Self-contained reproduction runbook and operational checklist).
     - `specification_deployment.md` (Official deployment protocol standards).

6. **Chronological Audit Log Stream**:
   - Timestamped log entries recording each stage of execution (`INIT`, `INTEGRITY`, `CLONE`, `VERSION`, `INSPECT`, `BACKEND`, `BUILD`, `DOCKER`, `DOCUMENT`).
   - Visual log tags distinguishing info, success, and warning levels.

7. **Formal Markdown Deployment Report**:
   - Formatted view and raw Markdown export generating formal deployment audit documentation for stakeholders and coordinators.

---

## 5. Repository Structure

```
├── Dockerfile                   # Multi-stage production container build definition
├── docker-compose.yml           # Compose orchestration with 3002:3000 port mapping & volume
├── .dockerignore                # Build context exclusion rules
├── DEPLOYMENT.md                # Formal deployment manual & verification log
├── README.md                    # Project documentation (this file)
├── specification_deployment.md  # Formal deployment protocol & verification standards
├── package.json                 # Dashboard UI dependencies and build scripts
├── vite.config.ts               # Vite bundler configuration for the dashboard
├── index.html                   # Entry point for the deployment dashboard
├── src/                         # Deployment Agent Dashboard source code
│   ├── App.tsx                  # Main console view, state management & layout
│   ├── types.ts                 # Shared TypeScript interfaces & models
│   └── components/
│       ├── Header.tsx           # Status badge, target system, and action controls
│       ├── VerificationList.tsx # 5-point verification matrix with status chips
│       ├── DeploymentDocViewer.tsx # Interactive viewer for Dockerfile, compose, DEPLOYMENT.md
│       ├── ReportViewer.tsx     # Formal markdown deployment report generator
│       ├── StepWizard.tsx       # 10-step deployment pipeline tracker
│       ├── DeploymentForm.tsx   # Coordinator configuration and execution triggers
│       └── LogViewer.tsx        # Structured deployment event stream
└── delivery_repo/               # The delivered application clone (Strict zero-modification)
    ├── backend/                 # FastAPI backend application & SQLite queries
    ├── src/                     # React application source code
    ├── server.ts                # Express reverse proxy and process supervisor
    ├── package.json             # Application dependencies & build pipeline
    ├── Readme.md                # Delivered application readme (strictly unmodified)
    └── tests/                   # Pytest backend test suite
```

---

## 6. Prerequisites

Ensure your host machine has the following tools installed:

### For Docker Deployment (Recommended)
- **Docker Engine**: version 24.0 or later
- **Docker Compose**: version 2.20 or later (or Docker Desktop on macOS/Windows)

### For Bare-Metal Local Execution
- **Node.js**: version 20.x or 22.x LTS
- **Python**: version 3.10 or later with `pip`
- **SQLite3**: version 3.35 or later
- **Git**: version 2.30 or later

---

## 7. Quick Start: Docker Deployment (Recommended)

The application is deployed on host port **`3002`** to avoid port collisions with your local development tools.

### Method A: Using Docker Compose

```bash
# 1. Build and launch the container in the background
docker compose up -d --build

# 2. View container startup logs
docker compose logs -f

# 3. Verify deployment health on port 3002
curl -i http://localhost:3002/api/health
```

### Method B: Using Standalone Docker CLI

```bash
# 1. Build the production Docker image
docker build -t pet-app:local-test .

# 2. Run the container exposing host port 3002
docker run -d \
  --name pet-app-local \
  -p 3002:3000 \
  -v pet-data:/app/data \
  pet-app:local-test

# 3. Check container logs
docker logs -f pet-app-local

# 4. Verify deployment health on port 3002
curl -i http://localhost:3002/api/health
```

### Stopping and Cleaning Up
```bash
# When using Docker Compose:
docker compose down

# When using Standalone Docker:
docker stop pet-app-local && docker rm pet-app-local
```

---

## 8. Alternative: Bare-Metal Local Execution

If you wish to execute the delivered application directly on your host machine without Docker:

### Step 1: Set Up the Python Backend Runtime
```bash
# Navigate to the delivered repository
cd delivery_repo

# Create and activate a Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install required Python dependencies
pip install fastapi==0.115.6 uvicorn==0.34.0 pydantic==2.10.4
```

### Step 2: Install Node Dependencies & Build Frontend
```bash
# Install Node dependencies
npm ci

# Build the React frontend and bundle the Express server (dist/server.cjs)
npm run build
```

### Step 3: Launch the Unified Server
```bash
# Run the bundled production server
node dist/server.cjs
```
*Note: In bare-metal mode, the delivered server defaults to port 3000. In containerized mode (Docker), host port 3002 is mapped automatically.*

---

## 9. Running the Deployment Agent Dashboard Locally

To run the interactive Deployment Dashboard on your local machine:

```bash
# 1. Install dashboard dependencies
npm install

# 2. Start the Vite development server
npm run dev
```

Open your browser to `http://localhost:3000` (in the agent sandbox, Vite runs on port 3000 for the preview interface).

---

## 10. Verification & Health Checks

Once the Docker container is running, execute the following commands to verify all layers:

### 1. API Health Check (Port 3002)
```bash
curl -i http://localhost:3002/api/health
```
**Expected Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{"status":"healthy","service":"Personal Expense Tracker API","version":"1.0.0","database":"SQLite","expense_count":0}
```

### 2. Frontend Web Application Verification (Port 3002)
```bash
curl -i http://localhost:3002/
```
**Expected Response:**
```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8

<!doctype html>
<html lang="en">
...
<title>Personal Expense Tracker</title>
```

### 3. Interactive OpenAPI Documentation (Swagger UI)
Visit `http://localhost:3002/docs` in your browser to test the interactive API endpoints.

### 4. Running Backend Unit Tests (Pytest)
```bash
cd delivery_repo
python3 -m pytest tests/
```

---

## 11. Configuration & Environment Variables

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` (Container) | `3000` | Port on which the unified Express server listens inside the container. |
| **Host Port** | **`3002`** | Port bound on the host machine to avoid collisions with dev port 3000. |
| `NODE_ENV` | `production` | Node execution environment mode. |
| `PYTHONUNBUFFERED` | `1` | Ensures Python logs are flushed to standard output immediately. |
| `EXPENSE_DB_PATH` | `./expenses.db` | *(Optional)* Custom filesystem path for SQLite database file. |

---

## 12. Strict Zero-Modification Guarantee

Per deployment safety guidelines:
1. **Application Source Code**: `backend/`, `src/`, `server.ts`, and `tests/` in the delivery repository were **not altered**.
2. **Authoritative Readme**: `delivery_repo/Readme.md` provided by the original developer was **strictly preserved**.
3. **Packaging Isolation**: All containerization logic resides in isolated configuration files (`Dockerfile`, `docker-compose.yml`, `.dockerignore`) and the master deployment harness.

---

## 13. Troubleshooting & FAQ

### Q: Why is host port 3002 used instead of 3000?
**A**: Port 3000 is widely used as the default by development servers (Vite, Next.js, CRA, Express). Using host port **3002** allows the containerized production app to run simultaneously alongside any active development environments without port conflict errors (`EADDRINUSE`).

### Q: Can I change the host port to another port (e.g., 8080)?
**A**: Yes. You can change the port mapping in `docker-compose.yml` (e.g. `"8080:3000"`) or via Docker CLI:
```bash
docker run -d --name pet-app-local -p 8080:3000 pet-app:local-test
```

### Q: Does the SQLite database persist when the Docker container restarts?
**A**: Yes. The `docker-compose.yml` mounts a persistent Docker volume (`pet-data`) to `/app/data` to ensure all logged expenses and categories survive container restarts and updates.

### Q: How do I view logs from both Node and Python?
**A**: Run `docker logs -f pet-app-local`. Because `server.ts` manages the FastAPI process and pipes its standard output/error, both Node and Python logs appear unified in the container stdout.

---

## License
MIT License. Created for the Personal Expense Tracker (PET Development) deployment pipeline.
