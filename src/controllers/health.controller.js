import { HealthService } from '../services/health.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Controller to handle health check requests
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getHealth = (req, res, next) => {
  try {
    const healthData = HealthService.getHealthStatus();
    return sendSuccess(res, 'Application is healthy and running', healthData, 200);
  } catch (error) {
    next(error);
  }
};
