const config = require('../config');

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'master1 API',
    version: '1.0.0',
    description: 'Minimal Express API with Swagger UI',
  },
  servers: [
    {
      url: `http://localhost:${config.port}`,
    },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    uptime: { type: 'number' },
                    message: { type: 'string' },
                    timestamp: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/echo': {
      post: {
        summary: 'Echo payload',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Echoed payload',
            content: {
              'application/json': {
                schema: { type: 'object' },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = swaggerSpec;
