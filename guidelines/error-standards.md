# Quick Commerce Platform: Error Handling Standards

This document defines the standard approach for error handling across all microservices in the quick commerce platform.

## Error Response Format

All error responses must follow this standard format:

```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": [
      {
        "field": "email",
        "code": "INVALID_FORMAT",
        "message": "Email address is not properly formatted"
      }
    ],
    "traceId": "unique-trace-id-for-logging"
  }
}
```

Components:
- `status`: Always "error" for error responses
- `error`: Contains error information
  - `code`: Standardized error code
  - `message`: Human-readable error message (safe for display to end-users)
  - `details`: Array of specific validation errors or additional context (optional)
  - `traceId`: Unique identifier for tracing the error in logs

## Standard Error Codes

### Authentication & Authorization Errors

| Code | Status Code | Description |
|------|-------------|-------------|
| `AUTH_REQUIRED` | 401 | Authentication is required |
| `AUTH_INVALID` | 401 | Invalid credentials provided |
| `AUTH_EXPIRED` | 401 | Authentication token has expired |
| `AUTH_REVOKED` | 401 | Authentication token has been revoked |
| `PERMISSION_DENIED` | 403 | User lacks permission for the requested action |
| `ACCOUNT_LOCKED` | 403 | User account is locked |
| `ACCOUNT_DISABLED` | 403 | User account is disabled |
| `IP_BLOCKED` | 403 | Access from the client IP is blocked |

### Resource Errors

| Code | Status Code | Description |
|------|-------------|-------------|
| `RESOURCE_NOT_FOUND` | 404 | Requested resource does not exist |
| `RESOURCE_EXISTS` | 409 | Resource already exists |
| `RESOURCE_EXPIRED` | 410 | Resource has expired or been removed |
| `RESOURCE_LOCKED` | 423 | Resource is locked or in use |
| `PRECONDITION_FAILED` | 412 | Request precondition failed |

### Validation Errors

| Code | Status Code | Description |
|------|-------------|-------------|
| `VALIDATION_FAILED` | 400 | General validation failure |
| `INVALID_FIELD` | 400 | Specific field validation failed |
| `INVALID_FORMAT` | 400 | Request format is invalid |
| `MISSING_REQUIRED_FIELD` | 400 | Required field is missing |
| `OUT_OF_RANGE` | 400 | Value is outside allowed range |
| `INVALID_ENUM_VALUE` | 400 | Value is not a valid enum option |
| `INVALID_RELATION` | 400 | Referenced resource does not exist |

### Business Logic Errors

| Code | Status Code | Description |
|------|-------------|-------------|
| `BUSINESS_RULE_VIOLATION` | 422 | Request violates a business rule |
| `INSUFFICIENT_FUNDS` | 422 | Insufficient funds for payment |
| `INSUFFICIENT_INVENTORY` | 422 | Insufficient inventory for order |
| `ORDER_ALREADY_PROCESSED` | 422 | Order already processed |
| `ORDER_CANCELLED` | 422 | Order has been cancelled |
| `PAYMENT_FAILED` | 422 | Payment processing failed |
| `DELIVERY_UNAVAILABLE` | 422 | Delivery is not available for the address |
| `PROMOTION_EXPIRED` | 422 | Promotion has expired |
| `PROMOTION_INVALID` | 422 | Promotion is not valid for this order |
| `LIMIT_EXCEEDED` | 422 | Business limit exceeded (e.g., max order quantity) |

### System Errors

| Code | Status Code | Description |
|------|-------------|-------------|
| `INTERNAL_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |
| `GATEWAY_ERROR` | 502 | Error from upstream service |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `TIMEOUT` | 504 | Request timed out |
| `RATE_LIMITED` | 429 | Too many requests |

### Domain-Specific Errors

Services should define domain-specific error codes with the format `{SERVICE_NAME}_{ERROR_TYPE}`.

Examples:
- `CATALOG_PRODUCT_DISCONTINUED`
- `PAYMENT_CARD_DECLINED`
- `WAREHOUSE_ZONE_FULL`

## Validation Error Details

For validation errors, provide detailed information in the `details` array:

```json
"details": [
  {
    "field": "email",
    "code": "INVALID_FORMAT",
    "message": "Email address is not properly formatted"
  },
  {
    "field": "password",
    "code": "TOO_SHORT",
    "message": "Password must be at least 8 characters"
  }
]
```

For nested fields, use dot notation:
```json
"field": "billingAddress.postalCode"
```

## Error Handling Guidelines

### Do's

- **Use standard HTTP status codes** appropriately
- **Provide descriptive error messages** that are safe for end-users
- **Include a unique trace ID** for correlating with server logs
- **Normalize errors** from third-party services to our standard format
- **Log detailed error information** server-side (including stack traces)
- **Return validation errors for all invalid fields** at once (not just the first error)
- **Translate error messages** based on Accept-Language header when possible
- **Return structured error details** for validation errors

### Don'ts

- **Don't expose sensitive information** in error messages (stack traces, internal IDs, etc.)
- **Don't return different status codes for the same logical error**
- **Don't include internal technical details** in user-facing error messages
- **Don't return HTML error pages** for API requests
- **Don't use custom HTTP status codes** outside the standard

## Exception Handling

Each service should implement a centralized exception handler that:

1. Catches all unhandled exceptions
2. Maps exceptions to appropriate error responses
3. Logs detailed error information
4. Returns standardized error responses

Example implementation pattern:

```javascript
// Express middleware example
function errorHandler(err, req, res, next) {
  // Generate trace ID
  const traceId = generateTraceId();
  
  // Log error with trace ID
  logger.error({ 
    err, 
    traceId, 
    request: { 
      path: req.path, 
      method: req.method, 
      requestId: req.headers['x-request-id'] 
    } 
  });
  
  // Map error to standard format
  const mappedError = mapError(err);
  
  // Send response
  res.status(mappedError.statusCode).json({
    status: 'error',
    error: {
      code: mappedError.code,
      message: mappedError.message,
      details: mappedError.details || [],
      traceId: traceId
    }
  });
}
```

## Error Logging

All errors should be logged with the following information:

- **Error object** (including stack trace)
- **Trace ID** (same as returned to client)
- **Request information** (path, method, request ID, etc.)
- **User context** (user ID if authenticated)
- **Relevant business entities** (order ID, product ID, etc.)
- **Timestamp**
- **Service name and version**

## Error Monitoring

All services should:

1. Export error metrics for monitoring
2. Alert on high error rates
3. Track error trends
4. Group related errors together

## Client Retry Strategy

For certain error types, provide retry guidance in the response:

```json
"error": {
  "code": "SERVICE_UNAVAILABLE",
  "message": "Service temporarily unavailable",
  "retryAfter": 30,
  "traceId": "abc-123"
}
```

## API Documentation

Document all possible error codes, including:
- When they can occur
- How to resolve them
- Whether they are retryable