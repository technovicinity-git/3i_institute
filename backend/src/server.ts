import app from './app';
import { config } from '@/config/app';

const startServer = async () => {
  try {
    app.listen(config.app.port, () => {
      console.info(`🚀 Server running on ${config.app.url}`);
      console.info(`📚 API Docs available at ${config.app.url}/api-docs`);
      console.info(`🌍 Environment: ${config.app.env}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (error: Error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();
