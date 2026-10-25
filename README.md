# React (Vite) Frontend on Databricks Apps

A React + TypeScript single-page application (SPA) pre-configured for deployment on **Databricks Apps**.

---

## 📁 Architecture Overview

```text
├── app.yaml              # Databricks Apps configuration (executes npm run start)
├── databricks.yml        # Databricks Asset Bundle (DAB) deployment manifest
├── package.json          # Root scripts delegating build and start to frontend/
├── .gitignore            # Ignores node_modules, build dist, and env files
└── frontend/
    ├── app.yaml          # Manifest if deploying directly from frontend folder
    ├── server.js         # Production Express server (binds to 0.0.0.0:${DATABRICKS_APP_PORT})
    ├── vite.config.ts    # Vite configuration with allowedHosts & port binding
    ├── package.json      # Dependencies (React 19, TypeScript, Express)
    ├── index.html        # App HTML entry
    └── src/              # React source code & components
```

---

## 🛠️ Databricks Apps Compatibility Features

1. **Build Lifecycle**: Databricks Apps automatically detects `package.json` and runs:
   1. `npm install`
   2. `npm run build` (`tsc -b && vite build` generates `dist/`)
   3. `npm run start` (`node frontend/server.js`)
2. **Reverse Proxy & Host Binding**:
   - Explicitly binds to `0.0.0.0` as required by the Databricks reverse proxy.
   - Dynamically reads `process.env.DATABRICKS_APP_PORT` injected by Databricks Apps.
   - Configured `app.set('trust proxy', true)` for Databricks routing headers.
3. **SPA Fallback Routing**: Unmatched routes are served `index.html` to allow client-side React routing without 404 errors.
4. **Health Check Endpoint**: Exposes `GET /health` responding with status `healthy` for platform container probes.

---

## 🚀 How to Deploy to Databricks Apps

### Option 1: Databricks Workspace UI *(Recommended)*
1. Push this branch (`feature/frontend-app`) to GitHub:
   ```bash
   git add .
   git commit -m "Configure frontend for Databricks Apps deployment"
   git push -u origin feature/frontend-app
   ```
2. In Databricks, go to **Compute** > **Apps** (or click **Apps** in sidebar).
3. Click **Create App** and enter a name (e.g. `cycle-frontend-app`).
4. Under **Source Code**:
   - Select **Git provider**, paste your repo URL (`https://github.com/PrityKumari-96/sample-nodejs.git`), and choose branch `feature/frontend-app`.
   - *(Optional: You can also choose Workspace files if you synced local files to `/Workspace/Users/<email>/sample-nodejs`).*
5. Click **Create** / **Deploy**. Databricks will install packages, run `npm run build`, and launch the app using `app.yaml`.
6. Once **Running**, click the app URL.

### Option 2: Databricks CLI
```bash
# 1. Create the app resource
databricks apps create cycle-frontend-app --description "Hero Cycle React Frontend"

# 2. Sync local directory to workspace files
databricks sync . /Workspace/Users/<your-email>/cycle-frontend-app

# 3. Deploy
databricks apps deploy cycle-frontend-app --source-code-path /Workspace/Users/<your-email>/cycle-frontend-app
```

---

## 💻 Local Development

```bash
# Run locally in dev mode
cd frontend
npm run dev

# Or build and test the production server locally
npm run build
npm run start
```