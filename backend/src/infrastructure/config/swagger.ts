import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bookmark Manager API',
      version: '1.0.0',
      description: 'API for managing bookmarks, including creation, retrieval, updates, and deletion.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Bookmark: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'The unique identifier for the bookmark',
            },
            url: {
              type: 'string',
              format: 'uri',
              description: 'The URL of the bookmark',
            },
            title: {
              type: 'string',
              description: 'The title of the bookmark',
            },
            description: {
              type: 'string',
              description: 'A brief description of the bookmark',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'List of tags associated with the bookmark',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time the bookmark was created',
            },
          },
        },
        CreateBookmarkDto: {
          type: 'object',
          required: ['url', 'title'],
          properties: {
            url: {
              type: 'string',
              format: 'uri',
              example: 'https://google.com',
            },
            title: {
              type: 'string',
              example: 'Google',
            },
            description: {
              type: 'string',
              example: 'The most popular search engine',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['search', 'google'],
            },
          },
        },
        UpdateBookmarkDto: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              format: 'uri',
            },
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/server.ts', './src/interface/routes/*.ts', './src/interface/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger UI available at http://localhost:3000/api-docs');
};
