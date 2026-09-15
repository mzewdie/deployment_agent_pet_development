# Master Deployment & Delivery Verification System

> **Automated Containerization, Deployment Orchestration, and Zero-Modification Verification for the Personal Expense Tracker (PET)**

[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Table of Contents
1. [Overview](#overview)
2. [Delivered Application Specification](#delivered-application-specification)
3. [Architecture Breakdown](#architecture-breakdown)
4. [Repository Structure](#repository-structure)
5. [Prerequisites](#prerequisites)
6. [Quick Start: Docker Deployment (Recommended)](#quick-start-docker-deployment-recommended)
7. [Alternative: Bare-Metal Local Execution](#alternative-bare-metal-local-execution)
8. [Running the Deployment Agent Dashboard](#running-the-deployment-agent-dashboard)
9. [Verification & Health Checks](#verification--health-checks)
10. [Configuration & Environment Variables](#configuration--environment-variables)
11. [Strict Zero-Modification Guarantee](#strict-zero-modification-guarantee)
12. [Troubleshooting & FAQ](#troubleshooting--faq)

---

## 1. Overview

This project provides an automated, reproducible deployment system and live verification harness for the **Personal Expense Tracker (PET)** full-stack application.

Key responsibilities fulfilled by this project:
- **Zero-Modification Packaging**: Generates production-ready Docker deployment artifacts (`Dockerfile`, `docker-compose.yml`, `.dockerignore`) without altering any delivered application source code or documentation.
- **Unified Multi-Runtime Orchestration**: Builds and runs a containerized dual-runtime environment containing both Node.js (Vite frontend + Express reverse proxy) and Python (FastAPI + SQLite).
- **Automated Verification Harness**: Validates build pipelines, internal inter-process communication, API health status, and UI serving.
- **Interactive Deployment Dashboard**: Provides a real-time web console displaying verification checks, build stage progression, raw logs, and deployment documentation.

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

## 3. Architecture Breakdown

The delivered application follows a cohesive full-stack architecture running behind a single unified port (`3000`):

```
                        [ Client / Browser ]
                                 │
                         HTTP Port 3000
                                 ▼
         ┌─────────────────────────────────────────────────┐
         │              Docker Container                   │
         │                                                 │
         │   ┌─────────────────────────────────────────┐   │
         │   │   Unified Express Server (server.ts)    │   │
         │   └──────┬───────────────────────────┬──────┘   │
         │          │                           │          │
         │  Routes: /api/*, /docs               │ All other│
         │          │                           │ routes   │
         │          ▼                           ▼          │
         │   ┌────────────────────┐    ┌───────────────┐   │
         │   │  FastAPI Backend   │    │ Static Assets │   │
         │   │ (127.0.0.1:8001)   │    │ (dist/)       │   │
         │   └────────┬───────────┘    │ React 19 SPA  │   │
         │            │                └───────────────┘   │
         │            ▼                                    │
         │   ┌────────────────────┐                        │
         │   │  SQLite Database   │                        │
         │   │   (expenses.db)    │                        │
         │   └────────────────────┘                        │
         └─────────────────────────────────────────────────┘
```

1. **Frontend (React 19 + TypeScript + Tailwind CSS v4)**:
   - Client-side single page application built with Vite.
   - Interactive expense management, categorisation, filtering, and summary statistics.
2. **Backend (Python 3.10+ + FastAPI + Pydantic v2)**:
   - High-performance asynchronous REST API.
   - Manages CRUD operations for expenses, analytics aggregation, and validation.
   - SQLite persistence layer configured with Write-Ahead Logging (WAL) and foreign key integrity.
3. **Unified Server (`server.ts` compiled to `dist/server.cjs`)**:
   - Express server acting as a reverse proxy and static asset server.
   - Automatically launches and monitors the Python FastAPI backend process on `127.0.0.1:8001`.
   - Proxies `/api/*`, `/docs`, and `/openapi.json` to FastAPI.
   - Serves the compiled React frontend for all other requests.

---

## 4. Repository Structure

```
├── Dockerfile                   # Multi-stage production container build definition
├── docker-compose.yml           # Compose orchestration with SQLite data volume
├── .dockerignore                # Build context exclusion rules
├── DEPLOYMENT.md                # Formal deployment manual & verification log
├── README.md                    # Project documentation
├── specification_deployment.md  # Formal deployment protocol & verification standards
├── package.json                 # Dashboard UI dependencies and build scripts
├── vite.config.ts               # Vite bundler configuration for the dashboard
├── index.html                   # Entry point for the deployment dashboard
├── src/                         # Deployment Agent Dashboard source code
│   ├── App.tsx                  # Main console view with tabs & controls
│   ├── types.ts                 # Shared TypeScript interfaces & models
│   └── components/
│       ├── Header.tsx           # Status badge and action bar
│       ├── VerificationList.tsx # 5-point verification matrix
│       ├── DeploymentDocViewer.tsx # Interactive viewer for Dockerfile, compose, DEPLOYMENT.md
│       ├── ReportViewer.tsx     # Formal markdown deployment report generator
│       ├── StepWizard.tsx       # 10-step deployment pipeline tracker
│       └── LogViewer.tsx        # Structured deployment event stream
└── delivery_repo/               # The delivered application clone (Strict zero-modification)
    ├── backend/                 # FastAPI backend application & SQLite queries
    ├── src/                     # React application source code
    ├── server.ts                # Express reverse proxy and process supervisor
    ├── package.json             # Application dependencies & build pipeline
    ├── Readme.md                # Delivered application readme (unmodified)
    └── tests/                   # Pytest backend test suite
```

---

## 5. Prerequisites

Before executing the project, ensure your host machine has the following tools installed:

### For Docker Deployment (Recommended)
- **Docker Engine**: version 24.0 or later
- **Docker Compose**: version 2.20 or later (or Docker Desktop on macOS/Windows)

### For Bare-Metal Local Execution
- **Node.js**: version 20.x or 22.x LTS
- **Python**: version 3.10 or later with `pip`
- **SQLite3**: version 3.35 or later
- **Git**: version 2.30 or later

---

## 6. Quick Start: Docker Deployment (Recommended)

The application has been fully containerized using a clean, reproducible multi-stage build.

### Method A: Using Docker Compose

```bash
# 1. Clone or navigate to the project directory
cd /path/to/project

# 2. Build and launch the container in the background
docker compose up -d --build

# 3. View container startup logs
docker compose logs -f

# 4. Verify deployment health
curl -i http://localhost:3000/api/health
```

### Method B: Using Standalone Docker CLI

```bash
# 1. Build the production Docker image
docker build -t pet-app:local-test .

# 2. Run the container exposing port 3000
docker run -d \
  --name pet-app-local \
  -p 3000:3000 \
  -v pet-data:/app/data \
  pet-app:local-test

# 3. Check container logs
docker logs -f pet-app-local

# 4. Verify deployment health
curl -i http://localhost:3000/api/health
```

### Stopping and Cleaning Up
```bash
# When using Docker Compose:
docker compose down

# When using Standalone Docker:
docker stop pet-app-local && docker rm pet-app-local
```

---

## 7. Alternative: Bare-Metal Local Execution

If you wish to execute the delivered application directly on your host machine without Docker:

### Step 1: Set Up the Python Backend Runtime
```bash
# Navigate to the delivered repository
cd delivery_repo

# Create and activate a Python virtual environment (recommended)
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
*The Express server will automatically start the FastAPI backend on port `8001`, establish database connections, and serve the application on `http://localhost:3000`.*

---

## 8. Running the Deployment Agent Dashboard

This workspace includes an interactive, browser-based **Master Deployment Console** built with React and Tailwind CSS. The console visualizes the deployment lifecycle, verification steps, and operational health.

To launch the dashboard:

```bash
# 1. Install dashboard dependencies
npm install

# 2. Start the Vite development server
npm run dev
```

Open your browser to `http://localhost:3000` to interact with:
- **Verification Matrix**: Real-time status of container startup, port binding, frontend availability, API health, and inter-service routing.
- **Step Wizard**: Interactive 10-stage execution pipeline.
- **Artifact Inspector**: Live tabbed viewer for `Dockerfile`, `docker-compose.yml`, and `DEPLOYMENT.md` with one-click copy.
- **Audit Logs**: Chronological timestamped event stream of all deployment actions.
- **Formal Deployment Report**: Generate and export full markdown deployment audits.

---

## 9. Verification & Health Checks

Once running, execute the following commands to confirm that all layers of the application are fully functional:

### 1. API Health Check
```bash
curl -i http://localhost:3000/api/health
```
**Expected Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{"status":"healthy","service":"Personal Expense Tracker API","version":"1.0.0","database":"SQLite","expense_count":0}
```

### 2. Frontend Root Verification
```bash
curl -i http://localhost:3000/
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
Visit `http://localhost:3000/docs` in your browser to inspect and test the interactive API endpoints.

### 4. Running Backend Unit Tests (Pytest)
```bash
cd delivery_repo
python3 -m pytest tests/
```

---

## 10. Configuration & Environment Variables

The deployment requires zero mandatory secrets. The following standard environment variables are configured:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `3000` | Port on which the unified Express server listens. |
| `NODE_ENV` | `production` | Node execution environment mode. |
| `PYTHONUNBUFFERED` | `1` | Ensures Python logs are flushed to standard output immediately. |
| `EXPENSE_DB_PATH` | `./expenses.db` | *(Optional)* Custom filesystem path for SQLite database file. |

---

## 11. Strict Zero-Modification Guarantee

Per deployment safety guidelines:
1. **Application Source Code**: `backend/`, `src/`, `server.ts`, and `tests/` in the delivery repository were **not altered**.
2. **Authoritative Readme**: `delivery_repo/Readme.md` provided by the original developer was **strictly preserved**.
3. **Packaging Isolation**: All containerization logic resides in isolated configuration files (`Dockerfile`, `docker-compose.yml`, `.dockerignore`) and the master deployment harness.

---

## 12. Troubleshooting & FAQ

### Q: Port 3000 is already in use on my machine. How can I run the container?
**A**: When running the container, map a different host port to the container's port 3000:
```bash
# Map host port 8080 to container port 3000
docker run -d --name pet-app-local -p 8080:3000 pet-app:local-test
```
You can then access the application at `http://localhost:8080`.

### Q: Does the SQLite database persist when the Docker container restarts?
**A**: Yes. The `docker-compose.yml` mounts a persistent Docker volume (`pet-data`) to `/app/data` to ensure all logged expenses and categories survive container restarts and updates.

### Q: How do I view logs from both Node and Python?
**A**: Run `docker logs -f pet-app-local`. Because `server.ts` manages the FastAPI process and pipes its standard output/error, both Node and Python logs appear unified in the container stdout.

---

## License
MIT License. Created for the Personal Expense Tracker (PET Development) deployment pipeline.
