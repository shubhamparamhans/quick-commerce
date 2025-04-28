# Quick Commerce Platform: Service Communication Guidelines

## Introduction

This document outlines the standard communication patterns and protocols to be used across all microservices in the Quick Commerce Platform. These guidelines ensure consistency, reliability, and maintainability across our Node.js microservices architecture.

## Communication Patterns

### 1. Synchronous Communication

#### REST API Standards
- All HTTP endpoints must follow RESTful principles
- Use standard HTTP methods (GET, POST, PUT, DELETE, PATCH) appropriately
- Implement versioning in the URL path (e.g., `/api/v1/products`)
- Rate limiting should be implemented on all public-facing APIs
- Standardize on JSON for request/response payloads

#### Response Format
```json
{
  "success": true|false,
  "data": { /* payload */ },
  "error": { 
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": { /* Additional error context */ }
  },
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100
    }
  }
}
```

### 2. Asynchronous Communication

#### Message Queue Standards
- Use RabbitMQ for message queue implementation
- Implement dead-letter queues for failed message handling
- Use topic-based exchanges for publish/subscribe patterns
- Implement message schemas with JSON Schema

#### Event Naming Convention
- Use past tense verbs to describe events
- Format: `{entity}.{action}.{result}` (e.g., `order.created.success`)
- Include timestamp and correlation ID in event metadata

## Service-to-Service Authentication

### JWT-based Authentication
- Use short-lived JWTs for service-to-service communication
- Include service name, permissions, and expiration in claims
- Rotate service keys on a regular schedule
- Implement a centralized authentication service for token issuance

### Example Authorization Header
```
Authorization: Bearer {JWT_TOKEN}
```

## Service Registry & Discovery

### Implementation Guidelines
- Use Consul for service discovery
- Register service health `checks
- Implement circuit breaker pattern using Node.js libraries (e.g., Hystrix)
- Use service mesh for advanced networking capabilities

## API Gateway Integration

### Gateway Configuration
- Implement request validation at gateway level
- Configure rate limiting and throttling policies
- Set up proper CORS handling
- Implement request logging and monitoring

## Data Consistency Patterns

### Transactional Outbox Pattern
- Use outbox table for reliable event publishing
- Implement a separate service for processing outbox messages
- Ensure at-least-once delivery semantics

### Saga Pattern for Distributed Transactions
- Implement choreography-based sagas for order processing flow
- Define compensating transactions for each service
- Use correlation IDs to track saga execution

## Versioning Strategy

### API Versioning
- Use URL path versioning (e.g., `/api/v1/products`)
- Support at least one previous version when introducing breaking changes
- Document deprecation timelines and migration paths

### Event Versioning
- Include version in event type (e.g., `order.created.v1`)
- Implement backward-compatible event schemas
- Use event upcasting for version handling

## Error Handling & Retries

### Circuit Breaker Implementation
```javascript
const circuitBreaker = new CircuitBreaker({
  failureThreshold: 3,
  resetTimeout: 30000,
  timeout: 5000,
  fallback: async () => { return { error: "Service unavailable" } }
});

const callService = async () => {
  return circuitBreaker.fire(async () => {
    // Service call logic
  });
};
```

### Retry Strategy
- Implement exponential backoff with jitter
- Set maximum retry attempts based on service criticality
- Log all retry attempts for monitoring

## Logging & Monitoring

### Logging Standards
- Use structured logging (JSON format)
- Include correlation ID in all logs
- Define standard log levels (ERROR, WARN, INFO, DEBUG)
- Implement distributed tracing with OpenTelemetry

### Required Log Fields
```json
{
  "timestamp": "ISO8601",
  "level": "INFO",
  "service": "order-service",
  "correlationId": "uuid",
  "message": "Human-readable message",
  "context": { /* Additional context */ }
}
```

## Implementation Examples

### Service Registration (Node.js)
```javascript
const consul = require('consul')();
const service = {
  name: 'order-service',
  id: `order-service-${process.env.POD_NAME}`,
  tags: ['production', 'v1'],
  address: process.env.POD_IP,
  port: 3000,
  check: {
    http: 'http://localhost:3000/health',
    interval: '15s'
  }
};

