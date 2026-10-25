import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust reverse proxy (required for Databricks Apps proxy routing)
app.set('trust proxy', true);

const port = parseInt(process.env.DATABRICKS_APP_PORT || process.env.PORT || '3000', 10);
const host = process.env.HOST || '0.0.0.0';
const distPath = path.join(__dirname, 'dist');

// Health check endpoint for Databricks Apps & container probes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'frontend',
  });
});

// Serve static assets from Vite build directory
app.use(
  express.static(distPath, {
    maxAge: '1y',
    setHeaders: (res, filePath) => {
      // Do not cache index.html so updates/re-deployments are served immediately
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  })
);

// SPA fallback: Route all other requests to index.html for client-side routing
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, host, () => {
  console.log(`🚀 Frontend server listening on http://${host}:${port}`);
  console.log(`👉 Health check: http://${host}:${port}/health`);
});
