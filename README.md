# Sample Node.js REST API

A clean, production-ready Node.js boilerplate following industry standard layered architecture, modern ES modules, security best practices, and a health check API.

---

## 📁 Project Architecture & Folder Structure

```text
sample-nodejs-project/
├── .env                  # Local environment configuration (git ignored)
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules for node_modules, logs, and env
├── package.json          # Project manifest and scripts
├── README.md             # Project documentation
└── src/
    ├── app.js            # Express app configuration & middleware pipeline
    ├── server.js         # HTTP server entry point & graceful shutdown handling
    ├── config/
    │   └── env.js        # Centralized environment variable parsing & validation
    ├── controllers/
    │   └── health.controller.js  # Controller managing health check request/response
    ├── services/
    │   └── health.service.js     # Business logic & system diagnostics (uptime, memory, etc.)
    ├── routes/
    │   ├── index.js              # Aggregated v1 router
    │   └── health.routes.js      # Health check route definitions
    ├── middlewares/
    │   ├── errorHandler.js       # Centralized global error handling middleware
    │   └── notFound.js           # 404 handler for unmatched routes
    └── utils/
        ├── apiResponse.js        # Standardized API response format helper
        └── logger.js             # Structured console logger
```

### Why this structure?
- **Separation of Concerns**: Routes define paths, controllers handle HTTP requests/responses, and services encapsulate business logic.
- **Scalability**: Adding new modules (e.g. `users`, `products`, `auth`) only requires adding a route, controller, and service without cluttering entry files.
- **Resilience**: Features centralized error handling, 404 interception, and graceful shutdown handlers for `SIGINT` / `SIGTERM`.
- **Security First**: Pre-configured with [Helmet](https://helmetjs.github.io/) for HTTP security headers and [CORS](https://expressjs.com/en/resources/middleware/cors.html).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended, compatible with Node 20 / 22 / 24+)
- npm

### Installation
```bash
npm install
```

### Development Mode (with native auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

---

## 📡 API Endpoints

### 1. Health Check
Checks application status, system uptime, and memory statistics. Useful for Kubernetes liveness/readiness probes, Docker health checks, and AWS ALB targets.

- **Route:** `GET /api/v1/health` (also accessible at `GET /health`)
- **Status:** `200 OK`
- **Response Format:**
```json
{
  "success": true,
  "message": "Application is healthy and running",
  "data": {
    "status": "healthy",
    "timestamp": "2026-10-25T08:27:56.196Z",
    "uptime": {
      "seconds": 22,
      "humanReadable": "22s"
    },
    "environment": "development",
    "runtime": {
      "nodeVersion": "v24.20.0",
      "platform": "linux",
      "pid": 11893
    },
    "memory": {
      "rssMb": 66,
      "heapTotalMb": 17.53,
      "heapUsedMb": 9.22
    }
  }
}
```

### 2. Root Overview
- **Route:** `GET /`
- **Status:** `200 OK`
- **Response Format:**
```json
{
  "name": "Sample Node.js REST API",
  "version": "1.0.0",
  "documentation": "/api/v1",
  "healthCheck": "/api/v1/health"
}
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` to customize settings:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Port on which the HTTP server listens (overridden by `DATABRICKS_APP_PORT` in Databricks Apps) |
| `NODE_ENV` | `development` | Runtime environment (`development` / `production`) |
| `CORS_ORIGIN` | `*` | Allowed CORS origins (e.g. `*` or `http://localhost:5173`) |

---

## ☁️ Deploying to Databricks Apps

This project is pre-configured for **Databricks Apps**:
- **[app.yaml](file:///home/user/Desktop/sample%20nodejs%20project/app.yaml)**: Manifest file specifying `npm run start` and production environment.
- **Dynamic Port**: Binds to `process.env.DATABRICKS_APP_PORT` injected automatically by Databricks Apps.
- **Host Binding**: Binds to `0.0.0.0` as required by the Databricks reverse proxy.
- **Reverse Proxy Support**: `app.set('trust proxy', true)` configured in `src/app.js`.

### Method A: Deploy via Databricks Workspace UI
1. Push this project to your Git repository (GitHub, GitLab, Bitbucket, Azure DevOps).
2. Open your Databricks Workspace.
3. In the sidebar, navigate to **Compute** > **Apps** (or click **Apps** in the navigation menu).
4. Click **Create App**.
5. Name your app (e.g., `sample-nodejs-api`).
6. Under **Source code**, choose:
   - **Git provider**: Link your repository and branch, OR
   - **Workspace files**: Upload/sync your project directory to `/Workspace/Users/<your-email>/sample-nodejs-project`.
7. Click **Create** / **Deploy**. Databricks will run `npm install` and start your app using `app.yaml`.
8. Once status is **Running**, click the app URL. Test `/api/v1/health`.

### Method B: Deploy via Databricks CLI
```bash
# 1. Authenticate CLI (if not already authenticated)
databricks configure

# 2. Create the app skeleton in your workspace
databricks apps create sample-nodejs-api --description "Node.js REST API"

# 3. Sync and deploy your local code
databricks apps deploy sample-nodejs-api --source-code-path /Workspace/Users/<your-email>/sample-nodejs-project
```

### Method C: Deploy via Databricks Asset Bundles (DABs)
```bash
# Validate bundle configuration
databricks bundle validate

# Deploy bundle resources to Databricks
databricks bundle deploy

# Run / start the app
databricks bundle run sample_nodejs_api
```