consul.agent.service.register(service, (err) => {
  if (err) console.error('Failed to register service:', err);
  else console.log('Service registered successfully');
});
```

### Event Publishing (Node.js with RabbitMQ)
```javascript
const amqp = require('amqplib');

async function publishEvent(eventType, payload) {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();
  
  const exchange = 'quick-commerce-events';
  await channel.assertExchange(exchange, 'topic', { durable: true });
  
  const eventMessage = {
    eventType,
    timestamp: new Date().toISOString(),
    correlationId: payload.correlationId || generateUUID(),
    data: payload
  };
  
  channel.publish(
    exchange,
    eventType,
    Buffer.from(JSON.stringify(eventMessage)),
    { persistent: true }
  );
  
  await channel.close();
  await connection.close();
}

// Usage
publishEvent('order.created.success', { 
  orderId: '12345',
  customerId: '6789',
  items: [/* order items */]
});
```

### Event Consumption (Node.js with RabbitMQ)
```javascript
const amqp = require('amqplib');

async function consumeEvents(eventType, handler) {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();
  
  const exchange = 'quick-commerce-events';
  await channel.assertExchange(exchange, 'topic', { durable: true });
  
  const queueResult = await channel.assertQueue('', { exclusive: true });
  const queueName = queueResult.queue;
  
  await channel.bindQueue(queueName, exchange, eventType);
  
  channel.consume(queueName, async (msg) => {
    if (!msg) return;
    
    try {
      const event = JSON.parse(msg.content.toString());
      await handler(event);
      channel.ack(msg);
    } catch (error) {
      console.error('Error processing message:', error);
      // Reject and requeue if this is a transient error
      channel.nack(msg, false, true);
    }
  });
}

// Usage
consumeEvents('order.created.success', async (event) => {
  // Process order created event
  console.log(`Processing order ${event.data.orderId}`);
  // Update inventory, send notifications, etc.
});
```

### REST API Client (Node.js with Axios)
```javascript
const axios = require('axios');
const CircuitBreaker = require('opossum');

class ServiceClient {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    this.circuitBreaker = new CircuitBreaker(this._request.bind(this), {
      timeout: 5000,
      errorThresholdPercentage: 50,
      resetTimeout: 30000
    });
  }

  async _request(config) {
    try {
      const response = await this.client(config);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`Service responded with ${error.response.status}: ${error.response.data?.error?.message || 'Unknown error'}`);
      }
      throw error;
    }
  }
  
  async get(path, params) {
    return this.circuitBreaker.fire({ method: 'get', url: path, params });
  }
  
  async post(path, data) {
    return this.circuitBreaker.fire({ method: 'post', url: path, data });
  }
  
  // Add other methods as needed
}

// Usage
const productService = new ServiceClient('http://product-catalog-service:3000/api/v1');

async function getProductDetails(productId) {
  try {
    return await productService.get(`/products/${productId}`);
  } catch (error) {
    console.error('Failed to get product details:', error);
    throw error;
  }
}
```

## Service-Specific Guidelines

### Authentication Service
- Expose JWT issuance and validation endpoints
- Manage service accounts and permissions
- Implement OAuth 2.0 for customer authentication
- Provide user profile information

### Product Catalog Service
- Implement caching for frequently accessed products
- Provide real-time inventory updates via events
- Support flexible product search capabilities
- Handle product variant management

### Order Management Service
- Implement saga pattern for order processing
- Provide order status tracking capabilities
- Handle order modifications and cancellations
- Emit events for all order status changes

### Payment Processing Service
- Use outbox pattern for reliable payment events
- Implement idempotent payment processing
- Support multiple payment gateways
- Provide payment status tracking

### Warehouse Management Service
- Track inventory levels and product location
- Process picking and packing operations
- Handle multiple warehouse locations
- Emit inventory change events

### Analytics & Reporting Service
- Consume events from all services for data collection
- Implement data aggregation pipelines
- Provide real-time and historical analytics
- Support customizable reporting

### Customer Support Service
- Access order and customer information
- Manage support tickets and inquiries
- Track customer interaction history
- Support SLA management

### Notification Service
- Support multiple notification channels (email, SMS, push)
- Implement notification templates
- Provide delivery tracking and retries
- Support notification preferences