import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validate } from '../middleware/validate';
import { 
    createUserSchema, 
    updateUserSchema, 
    idParamSchema,
    paginationQuerySchema 
} from '../dto/user.dto';
import { asyncHandler } from '../utils/asyncHandler';
import { authMiddleware } from '../middleware/auth';

export const userRoutes = Router();

// GET /api/users - List all users (paginated)
userRoutes.get(
    '/',
    authMiddleware,
    validate(paginationQuerySchema, 'query'),
    asyncHandler(UserController.getAll)
);

// GET /api/users/:id - Get user by ID
userRoutes.get(
    '/:id',
    authMiddleware,
    validate(idParamSchema, 'params'),
    asyncHandler(UserController.getById)
);

// POST /api/users - Create user
userRoutes.post(
    '/',
    validate(createUserSchema),
    asyncHandler(UserController.create)
);

// PUT /api/users/:id - Update user
userRoutes.put(
    '/:id',
    authMiddleware,
    validate(idParamSchema, 'params'),
    validate(updateUserSchema),
    asyncHandler(UserController.update)
);

// DELETE /api/users/:id - Delete user
userRoutes.delete(
    '/:id',
    authMiddleware,
    validate(idParamSchema, 'params'),
    asyncHandler(UserController.delete)
);
