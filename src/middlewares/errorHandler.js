import { logger } from '../utils/logger.js';
import { sendError } from '../utils/apiResponse.js';
import { config } from '../config/env.js';

export const errorHandler = (err, req, res, _next) => {
  logger.error(`Error processing request [${req.method}] ${req.originalUrl}:`, err.stack || err.message);

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const message = err.message || 'Internal Server Error';

  const errors = config.isDevelopment
    ? {
        stack: err.stack,
        details: err.details || null,
      }
    : null;

  return sendError(res, message, statusCode, errors);
};
