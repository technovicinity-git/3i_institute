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
      {
        url: 'https://threei-institute.onrender.com',
        description: `Production server`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token from the login response',
        },
      },
      schemas: {
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login successful' },
            data: {
              type: 'object',
              properties: {
                user: { type: 'object' },
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
              },
            },
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
  },
  apis: ['./src/modules/**/routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
