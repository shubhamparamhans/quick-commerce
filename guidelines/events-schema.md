# Quick Commerce Platform: Event Schemas

This document defines the standard event schemas for the event-driven communication between microservices in the quick commerce platform.

## Event Envelope

All events must follow this standard envelope format:

```json
{
  "id": "evt_123e4567-e89b-12d3-a456-426614174000",
  "type": "order.created",
  "source": "order-service",
  "version": "1.0",
  "timestamp": "2023-04-15T12:00:00Z",
  "dataContentType": "application/json",
  "data": {},
  "metadata": {
    "correlationId": "corr_123e4567-e89b-12d3-a456-426614174000",
    "userId": "usr_123",
    "requestId": "req_456"
  }
}
```

### Envelope Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Unique identifier for the event |
| `type` | string | Event type in format `{domain}.{event}` |
| `source` | string | Source service that emitted the event |
| `version` | string | Event schema version |
| `timestamp` | string (ISO8601) | When the event occurred |
| `dataContentType` | string | Content type of the data payload |
| `data` | object | Event payload |
| `metadata` | object | Additional contextual information |

### Metadata Fields

| Field | Type | Description |
|-------|------|-------------|
| `correlationId` | string (UUID) | ID linking related events in a transaction |
| `userId` | string | ID of the user who initiated the action (if applicable) |
| `requestId` | string | Original request ID that led to this event |
| `traceId` | string | Distributed tracing ID (if applicable) |

## Event Naming Convention

Event types should follow the pattern:
```
{domain}.{object}.{action}
```

Examples:
- `order.created`
- `order.status.updated`
- `payment.succeeded`
- `inventory.quantity.changed`
- `product.price.updated`

## Core Event Schemas

### User Events

#### `user.registered`

```json
{
  "type": "user.registered",
  "data": {
    "userId": "usr_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "role": "customer",
    "registeredAt": "2023-04-15T12:00:00Z"
  }
}
```

#### `user.updated`

```json
{
  "type": "user.updated",
  "data": {
    "userId": "usr_123",
    "updatedFields": ["firstName", "lastName", "phoneNumber"],
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "phoneNumber": "+1987654321",
    "updatedAt": "2023-04-15T14:30:00Z"
  }
}
```

### Product Events

#### `product.created`

```json
{
  "type": "product.created",
  "data": {
    "productId": "prod_123",
    "name": "Organic Banana",
    "description": "Fresh organic bananas",
    "categoryId": "cat_fruits",
    "basePrice": 2.99,
    "status": "active",
    "sku": "ORG-BAN-001",
    "createdAt": "2023-04-15T10:00:00Z"
  }
}
```

#### `product.updated`

```json
{
  "type": "product.updated",
  "data": {
    "productId": "prod_123",
    "updatedFields": ["price", "status"],
    "basePrice": 3.49,
    "status": "active",
    "updatedAt": "2023-04-15T11:30:00Z"
  }
}
```

#### `product.inventory.updated`

```json
{
  "type": "product.inventory.updated",
  "data": {
    "productId": "prod_123",
    "variantId": "var_456",
    "warehouseId": "wh_789",
    "previousQuantity": 100,
    "currentQuantity": 95,
    "reason": "order_fulfilled",
    "reference": "ord_123",
    "updatedAt": "2023-04-15T14:00:00Z"
  }
}
```

### Order Events

#### `order.created`

```json
{
  "type": "order.created",
  "data": {
    "orderId": "ord_123",
    "orderNumber": "ORD-12345",
    "customerId": "usr_456",
    "items": [
      {
        "productId": "prod_123",
        "variantId": "var_789",
        "quantity": 2,
        "unitPrice": 3.49,
        "totalPrice": 6.98
      },
      {
        "productId": "prod_234",
        "quantity": 1,
        "unitPrice": 4.99,
        "totalPrice": 4.99
      }
    ],
    "pricing": {
      "subtotal": 11.97,
      "discountTotal": 0,
      "shippingCost": 2.99,
      "tax": 1.50,
      "total": 16.46
    },
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "address1": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "postalCode": "12345",
      "country": "US"
    },
    "status": "pending",
    "createdAt": "2023-04-15T12:00:00Z"
  }
}
```

#### `order.status.updated`

```json
{
  "type": "order.status.updated",
  "data": {
    "orderId": "ord_123",
    "orderNumber": "ORD-12345",
    "customerId": "usr_456",
    "previousStatus": "pending",
    "currentStatus": "confirmed",
    "reason": "payment_succeeded",
    "note": "Payment successfully processed",
    "updatedAt": "2023-04-15T12:05:00Z",
    "updatedBy": "system" 
  }
}
```

