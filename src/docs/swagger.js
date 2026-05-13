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
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
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
          role: { type: 'string', example: 'user' },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Jane Doe' },
          email: { type: 'string', example: 'jane@example.com' },
          password: { type: 'string', example: 'secret123' },
          role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'jane@example.com' },
          password: { type: 'string', example: 'secret123' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          data: { $ref: '#/components/schemas/User' },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        },
      },
      CreateUserRequest: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string', example: 'Jane Doe' },
          email: { type: 'string', example: 'jane@example.com' },
          password: { type: 'string', example: 'optional_password123' },
          role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
        },
      },
      UpdateUserRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Jane Doe' },
          email: { type: 'string', example: 'jane@example.com' },
          password: { type: 'string', example: 'new_password123' },
          role: { type: 'string', enum: ['user', 'admin'], example: 'admin' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'error' },
          statusCode: { type: 'integer', example: 400 },
          message: { type: 'string', example: 'Validation failed' },
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
      Category: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'T-Shirts' },
          slug: { type: 'string', example: 't-shirts' },
        },
      },
      ProductImage: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          url: { type: 'string', example: 'https://cdn.example.com/img1.jpg' },
          altText: { type: 'string', example: 'Front view' },
          sortOrder: { type: 'integer', example: 0 },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Basic Tee' },
          slug: { type: 'string', example: 'basic-tee' },
          description: { type: 'string', example: 'Comfortable cotton t-shirt' },
          price: { type: 'number', format: 'float', example: 19.99 },
          stock: { type: 'integer', example: 42 },
          featured: { type: 'boolean', example: false },
          category: { $ref: '#/components/schemas/Category' },
          images: {
            type: 'array',
            items: { $ref: '#/components/schemas/ProductImage' },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateProductRequest: {
        type: 'object',
        required: ['title', 'price'],
        properties: {
          title: { type: 'string', example: 'Basic Tee' },
          description: { type: 'string', example: 'Comfortable cotton t-shirt' },
          price: { type: 'number', format: 'float', example: 19.99 },
          stock: { type: 'integer', example: 10 },
          featured: { type: 'boolean', example: false },
          categoryId: { type: 'integer', example: 2 },
          images: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                url: { type: 'string', example: 'https://cdn.example.com/img1.jpg' },
                altText: { type: 'string', example: 'Front view' },
              },
            },
          },
        },
      },
      UpdateProductRequest: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number', format: 'float' },
          stock: { type: 'integer' },
          featured: { type: 'boolean' },
          categoryId: { type: 'integer' },
          images: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                url: { type: 'string' },
                altText: { type: 'string' },
              },
            },
          },
        },
      },
      ApiResponseProduct: {
        type: 'object',
        properties: { data: { $ref: '#/components/schemas/Product' } },
      },
      ApiResponseProducts: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Product' },
          },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'integer' },
              page: { type: 'integer' },
              limit: { type: 'integer' },
              pages: { type: 'integer' },
            },
          },
        },
      },
      CartItemProduct: {
        type: 'object',
        example: {
          id: 10,
          title: 'Basic Tee',
          slug: 'basic-tee',
          price: 19.99,
          stock: 42,
          images: [
            {
              id: 1,
              url: 'https://cdn.example.com/img1.jpg',
              altText: 'Front view',
              sortOrder: 0,
            },
          ],
        },
        properties: {
          id: { type: 'integer', example: 10 },
          title: { type: 'string', example: 'Basic Tee' },
          slug: { type: 'string', example: 'basic-tee' },
          price: { type: 'number', format: 'float', example: 19.99 },
          stock: { type: 'integer', example: 42 },
          images: {
            type: 'array',
            items: { $ref: '#/components/schemas/ProductImage' },
          },
        },
      },
      CartItem: {
        type: 'object',
        example: {
          id: 100,
          quantity: 2,
          subtotal: 39.98,
          product: {
            id: 10,
            title: 'Basic Tee',
            slug: 'basic-tee',
            price: 19.99,
            stock: 42,
            images: [
              {
                id: 1,
                url: 'https://cdn.example.com/img1.jpg',
                altText: 'Front view',
                sortOrder: 0,
              },
            ],
          },
        },
        properties: {
          id: { type: 'integer', example: 100 },
          quantity: { type: 'integer', example: 2 },
          subtotal: { type: 'number', format: 'float', example: 39.98 },
          product: { $ref: '#/components/schemas/CartItemProduct' },
        },
      },
      Cart: {
        type: 'object',
        example: {
          id: 1,
          userId: 5,
          items: [
            {
              id: 100,
              quantity: 2,
              subtotal: 39.98,
              product: {
                id: 10,
                title: 'Basic Tee',
                slug: 'basic-tee',
                price: 19.99,
                stock: 42,
                images: [
                  {
                    id: 1,
                    url: 'https://cdn.example.com/img1.jpg',
                    altText: 'Front view',
                    sortOrder: 0,
                  },
                ],
              },
            },
          ],
          totalQuantity: 2,
          total: 39.98,
          itemCount: 1,
          createdAt: '2026-05-13T07:50:12.000Z',
          updatedAt: '2026-05-13T07:50:12.000Z',
        },
        properties: {
          id: { type: 'integer', example: 1 },
          userId: { type: 'integer', example: 5 },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/CartItem' },
          },
          totalQuantity: { type: 'integer', example: 2 },
          total: { type: 'number', format: 'float', example: 39.98 },
          itemCount: { type: 'integer', example: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      AddCartItemRequest: {
        type: 'object',
        required: ['productId'],
        example: {
          productId: 10,
          quantity: 1,
        },
        properties: {
          productId: { type: 'integer', example: 10 },
          quantity: { type: 'integer', example: 1 },
        },
      },
      UpdateCartItemRequest: {
        type: 'object',
        required: ['quantity'],
        example: {
          quantity: 3,
        },
        properties: {
          quantity: { type: 'integer', example: 3 },
        },
      },
      ApiResponseCart: {
        type: 'object',
        properties: {
          data: { $ref: '#/components/schemas/Cart' },
        },
      },
      OrderItem: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          productId: { type: 'integer', example: 10 },
          snapshotTitle: { type: 'string', example: 'Basic Tee' },
          snapshotPrice: { type: 'number', format: 'float', example: 19.99 },
          quantity: { type: 'integer', example: 2 },
          subtotal: { type: 'number', format: 'float', example: 39.98 },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1000 },
          userId: { type: 'integer', example: 5 },
          status: { type: 'string', example: 'pending' },
          totalAmount: { type: 'number', format: 'float', example: 39.98 },
          totalQuantity: { type: 'integer', example: 2 },
          items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      ApiResponseOrder: {
        type: 'object',
        properties: { data: { $ref: '#/components/schemas/Order' } },
      },
      ApiResponseOrders: {
        type: 'object',
        properties: { data: { type: 'array', items: { $ref: '#/components/schemas/Order' } } },
      },
      AdminUser: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 5 },
          name: { type: 'string', example: 'Jane Doe' },
          email: { type: 'string', example: 'jane@example.com' },
        },
      },
      AdminOrderWithUser: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1000 },
          userId: { type: 'integer', example: 5 },
          user: { $ref: '#/components/schemas/AdminUser' },
          status: { type: 'string', enum: ['pending', 'paid', 'shipped', 'completed', 'cancelled'], example: 'pending' },
          totalAmount: { type: 'number', format: 'float', example: 39.98 },
          totalQuantity: { type: 'integer', example: 2 },
          items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      UpdateOrderStatusRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['pending', 'paid', 'shipped', 'completed', 'cancelled'],
            example: 'paid',
          },
        },
      },
      AdminOrderMeta: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 20 },
          total: { type: 'integer', example: 45 },
          pages: { type: 'integer', example: 3 },
          pending: { type: 'integer', example: 10 },
          paid: { type: 'integer', example: 15 },
          shipped: { type: 'integer', example: 12 },
          completed: { type: 'integer', example: 8 },
          cancelled: { type: 'integer', example: 0 },
        },
      },
      AdminOrdersListResponse: {
        type: 'object',
        properties: {
          data: { type: 'array', items: { $ref: '#/components/schemas/AdminOrderWithUser' } },
          meta: { $ref: '#/components/schemas/AdminOrderMeta' },
        },
      },
      OrderBreakdown: {
        type: 'object',
        properties: {
          count: { type: 'integer', example: 15 },
          revenue: { type: 'number', format: 'float', example: 1299.85 },
        },
      },
      OrderStatisticsResponse: {
        type: 'object',
        properties: {
          totalOrders: { type: 'integer', example: 45 },
          totalRevenue: { type: 'number', format: 'float', example: 4599.99 },
          avgOrderValue: { type: 'number', format: 'float', example: 102.22 },
          breakdown: {
            type: 'object',
            properties: {
              pending: { $ref: '#/components/schemas/OrderBreakdown' },
              paid: { $ref: '#/components/schemas/OrderBreakdown' },
              shipped: { $ref: '#/components/schemas/OrderBreakdown' },
              completed: { $ref: '#/components/schemas/OrderBreakdown' },
              cancelled: { $ref: '#/components/schemas/OrderBreakdown' },
            },
          },
          recentOrders: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1000 },
                email: { type: 'string', example: 'jane@example.com' },
                status: { type: 'string', example: 'paid' },
                totalAmount: { type: 'number', format: 'float', example: 59.99 },
                createdAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
      ApiResponseAdminOrder: {
        type: 'object',
        properties: { data: { $ref: '#/components/schemas/AdminOrderWithUser' } },
      },
      ApiResponseAdminOrdersList: {
        type: 'object',
        properties: { data: { $ref: '#/components/schemas/AdminOrdersListResponse' } },
      },
      ApiResponseOrderStatistics: {
        type: 'object',
        properties: { data: { $ref: '#/components/schemas/OrderStatisticsResponse' } },
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

    '/api/auth/register': {
      post: {
        summary: 'Register a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Registered successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '409': {
            description: 'Email already in use',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Login and get a token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Authenticated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
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
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '409': {
            description: 'Email already in use',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
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
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
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
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
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
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/profile': {
      get: {
        summary: 'Get the authenticated user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Current user',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseUser' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/admin/users': {
      get: {
        summary: 'Admin-only list of users',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of users',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseUsers' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/categories': {
      get: {
        summary: 'List categories',
        responses: {
          '200': {
            description: 'Array of categories',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Category' },
                },
              },
            },
          },
        },
      },
    },
    '/api/products': {
      get: {
        summary: 'List products (paginated)',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'q', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'minPrice', in: 'query', schema: { type: 'number' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
        ],
        responses: {
          '200': {
            description: 'Paginated products',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseProducts' },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a product (admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateProductRequest' } } },
        },
        responses: {
          '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponseProduct' } } } },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '403': { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/products/{slug}': {
      parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
      get: {
        summary: 'Get product by slug',
        responses: {
          '200': { description: 'Product', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponseProduct' } } } },
          '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/products/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      put: {
        summary: 'Update a product (admin)',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateProductRequest' } } } },
        responses: {
          '200': { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponseProduct' } } } },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '403': { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      delete: {
        summary: 'Delete a product (admin)',
        security: [{ bearerAuth: [] }],
        responses: {
          '204': { description: 'Deleted' },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '403': { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/cart': {
      get: {
        summary: 'Get authenticated user cart',
        security: [{ bearerAuth: [] }],
        description: 'Returns the active cart for the authenticated user, creating an empty one if needed.',
        responses: {
          '200': {
            description: 'Current cart',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseCart' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },
    '/api/cart/items': {
      post: {
        summary: 'Add product to cart or increment quantity',
        security: [{ bearerAuth: [] }],
        description: 'If the product already exists in the cart, the quantity is incremented instead of creating a duplicate row.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AddCartItemRequest' },
              example: {
                productId: 10,
                quantity: 1,
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Cart updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseCart' },
              },
            },
          },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Product not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '409': { description: 'Stock conflict', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/cart/items/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      put: {
        summary: 'Update cart item quantity',
        security: [{ bearerAuth: [] }],
        description: 'Replaces the quantity for the selected cart item after stock validation.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateCartItemRequest' },
              example: {
                quantity: 3,
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Cart updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseCart' },
              },
            },
          },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Cart item not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '409': { description: 'Stock conflict', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      delete: {
        summary: 'Remove a cart item',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Cart updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseCart' },
              },
            },
          },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Cart item not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/orders': {
      post: {
        summary: 'Create an order from the authenticated user cart',
        security: [{ bearerAuth: [] }],
        responses: {
          '201': {
            description: 'Order created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponseOrder' } } },
          },
          '400': { description: 'Bad request / empty cart', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '409': { description: 'Stock conflict', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      get: {
        summary: 'List orders for the authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'List of orders', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponseOrders' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/orders/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      get: {
        summary: 'Get a specific order for the authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Order', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponseOrder' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/admin/orders': {
      get: {
        summary: 'Admin: List all orders (with filtering, sorting, pagination)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' }, description: 'Page number (default: 1)' },
          { name: 'limit', in: 'query', schema: { type: 'integer' }, description: 'Items per page (default: 20, max: 100)' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['all', 'pending', 'paid', 'shipped', 'completed', 'cancelled'] }, description: 'Filter by status' },
          { name: 'userId', in: 'query', schema: { type: 'integer' }, description: 'Filter by user ID' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search by order ID or user email' },
          { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['createdAt', 'totalAmount', 'status'] }, description: 'Sort field (default: createdAt)' },
          { name: 'sortDir', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] }, description: 'Sort direction (default: desc)' },
        ],
        responses: {
          '200': {
            description: 'Paginated list of orders with status counts',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponseAdminOrdersList' } } },
          },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '403': { description: 'Forbidden (admin only)', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/admin/orders/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      get: {
        summary: 'Admin: Get order details',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Order with user info', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponseAdminOrder' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '403': { description: 'Forbidden (admin only)', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Order not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/admin/orders/{id}/status': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      put: {
        summary: 'Admin: Update order status (with state machine validation)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateOrderStatusRequest' },
              example: { status: 'paid' },
            },
          },
        },
        responses: {
          '200': { description: 'Status updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponseAdminOrder' } } } },
          '400': { description: 'Invalid status or transition', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '403': { description: 'Forbidden (admin only)', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Order not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/admin/orders/stats/overview': {
      get: {
        summary: 'Admin: Get order statistics for dashboard',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Order statistics and metrics',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponseOrderStatistics' } } },
          },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '403': { description: 'Forbidden (admin only)', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
  },
};

module.exports = swaggerSpec;
