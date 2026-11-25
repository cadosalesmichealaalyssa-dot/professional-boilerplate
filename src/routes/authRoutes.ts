import { Router } from 'express';
import { AuthController } from '../controllers/authControllers';
import { validate } from '../middleware/validate';
import { loginSchema } from '../dto/auth.dto';
import { asyncHandler } from '../utils/asyncHandler';
import { authMiddleware } from '../middleware/auth';
import { verificationRoutes } from './verificationRoutes';

export const authRoutes = Router();

authRoutes.use('/', verificationRoutes);

authRoutes.post('/forgot-password', asyncHandler(AuthController.forgotPassword));
authRoutes.post('/reset-password', asyncHandler(AuthController.resetPassword));

// POST /api/auth/login - Public endpoint
authRoutes.post(
  '/login',
  validate(loginSchema),
  asyncHandler(AuthController.login)
);

// GET /api/auth/me - Protected endpoint (requires token)
authRoutes.get(
  '/me',
  authMiddleware,
  asyncHandler(AuthController.getMe)
);