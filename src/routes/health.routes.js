import { Router } from 'express';
import { getHealth } from '../controllers/health.controller.js';

const router = Router();

/**
 * @route   GET /health or /api/v1/health
 * @desc    Checks application health and diagnostic info
 * @access  Public
 */
router.get('/', getHealth);

export default router;
