import dotenv from 'dotenv';

// Load .env variables
dotenv.config();

export const config = {
  port: parseInt(process.env.DATABRICKS_APP_PORT || process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};
