import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './app';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: config.app.name,
      version: '1.0.0',
      description: 'API Documentation for 3i International Islamic Institute',
    },
    servers: [
      {
        url: config.app.url,
        description: `${config.app.env} server`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/modules/**/routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
