import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { config } from '@/config/app';
import { swaggerSpec } from '@/config/swagger';
import { errorHandler } from '@/common/middleware/error-handler';
import { generalLimiter } from '@/common/middleware/rate-limiter';
import authRoutes from '@/modules/auth/routes';

const app: express.Express = express();

// Security
app.use(helmet());
app.use(
  cors({
    origin: config.app.clientUrl,
    credentials: true,
  }),
);

// Rate limiting
app.use('/api/', generalLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing
app.use(cookieParser());

// Compression
app.use(compression());

// Logging
if (config.app.env === 'development') {
  app.use(morgan('dev'));
}

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/v1/auth', authRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use(errorHandler);

export default app;
