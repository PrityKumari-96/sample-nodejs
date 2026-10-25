import { sendError } from '../utils/apiResponse.js';

export const notFoundHandler = (req, res, _next) => {
  return sendError(res, `Cannot ${req.method} ${req.originalUrl} - Route not found`, 404);
};
