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
import userRoutes from '@/modules/users/routes';
import teacherRoutes from '@/modules/teachers/routes';
import studentRoutes from '@/modules/students/routes';
import topicRoutes from '@/modules/topics/routes';
import subjectRoutes from '@/modules/subjects/routes';
import courseRoutes from '@/modules/courses/routes';
import batchRoutes from '@/modules/batches/routes';
import enrollmentRoutes from '@/modules/enrollments/routes';
import wishlistRoutes from '@/modules/wishlist/routes';
import noteRoutes from '@/modules/notes/routes';
import materialRoutes from '@/modules/materials/routes';
import questionRoutes from '@/modules/questions/routes';
import examRoutes from '@/modules/exams/routes';
import certificateRoutes from '@/modules/certificates/routes';
import waiverRoutes from '@/modules/waiver/routes';
import reportRoutes from '@/modules/reports/routes';
import chatRoutes from '@/modules/chat/routes';
import notificationRoutes from '@/modules/notifications/routes';

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
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/teachers', teacherRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/topics', topicRoutes);
app.use('/api/v1/subjects', subjectRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/batches', batchRoutes);
app.use('/api/v1/enrollments', enrollmentRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/notes', noteRoutes);
app.use('/api/v1/materials', materialRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/certificates', certificateRoutes);
app.use('/api/v1/waiver', waiverRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/notifications', notificationRoutes);

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
