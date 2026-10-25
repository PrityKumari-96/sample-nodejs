import { Router } from 'express';
import healthRoutes from './health.routes.js';

const apiRouter = Router();

// Mount feature routes
apiRouter.use('/health', healthRoutes);

// You can add more modular routes here as your application grows:
// apiRouter.use('/users', userRoutes);
// apiRouter.use('/auth', authRoutes);

export default apiRouter;
