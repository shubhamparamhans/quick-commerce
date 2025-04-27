# Quick Commerce Platform: API Conventions

This document defines the API conventions that all microservices in the quick commerce platform should follow to ensure consistency and interoperability.

## Base URL Structure

All API endpoints should follow this URL structure:

```
https://{service-name}.api.quickcommerce.example/v{version}/{resource}
```

Example:
```
https://order.api.quickcommerce.example/v1/orders
```

For local development:
```
http://localhost:{port}/v{version}/{resource}
```

## API Versioning

- All endpoints must be versioned in the URL path (e.g., `/v1/orders`)
- Breaking changes require a new API version
- Multiple API versions may be supported simultaneously during transition periods
- Deprecation notices should be provided in responses for endpoints scheduled for retirement

## Standard HTTP Methods

Use standard HTTP methods for CRUD operations:

- `GET`: Retrieve resource(s)
- `POST`: Create a new resource
- `PUT`: Update a resource completely
- `PATCH`: Update a resource partially
- `DELETE`: Remove a resource

## Status Codes

Use appropriate HTTP status codes:

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource successfully created |
| 204 | No Content | Request succeeded but no content returned (e.g., for DELETE) |
| 400 | Bad Request | Malformed request or validation errors |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | User authenticated but not authorized for the action |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Request conflicts with current state (e.g., duplicate entry) |
| 422 | Unprocessable Entity | Request format is correct but semantically invalid |
| 429 | Too Many Requests | Rate limit reached |
| 500 | Internal Server Error | Server-side error (should be rare) |
| 503 | Service Unavailable | Service temporarily unavailable (e.g., maintenance) |

## Response Format

All API responses must follow this standard JSON format:

```json
{
  "status": "success|error",
  "data": {},
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": []
  },
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalPages": 5,
      "totalItems": 100
    },
    "requestId": "uuid-for-request-tracing"
  }
}
```

Notes:
- `status`: Required, either "success" or "error"
- `data`: Required for successful responses, omitted for errors
- `error`: Required for error responses, omitted for success
- `meta`: Optional, contains metadata like pagination info or request tracking IDs

## Error Codes

Use consistent error codes across services:

| Code | Description |
|------|-------------|
| `AUTH_REQUIRED` | Authentication required |
| `AUTH_INVALID` | Invalid credentials |
| `AUTH_EXPIRED` | Authentication token expired |
| `FORBIDDEN` | User lacks permission for the requested action |
| `RESOURCE_NOT_FOUND` | Requested resource not found |
| `VALIDATION_ERROR` | Request validation failed |
| `DUPLICATE_ENTRY` | Resource already exists |
| `RATE_LIMITED` | Too many requests |
| `INTERNAL_ERROR` | Internal server error |
| `SERVICE_UNAVAILABLE` | Service temporarily unavailable |
| `BUSINESS_RULE_VIOLATION` | Request violates a business rule |

Each service can define additional domain-specific error codes with the format: `{SERVICE}_{ERROR_TYPE}`, e.g., `ORDER_INSUFFICIENT_INVENTORY`.

## Pagination

For collections, use the following pagination parameters:

Query parameters:
```
GET /v1/products?page=2&limit=20
```

Response format:
```json
{
  "status": "success",
  "data": [],
  "meta": {
    "pagination": {
      "page": 2,
      "limit": 20,
      "totalPages": 5,
      "totalItems": 100,
      "hasNextPage": true,
      "hasPrevPage": true
    }
  }
}
```

## Filtering, Sorting, and Searching

### Filtering

Use query parameters for filtering:
```
GET /v1/products?category=electronics&price_min=100&price_max=500&in_stock=true
```

### Sorting

Use `sort` parameter:
```
GET /v1/products?sort=price:asc,name:desc
```

### Searching

Use `q` parameter for general search:
```
GET /v1/products?q=wireless+headphones
```

## Field Selection

Allow clients to specify which fields to include:
```
GET /v1/products?fields=id,name,price,category
```

## Expanding Related Resources

Allow clients to expand related resources:
```
GET /v1/orders/123?expand=customer,items.product
```

## Rate Limiting

Include rate limit information in response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1618046400
```

## Authentication

All authenticated requests should include the JWT token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Idempotency

For non-idempotent operations (POST, PATCH), clients can include an idempotency key:
```
Idempotency-Key: 123e4567-e89b-12d3-a456-426614174000
```

## Request IDs

Every request should have a unique identifier for tracking:

Request:
```
X-Request-ID: 123e4567-e89b-12d3-a456-426614174000
```

Response:
```
X-Request-ID: 123e4567-e89b-12d3-a456-426614174000
```

## CORS Headers

For browser-based clients, include appropriate CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Request-ID
Access-Control-Max-Age: 86400
```

