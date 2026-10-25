import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env.js';
import apiRouter from './routes/index.js';
import healthRoutes from './routes/health.routes.js';
import { notFoundHandler } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Trust reverse proxy (required for Databricks Apps reverse proxy)
app.set('trust proxy', true);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.corsOrigin === '*' ? '*' : config.corsOrigin.split(','),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// HTTP request logging
app.use(morgan(config.isProduction ? 'combined' : 'dev'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Sample Node.js REST API',
    version: '1.0.0',
    documentation: '/api/v1',
    healthCheck: '/api/v1/health',
  });
});

// Direct top-level health check (ideal for Docker / K8s / Cloud load balancers)
app.use('/health', healthRoutes);

// Versioned API routes
app.use('/api/v1', apiRouter);

// Catch 404 routes
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

export default app;
