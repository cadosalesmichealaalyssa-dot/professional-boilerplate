import 'reflect-metadata';  // MUST be first!
import express from 'express';
import { config } from './config/env';
import { AppDataSource } from './config/data-source';
import { logger } from './utils/logger';

// Middleware
import { 
    helmetMiddleware, 
    corsMiddleware, 
    apiLimiter 
} from './middleware/security';
import { requestLoggingMiddleware } from './middleware/requestLogger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Routes
import { userRoutes } from './routes/userRoutes';
import { healthRoutes } from './routes/healthRoutes';
import { authRoutes } from './routes/authRoutes';

const app = express();

// === GLOBAL MIDDLEWARE (order matters!) ===

// 1. Trust proxy (if behind load balancer)
app.set('trust proxy', 1);

// 2. Security headers
app.use(helmetMiddleware);

// 3. CORS
app.use(corsMiddleware);

// 4. Body parsing
app.use(express.json({ limit: '10kb' }));  // Limit body size
app.use(express.urlencoded({ extended: true }));

// 5. Rate limiting
app.use('/api/', apiLimiter);

// 6. Request logging
app.use(requestLoggingMiddleware);

// === ROUTES ===

app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// === ERROR HANDLING (must be last) ===

app.use(notFoundHandler);
app.use(errorHandler);

// === SERVER STARTUP ===

const startServer = async () => {
    try {
        // Initialize database
        await AppDataSource.initialize();
        logger.info('✅ Database connected successfully');
        
        // Run migrations in production
        if (config.isProd) {
            await AppDataSource.runMigrations();
            logger.info('✅ Migrations executed');
        }
        
        // Start server
       const server = app.listen(config.port, () => {
            logger.info(`🚀 Server running on port ${config.port}`);
            logger.info(`📝 Environment: ${config.env}`);
            logger.info(`🔗 Healthcheck: http://localhost:${config.port}/health`);
        });
        
        // Graceful shutdown
        const gracefulShutdown = async (signal: string) => {
            logger.info(`${signal} received. Starting graceful shutdown...`);
            
            server.close(async () => {
                logger.info('HTTP server closed');
                
                await AppDataSource.destroy();
                logger.info('Database connection closed');
                
                logger.info('✅ Graceful shutdown complete');
                process.exit(0);
            });
            
            // Force shutdown after 10 seconds
            setTimeout(() => {
                logger.error('Forced shutdown due to timeout');
                process.exit(1);
            }, 10000);
        };
        
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        
    } catch (error) {
        logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