## Content Negotiation

Support content negotiation through Accept headers:
```
Accept: application/json
Accept-Language: en-US
```

## API Documentation

- All APIs must be documented using OpenAPI/Swagger
- Documentation endpoints should be available at `/v{version}/docs`
- Include example requests and responses
- Document all error scenarios and codes

## Webhooks

For webhooks sent to external systems:
- Include a `X-Webhook-Signature` header with HMAC signature
- Include event type and timestamp
- Implement retry logic with exponential backoff
- Allow webhook configuration and testing through API

Standard webhook payload format:
```json
{
  "id": "evt_123",
  "type": "order.created",
  "created": "2023-04-15T12:00:00Z",
  "data": {}
}
```

## Health Check Endpoints (continued)

Every service must provide health check endpoints:
- `/health/liveness`: Basic check that the service is running
- `/health/readiness`: Check that the service is ready to receive traffic
- `/health/dependency`: Check status of all dependencies (databases, other services)

Health check response format:
```json
{
  "status": "pass|warn|fail",
  "version": "1.2.3",
  "checks": {
    "database": {
      "status": "pass",
      "latency": "45ms"
    },
    "cache": {
      "status": "pass",
      "latency": "12ms"
    },
    "payment_service": {
      "status": "warn",
      "latency": "230ms",
      "message": "Higher than normal latency"
    }
  },
  "timestamp": "2023-04-15T12:00:00Z"
}
```

## API Metrics

All APIs should track and expose the following metrics:
- Request count (by endpoint, method, status code)
- Response time (average, percentiles)
- Error rate
- Concurrent requests

## Caching

Use standard cache control headers:
```
Cache-Control: max-age=3600, must-revalidate
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

For conditional requests, support If-None-Match header:
```
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

## Bulk Operations

For operations on multiple resources, follow these patterns:

Bulk creation:
```
POST /v1/products/bulk
```

Bulk update:
```
PUT /v1/products/bulk
```

Bulk delete:
```
DELETE /v1/products/bulk
```

Response should include individual results:
```json
{
  "status": "success",
  "data": {
    "succeeded": [
      {"id": "123", "status": "created"},
      {"id": "124", "status": "created"}
    ],
    "failed": [
      {"id": "125", "error": {"code": "VALIDATION_ERROR", "message": "Invalid price"}}
    ]
  },
  "meta": {
    "total": 3,
    "succeeded": 2,
    "failed": 1
  }
}
```

## Asynchronous Operations

For long-running operations, use the following pattern:

1. Initial request:
```
POST /v1/imports
```

2. Response with operation ID:
```json
{
  "status": "success",
  "data": {
    "operationId": "op_123",
    "status": "processing",
    "statusUrl": "/v1/operations/op_123"
  }
}
```

3. Status check:
```
GET /v1/operations/op_123
```

4. Status response:
```json
{
  "status": "success",
  "data": {
    "operationId": "op_123",
    "status": "completed", // or "processing", "failed"
    "progress": 100,
    "result": {},
    "error": null
  }
}
```

## Versioning Strategy

- URL-based versioning for major versions: `/v1/`, `/v2/`
- Accept header for minor versions: `Accept: application/vnd.quickcommerce.v1.2+json`
- Include version in response:
```json
{
  "status": "success",
  "data": {},
  "meta": {
    "apiVersion": "1.2"
  }
}
```

## Standard Timestamp Format

All dates and times must be in ISO 8601 format with UTC timezone:
```
2023-04-15T12:00:00Z
```

## Security Requirements

All APIs must implement:
- Input validation and sanitization
- Output encoding to prevent XSS
- Rate limiting and throttling
- JWT validation with proper signature verification
- Role-based access control checks
- Protection against common attacks (CSRF, injection, etc.)
- No sensitive data in URLs
- Proper HTTP security headers

## Deprecation Process

When deprecating an API endpoint:
1. Include deprecation notice in response header:
```
Deprecation: true
Sunset: Sat, 31 Dec 2023 23:59:59 GMT
Link: <https://api.quickcommerce.example/v2/resource>; rel="successor-version"
```

2. Document migration path in API documentation
3. Maintain deprecated endpoint for at least 6 months
4. Send deprecation notices to registered developers