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
  components: {
    schemas: {
      HealthResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'ok' },
          uptime: { type: 'number', example: 123.45 },
          message: { type: 'string', example: 'Healthy' },
          timestamp: { type: 'number', example: 1710000000000 },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Alice Johnson' },
          email: { type: 'string', example: 'alice@example.com' },
        },
      },
      CreateUserRequest: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string', example: 'Jane Doe' },
          email: { type: 'string', example: 'jane@example.com' },
        },
      },
      UpdateUserRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Jane Doe' },
          email: { type: 'string', example: 'jane@example.com' },
        },
      },
      ApiResponseUser: {
        type: 'object',
        properties: {
          data: { $ref: '#/components/schemas/User' },
        },
      },
      ApiResponseUsers: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/User' },
          },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthResponse' },
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
    '/api/users': {
      get: {
        summary: 'List users',
        responses: {
          '200': {
            description: 'List of users',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseUsers' },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateUserRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'User created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseUser' },
              },
            },
          },
        },
      },
    },
    '/api/users/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
        },
      ],
      get: {
        summary: 'Get a user by id',
        responses: {
          '200': {
            description: 'Single user',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseUser' },
              },
            },
          },
        },
      },
      put: {
        summary: 'Update a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUserRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Updated user',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseUser' },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete a user',
        responses: {
          '200': {
            description: 'User deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/User' },
                    message: { type: 'string', example: 'User deleted successfully' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = swaggerSpec;