#### `order.cancelled`

```json
{
  "type": "order.cancelled",
  "data": {
    "orderId": "ord_123",
    "orderNumber": "ORD-12345",
    "customerId": "usr_456",
    "previousStatus": "confirmed",
    "reason": "customer_request",
    "note": "Customer changed their mind",
    "cancelledAt": "2023-04-15T13:00:00Z",
    "cancelledBy": "usr_456",
    "refundRequired": true
  }
}
```

### Payment Events

#### `payment.initiated`

```json
{
  "type": "payment.initiated",
  "data": {
    "paymentId": "pay_123",
    "orderId": "ord_123",
    "customerId": "usr_456",
    "amount": 16.46,
    "currency": "USD",
    "method": "credit_card",
    "paymentMethodId": "pm_789",
    "initiatedAt": "2023-04-15T12:01:00Z"
  }
}
```

#### `payment.succeeded`

```json
{
  "type": "payment.succeeded",
  "data": {
    "paymentId": "pay_123",
    "orderId": "ord_123",
    "customerId": "usr_456",
    "amount": 16.46,
    "currency": "USD",
    "method": "credit_card",
    "transactionId": "tx_123",
    "completedAt": "2023-04-15T12:03:00Z"
  }
}
```

#### `payment.failed`

```json
{
  "type": "payment.failed",
  "data": {
    "paymentId": "pay_123",
    "orderId": "ord_123",
    "customerId": "usr_456",
    "amount": 16.46,
    "currency": "USD",
    "method": "credit_card",
    "errorCode": "card_declined",
    "errorMessage": "Card was declined",
    "failedAt": "2023-04-15T12:03:00Z"
  }
}
```

#### `payment.refunded`

```json
{
  "type": "payment.refunded",
  "data": {
    "refundId": "ref_123",
    "paymentId": "pay_123",
    "orderId": "ord_123",
    "customerId": "usr_456",
    "amount": 16.46,
    "currency": "USD",
    "reason": "order_cancelled",
    "note": "Customer cancelled order",
    "transactionId": "tx_456",
    "refundedAt": "2023-04-15T13:10:00Z"
  }
}
```

### Warehouse Events

#### `warehouse.order.received`

```json
{
  "type": "warehouse.order.received",
  "data": {
    "warehouseId": "wh_123",
    "orderId": "ord_123",
    "orderNumber": "ORD-12345",
    "priority": "normal",
    "items": [
      {
        "productId": "prod_123",
        "variantId": "var_789",
        "quantity": 2,
        "location": {
          "zone": "A",
          "aisle": "3",
          "shelf": "2",
          "bin": "5"
        }
      },
      {
        "productId": "prod_234",
        "quantity": 1,
        "location": {
          "zone": "B",
          "aisle": "1",
          "shelf": "4",
          "bin": "2"
        }
      }
    ],
    "receivedAt": "2023-04-15T12:10:00Z"
  }
}
```

#### `warehouse.order.picked`

```json
{
  "type": "warehouse.order.picked",
  "data": {
    "warehouseId": "wh_123",
    "orderId": "ord_123",
    "orderNumber": "ORD-12345",
    "pickedBy": "staff_123",
    "pickList": [
      {
        "productId": "prod_123",
        "variantId": "var_789",
        "quantity": 2,
        "pickedQuantity": 2,
        "substituted": false
      },
      {
        "productId": "prod_234",
        "quantity": 1,
        "pickedQuantity": 1,
        "substituted": false
      }
    ],
    "status": "complete",
    "notes": "",
    "pickedAt": "2023-04-15T12:25:00Z"
  }
}
```

#### `warehouse.order.packed`

```json
{
  "type": "warehouse.order.packed",
  "data": {
    "warehouseId": "wh_123",
    "orderId": "ord_123",
    "orderNumber": "ORD-12345",
    "packedBy": "staff_456",
    "packageCount": 1,
    "packages": [
      {
        "packageId": "pkg_123",
        "items": [
          {
            "productId": "prod_123",
            "variantId": "var_789",
            "quantity": 2
          },
          {
            "productId": "prod_234",
            "quantity": 1
          }
        ],
        "dimensions": {
          "length": 30,
          "width": 20,
          "height": 10,
          "unit": "cm"
        },
        "weight": {
          "value": 2.5,
          "unit": "kg"
        }
      }
    ],
    "packedAt": "2023-04-15T12:35:00Z"
  }
}
```

#### `warehouse.delivery.assigned`

