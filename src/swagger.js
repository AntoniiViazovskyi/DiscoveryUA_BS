const objectId = {
  type: 'string',
  pattern: '^[0-9a-fA-F]{24}$',
  example: '68d568270e6bcc357e9833ea',
};

const errorResponses = {
  400: {
    description: 'Invalid request data',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/Error' },
      },
    },
  },
  500: {
    description: 'Server error',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/Error' },
      },
    },
  },
};

const protectedSecurity = [
  { accessTokenCookie: [], sessionIdCookie: [] },
  { bearerAuth: [], sessionIdCookie: [] },
];

export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Travel App API',
    version: '1.0.0',
    description: 'API documentation for the Travel App backend.',
  },
  servers: [{ url: '/', description: 'Current server' }],
  tags: [
    { name: 'Auth' },
    { name: 'Users' },
    { name: 'Locations' },
    { name: 'Categories' },
    { name: 'Feedbacks' },
    { name: 'Uploads' },
  ],
  components: {
    securitySchemes: {
      accessTokenCookie: {
        type: 'apiKey',
        in: 'cookie',
        name: 'accessToken',
      },
      refreshTokenCookie: {
        type: 'apiKey',
        in: 'cookie',
        name: 'refreshToken',
      },
      sessionIdCookie: {
        type: 'apiKey',
        in: 'cookie',
        name: 'sessionId',
      },
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        description: 'Access token. A sessionId cookie is also required.',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: { message: { type: 'string' } },
        required: ['message'],
      },
      User: {
        type: 'object',
        properties: {
          _id: objectId,
          name: { type: 'string', example: 'Anton' },
          avatarUrl: { type: 'string', format: 'uri' },
          articlesAmount: { type: 'integer', example: 2 },
          isLoggedIn: { type: 'boolean', default: false },
          username: { type: 'string', example: 'traveller' },
          email: {
            type: 'string',
            example: 'traveller@example.com',
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      PublicUser: {
        type: 'object',
        properties: {
          _id: objectId,
          name: { type: 'string' },
          username: { type: 'string' },
          avatarUrl: { type: 'string', format: 'uri' },
          articlesAmount: { type: 'integer' },
          isLoggedIn: { type: 'boolean', default: false },
        },
      },
      Coordinates: {
        type: 'object',
        required: ['lat', 'lon'],
        properties: {
          lat: { type: 'number', minimum: -90, maximum: 90 },
          lon: { type: 'number', minimum: -180, maximum: 180 },
        },
      },
      Location: {
        type: 'object',
        properties: {
          _id: objectId,
          image: { type: 'string', format: 'uri' },
          name: { type: 'string' },
          locationType: { type: 'string', example: 'mountains' },
          region: { type: 'string', example: 'carpathians' },
          rate: { type: 'number', minimum: 1, maximum: 5 },
          description: { type: 'string' },
          advantages: {
            type: 'array',
            items: { type: 'string' },
          },
          coordinates: { $ref: '#/components/schemas/Coordinates' },
          ownerId: {
            oneOf: [objectId, { $ref: '#/components/schemas/PublicUser' }],
          },
          feedbacksId: {
            type: 'array',
            items: objectId,
          },
          feedbacksCount: { type: 'integer', minimum: 0, example: 8 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Feedback: {
        type: 'object',
        properties: {
          _id: objectId,
          rate: { type: 'number', minimum: 1, maximum: 5 },
          description: { type: 'string' },
          userName: { type: 'string' },
          isApproved: { type: 'boolean', default: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Region: {
        type: 'object',
        properties: {
          _id: objectId,
          region: { type: 'string' },
          slug: { type: 'string' },
          level: { type: 'string' },
          note: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      LocationType: {
        type: 'object',
        properties: {
          _id: objectId,
          type: { type: 'string' },
          slug: { type: 'string' },
          shortDescription: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['username', 'email', 'password'],
        additionalProperties: false,
        properties: {
          username: { type: 'string', minLength: 3, maxLength: 32 },
          email: { type: 'string', maxLength: 64 },
          password: {
            type: 'string',
            format: 'password',
            minLength: 8,
            maxLength: 128,
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        additionalProperties: false,
        properties: {
          email: { type: 'string', maxLength: 64 },
          password: {
            type: 'string',
            format: 'password',
            minLength: 8,
            maxLength: 128,
          },
        },
      },
      LocationInput: {
        type: 'object',
        properties: {
          images: {
            type: 'string',
            format: 'binary',
            description: 'JPG or PNG image, maximum size 1 MB.',
          },
          name: { type: 'string', minLength: 3, maxLength: 96 },
          description: { type: 'string', minLength: 20, maxLength: 6000 },
          type: { type: 'string', minLength: 1, maxLength: 64 },
          region: { type: 'string', minLength: 1, maxLength: 64 },
          advantages: {
            type: 'array',
            maxItems: 20,
            items: { type: 'string', minLength: 1, maxLength: 100 },
          },
          coordinates: { $ref: '#/components/schemas/Coordinates' },
        },
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
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
          201: {
            description: 'User registered; session cookies are set',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          ...errorResponses,
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Log in',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Logged in; session cookies are set',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          401: {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          ...errorResponses,
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Log out',
        security: protectedSecurity,
        responses: {
          204: { description: 'Logged out' },
          401: { description: 'Not authorized' },
          500: errorResponses[500],
        },
      },
    },
    '/api/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh the user session',
        security: [{ refreshTokenCookie: [], sessionIdCookie: [] }],
        responses: {
          200: {
            description: 'Session refreshed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'integer', example: 200 },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: { accessToken: { type: 'string' } },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Invalid or expired session' },
          500: errorResponses[500],
        },
      },
    },
    '/api/auth/session': {
      get: {
        tags: ['Auth'],
        summary: 'Get the current session user',
        security: protectedSecurity,
        responses: {
          200: {
            description: 'Current user',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          401: { description: 'Not authorized' },
          500: errorResponses[500],
        },
      },
    },
    '/api/users/me': {
      get: {
        tags: ['Users'],
        summary: 'Get the current user profile',
        security: protectedSecurity,
        responses: {
          200: {
            description: 'Current user profile',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'integer', example: 200 },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          401: { description: 'Not authorized' },
          404: { description: 'User not found' },
          500: errorResponses[500],
        },
      },
      patch: {
        tags: ['Users'],
        summary: 'Update the current user profile',
        security: protectedSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                minProperties: 1,
                additionalProperties: false,
                properties: {
                  name: { type: 'string', minLength: 2, maxLength: 32 },
                  username: {
                    type: 'string',
                    minLength: 3,
                    maxLength: 32,
                  },
                  email: { type: 'string', maxLength: 64 },
                  password: {
                    type: 'string',
                    format: 'password',
                    minLength: 8,
                    maxLength: 128,
                  },
                  avatarUrl: { type: 'string', format: 'uri' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Profile updated' },
          401: { description: 'Not authorized' },
          409: { description: 'Email is already in use' },
          ...errorResponses,
        },
      },
    },
    '/api/users/{userId}': {
      get: {
        tags: ['Users'],
        summary: 'Get public user information',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: objectId,
          },
        ],
        responses: {
          200: {
            description: 'Public user information',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'integer', example: 200 },
                    data: { $ref: '#/components/schemas/PublicUser' },
                  },
                },
              },
            },
          },
          404: { description: 'User not found' },
          ...errorResponses,
        },
      },
    },
    '/api/users/{userId}/locations': {
      get: {
        tags: ['Users'],
        summary: 'Get locations published by a user',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: objectId,
          },
          { $ref: '#/components/parameters/Page' },
          { $ref: '#/components/parameters/Limit' },
        ],
        responses: {
          200: {
            description: 'Paginated user locations',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LocationPage' },
              },
            },
          },
          ...errorResponses,
        },
      },
    },
    '/api/locations': {
      get: {
        tags: ['Locations'],
        summary: 'Get all locations',
        parameters: [
          { $ref: '#/components/parameters/Page' },
          { $ref: '#/components/parameters/Limit' },
          { name: 'region', in: 'query', schema: { type: 'string' } },
          {
            name: 'type',
            in: 'query',
            description: 'One type or a comma-separated list of type slugs.',
            schema: { type: 'string', example: 'park,beach' },
          },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          {
            name: 'rate',
            in: 'query',
            schema: { type: 'number', minimum: 1, maximum: 5 },
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
              enum: [
                'rate',
                'name',
                'createdAt',
                'feedbacksCount',
                'feedbackCount',
                'popularity',
              ],
              default: 'rate',
            },
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
          },
        ],
        responses: {
          200: {
            description: 'Paginated locations',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LocationPage' },
              },
            },
          },
          ...errorResponses,
        },
      },
      post: {
        tags: ['Locations'],
        summary: 'Create a location',
        security: protectedSecurity,
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/LocationInput' },
                  {
                    type: 'object',
                    required: [
                      'images',
                      'name',
                      'description',
                      'type',
                      'region',
                    ],
                  },
                ],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Location created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Location' },
              },
            },
          },
          401: { description: 'Not authorized' },
          ...errorResponses,
        },
      },
    },
    '/api/locations/{locationId}': {
      get: {
        tags: ['Locations'],
        summary: 'Get location details',
        parameters: [
          {
            name: 'locationId',
            in: 'path',
            required: true,
            schema: objectId,
          },
        ],
        responses: {
          200: {
            description: 'Location details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Location' },
              },
            },
          },
          404: { description: 'Location not found' },
          ...errorResponses,
        },
      },
      patch: {
        tags: ['Locations'],
        summary: 'Update an owned location',
        security: protectedSecurity,
        parameters: [
          {
            name: 'locationId',
            in: 'path',
            required: true,
            schema: objectId,
          },
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: { $ref: '#/components/schemas/LocationInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Location updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Location' },
              },
            },
          },
          401: { description: 'Not authorized' },
          403: { description: 'Only the author may edit this location' },
          404: { description: 'Location not found' },
          ...errorResponses,
        },
      },
    },
    '/api/categories/regions': {
      get: {
        tags: ['Categories'],
        summary: 'Get all regions',
        responses: {
          200: {
            description: 'Region list',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Region' },
                },
              },
            },
          },
          500: errorResponses[500],
        },
      },
    },
    '/api/categories/types': {
      get: {
        tags: ['Categories'],
        summary: 'Get all location types',
        responses: {
          200: {
            description: 'Location type list',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/LocationType' },
                },
              },
            },
          },
          500: errorResponses[500],
        },
      },
    },
    '/api/feedbacks/latest': {
      get: {
        tags: ['Feedbacks'],
        summary: 'Get the 7 latest approved feedbacks across locations',
        responses: {
          200: {
            description: 'Latest approved feedbacks',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      maxItems: 7,
                      items: {
                        allOf: [
                          { $ref: '#/components/schemas/Feedback' },
                          {
                            type: 'object',
                            properties: {
                              location: {
                                type: 'object',
                                properties: {
                                  _id: objectId,
                                  name: { type: 'string' },
                                },
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
          ...errorResponses,
        },
      },
    },
    '/api/feedbacks': {
      get: {
        tags: ['Feedbacks'],
        summary: 'Get approved feedbacks for a location',
        parameters: [
          {
            name: 'locationId',
            in: 'query',
            required: true,
            schema: objectId,
          },
          { $ref: '#/components/parameters/Page' },
          { $ref: '#/components/parameters/Limit' },
        ],
        responses: {
          200: {
            description: 'Paginated approved feedbacks',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Feedback' },
                    },
                    page: { type: 'integer' },
                    limit: { type: 'integer' },
                    total: { type: 'integer' },
                    totalPages: { type: 'integer' },
                  },
                },
              },
            },
          },
          404: { description: 'Location not found' },
          ...errorResponses,
        },
      },
      post: {
        tags: ['Feedbacks'],
        summary: 'Create feedback for a location',
        security: protectedSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                additionalProperties: false,
                required: ['locationId', 'rate', 'description'],
                properties: {
                  locationId: objectId,
                  rate: { type: 'number', minimum: 1, maximum: 5 },
                  description: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 200,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Feedback created and awaiting approval',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/Feedback' },
                  },
                },
              },
            },
          },
          401: { description: 'Not authorized' },
          404: { description: 'Location not found' },
          422: { description: 'The user has no valid username' },
          ...errorResponses,
        },
      },
    },
    '/api/uploads/image': {
      post: {
        tags: ['Uploads'],
        summary: 'Upload a location image',
        security: protectedSecurity,
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['image'],
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'JPG or PNG image, maximum size 1 MB.',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Image uploaded',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    url: { type: 'string', format: 'uri' },
                    publicId: { type: 'string' },
                  },
                },
              },
            },
          },
          401: { description: 'Not authorized' },
          ...errorResponses,
        },
      },
    },
  },
};

swaggerSpec.components.parameters = {
  Page: {
    name: 'page',
    in: 'query',
    schema: { type: 'integer', minimum: 1, default: 1 },
  },
  Limit: {
    name: 'limit',
    in: 'query',
    schema: { type: 'integer', minimum: 1, maximum: 50, default: 10 },
  },
};

swaggerSpec.components.schemas.LocationPage = {
  type: 'object',
  properties: {
    page: { type: 'integer' },
    limit: { type: 'integer' },
    total: { type: 'integer' },
    totalLocations: { type: 'integer' },
    totalPages: { type: 'integer' },
    userId: objectId,
    data: {
      type: 'array',
      items: { $ref: '#/components/schemas/Location' },
    },
    locations: {
      type: 'array',
      items: { $ref: '#/components/schemas/Location' },
    },
  },
};