```json
{
  "type": "warehouse.delivery.assigned",
  "data": {
    "deliveryId": "del_123",
    "orderId": "ord_123",
    "orderNumber": "ORD-12345",
    "warehouseId": "wh_123",
    "assignedTo": "driver_123",
    "estimatedDeliveryTime": "2023-04-15T14:00:00Z",
    "deliveryAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "address1": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "postalCode": "12345",
      "country": "US"
    },
    "customerContactInfo": {
      "phoneNumber": "+1234567890",
      "email": "john.doe@example.com"
    },
    "packageCount": 1,
    "assignedAt": "2023-04-15T12:40:00Z"
  }
}
```

#### `warehouse.delivery.completed`

```json
{
  "type": "warehouse.delivery.completed",
  "data": {
    "deliveryId": "del_123",
    "orderId": "ord_123",
    "orderNumber": "ORD-12345",
    "warehouseId": "wh_123",
    "deliveredBy": "driver_123",
    "deliveredTo": "John Doe",
    "deliveryProof": {
      "type": "signature",
      "referenceId": "sig_123"
    },
    "notes": "Left at front door",
    "deliveredAt": "2023-04-15T13:55:00Z"
  }
}
```

### Notification Events

#### `notification.requested`

```json
{
  "type": "notification.requested",
  "data": {
    "userId": "usr_123",
    "type": "order_status",
    "channels": ["email", "sms", "push"],
    "templateId": "template_order_confirmed",
    "variables": {
      "orderNumber": "ORD-12345",
      "customerName": "John",
      "estimatedDelivery": "2023-04-15T14:00:00Z"
    },
    "priority": "normal",
    "requestedAt": "2023-04-15T12:05:00Z"
  }
}
```

#### `notification.sent`

```json
{
  "type": "notification.sent",
  "data": {
    "notificationId": "not_123",
    "userId": "usr_123",
    "type": "order_status",
    "channels": ["email", "sms"],
    "deliveryStatus": {
      "email": "delivered",
      "sms": "delivered"
    },
    "sentAt": "2023-04-15T12:06:00Z"
  }
}
```

### Analytics Events

#### `analytics.order.completed`

```json
{
  "type": "analytics.order.completed",
  "data": {
    "orderId": "ord_123",
    "orderNumber": "ORD-12345",
    "customerId": "usr_456",
    "customerSegment": "regular",
    "totalAmount": 16.46,
    "itemCount": 3,
    "categories": ["fruits", "vegetables"],
    "paymentMethod": "credit_card",
    "isFirstOrder": false,
    "source": "web_app",
    "promoCode": null,
    "deliveryTime": 115, // minutes from order to delivery
    "completedAt": "2023-04-15T13:55:00Z"
  }
}
```

## Event Versioning

When event schemas need to change:

1. Increment the version number in the event envelope
2. Keep backward compatibility where possible
3. For breaking changes, publish events in both old and new formats during transition
4. Consumers should handle multiple versions of events

## Event Documentation Guidelines

For each event type, document:

1. Purpose of the event
2. Publisher service
3. Example subscribers
4. Complete schema with field descriptions
5. When the event is triggered
6. Example payload

## Event Validation

All published events must be validated against their schema before publication. Services should implement an event validation layer that:

1. Validates events against registered schemas
2. Rejects invalid events
3. Logs validation errors
4. Provides clear error messages about validation failures

## Dead Letter Queue Handling

For events that fail processing:

1. Move the event to a dead letter queue
2. Include failure reason and timestamp
3. Implement retry strategy with backoff
4. Alert on high DLQ volumes
5. Provide administrative tools to replay events

## Event Flow Patterns

### Change Data Capture

For database-based events:

```json
{
  "type": "database.product.updated",
  "data": {
    "before": {
      "id": "prod_123",
      "name": "Organic Banana",
      "price": 2.99,
      "stock": 100
    },
    "after": {
      "id": "prod_123",
      "name": "Organic Banana",
      "price": 3.49,
      "stock": 100
    },
    "updatedFields": ["price"],
    "operation": "UPDATE",
    "timestamp": "2023-04-15T11:30:00Z"
  }
}
```

### Command Pattern

For requested actions:

```json
{
  "type": "command.order.cancel",
  "data": {
    "orderId": "ord_123",
    "reason": "customer_request",
    "requestedBy": "usr_456",
    "requestedAt": "2023-04-15T13:00:00Z"
  }
}
```

### Correlation Pattern

For tracking related events:

```json
"metadata": {
  "correlationId": "corr_123e4567-e89b-12d3-a456-426614174000",
  "causationId": "evt_previous_event_id",
  "traceId": "trace_123"
}
```