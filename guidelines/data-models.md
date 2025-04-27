# Quick Commerce Platform: Shared Data Models

This document defines the core data models used across the quick commerce platform. All microservices should adhere to these models for consistency and interoperability.

## User Models

### User
```json
{
  "id": "string (UUID)",
  "email": "string (email)",
  "phoneNumber": "string (optional)",
  "firstName": "string",
  "lastName": "string",
  "role": "enum (customer, warehouse_staff, admin)",
  "status": "enum (active, inactive, suspended)",
  "addresses": [
    {
      "id": "string (UUID)",
      "type": "enum (home, work, other)",
      "name": "string",
      "address1": "string",
      "address2": "string (optional)",
      "city": "string",
      "state": "string",
      "postalCode": "string",
      "country": "string",
      "isDefault": "boolean"
    }
  ],
  "createdAt": "ISO8601 timestamp",
  "updatedAt": "ISO8601 timestamp"
}
```

### Authentication
```json
{
  "userId": "string (UUID)",
  "email": "string (email)",
  "password": "string (hashed, never exposed in APIs)",
  "emailVerified": "boolean",
  "phoneVerified": "boolean",
  "twoFactorEnabled": "boolean",
  "twoFactorMethod": "enum (app, sms, email, none)",
  "lastLogin": "ISO8601 timestamp",
  "refreshToken": "string",
  "createdAt": "ISO8601 timestamp",
  "updatedAt": "ISO8601 timestamp"
}
```

## Product Models

### Product
```json
{
  "id": "string (UUID)",
  "name": "string",
  "description": "string",
  "shortDescription": "string",
  "categoryId": "string (UUID)",
  "brandId": "string (UUID, optional)",
  "images": [
    {
      "id": "string (UUID)",
      "url": "string (URL)",
      "altText": "string",
      "order": "number",
      "isPrimary": "boolean"
    }
  ],
  "status": "enum (active, inactive, out_of_stock, discontinued)",
  "tags": ["string"],
  "attributes": [
    {
      "key": "string",
      "value": "string"
    }
  ],
  "basePrice": "number (decimal)",
  "taxCategory": "string",
  "averageRating": "number (decimal)",
  "reviewCount": "number (integer)",
  "stockKeepingUnit": "string (SKU)",
  "barcode": "string (optional)",
  "weight": "number (optional)",
  "dimensions": {
    "length": "number (optional)",
    "width": "number (optional)",
    "height": "number (optional)",
    "unit": "enum (cm, inch)"
  },
  "metadata": "object (flexible key-value for product-specific data)",
  "createdAt": "ISO8601 timestamp",
  "updatedAt": "ISO8601 timestamp"
}
```

### Product Variant
```json
{
  "id": "string (UUID)",
  "productId": "string (UUID)",
  "name": "string",
  "attributes": [
    {
      "key": "string (e.g., 'color', 'size')",
      "value": "string (e.g., 'red', 'XL')"
    }
  ],
  "stockKeepingUnit": "string (SKU)",
  "barcode": "string (optional)",
  "price": "number (decimal, override of base price)",
  "salePrice": "number (decimal, optional)",
  "inventory": {
    "quantity": "number (integer)",
    "reservedQuantity": "number (integer)",
    "reorderPoint": "number (integer, optional)",
    "availableForSale": "boolean"
  },
  "images": [
    {
      "id": "string (UUID)",
      "url": "string (URL)",
      "altText": "string",
      "order": "number",
      "isPrimary": "boolean"
    }
  ],
  "weight": "number (optional, override of product weight)",
  "dimensions": {
    "length": "number (optional)",
    "width": "number (optional)",
    "height": "number (optional)",
    "unit": "enum (cm, inch)"
  },
  "createdAt": "ISO8601 timestamp",
  "updatedAt": "ISO8601 timestamp"
}
```

### Category
```json
{
  "id": "string (UUID)",
  "name": "string",
  "description": "string",
  "slug": "string (URL-friendly identifier)",
  "parentId": "string (UUID, optional for subcategories)",
  "level": "number (integer, hierarchy level)",
  "image": {
    "url": "string (URL)",
    "altText": "string"
  },
  "isActive": "boolean",
  "sortOrder": "number (integer)",
  "metadata": "object (flexible key-value for category-specific data)",
  "createdAt": "ISO8601 timestamp",
  "updatedAt": "ISO8601 timestamp"
}
```

## Order Models

### Order
```json
{
  "id": "string (UUID)",
  "orderNumber": "string (human-readable identifier)",
  "customerId": "string (UUID)",
  "status": "enum (pending, payment_processing, confirmed, preparing, ready_for_pickup, out_for_delivery, delivered, cancelled, refunded)",
  "items": [
    {
      "id": "string (UUID)",
      "productId": "string (UUID)",
      "variantId": "string (UUID, optional)",
      "name": "string",
      "quantity": "number (integer)",
      "unitPrice": "number (decimal)",
      "totalPrice": "number (decimal)",
      "discountAmount": "number (decimal)",
      "finalPrice": "number (decimal)",
      "metadata": "object (flexible key-value for item-specific data)"
    }
  ],
  "pricing": {
    "subtotal": "number (decimal, before tax and shipping)",
    "discountTotal": "number (decimal)",
    "shippingCost": "number (decimal)",
    "tax": "number (decimal)",
    "total": "number (decimal, final price)"
  },
  "shippingAddress": {
    "addressId": "string (UUID, optional reference to saved address)",
    "firstName": "string",
    "lastName": "string",
    "address1": "string",
    "address2": "string (optional)",
    "city": "string",
    "state": "string",
    "postalCode": "string",
    "country": "string",
    "phoneNumber": "string"
  },
  "billingAddress": {
    "sameAsShipping": "boolean",
    "addressId": "string (UUID, optional reference to saved address)",
    "firstName": "string",
    "lastName": "string",
    "address1": "string",
    "address2": "string (optional)",
    "city": "string",
    "state": "string",
    "postalCode": "string",
    "country": "string",
    "phoneNumber": "string"
  },
  "payment": {
    "status": "enum (pending, processing, completed, failed, refunded)",
    "method": "enum (credit_card, debit_card, wallet, cod)",
    "transactionId": "string (optional)",
    "amount": "number (decimal)",
    "paymentDate": "ISO8601 timestamp (optional)"
  },
  "delivery": {
    "method": "enum (standard, express)",
    "trackingNumber": "string (optional)",
    "carrier": "string (optional)",
    "estimatedDelivery": "ISO8601 timestamp",
    "actualDelivery": "ISO8601 timestamp (optional)",
    "status": "enum (pending, preparing, out_for_delivery, delivered)",
    "notes": "string (optional)"
  },
  "discounts": [
    {
      "code": "string (optional)",
      "type": "enum (percentage, fixed_amount, free_shipping)",
      "value": "number (decimal)",
      "description": "string"
    }
  ],
  "notes": "string (optional, customer notes)",
  "internalNotes": "string (optional, staff notes)",
  "metadata": "object (flexible key-value for order-specific data)",
  "statusHistory": [
    {
      "status": "enum (same as order status)",
      "timestamp": "ISO8601 timestamp",
      "note": "string (optional)",
      "userId": "string (UUID, optional, who changed the status)"
    }
  ],
  "createdAt": "ISO8601 timestamp",
  "updatedAt": "ISO8601 timestamp"
}
```

## Payment Models

### Payment
```json
{
  "id": "string (UUID)",
  "orderId": "string (UUID)",
  "customerId": "string (UUID)",
  "amount": "number (decimal)",
  "currency": "string (ISO currency code)",
  "status": "enum (pending, processing, completed, failed, refunded)",
  "method": "enum (credit_card, debit_card, wallet, cod)",
  "paymentMethodId": "string (UUID, reference to saved payment method)",
  "transactionId": "string (payment provider transaction ID)",
  "gatewayResponse": "object (response from payment gateway)",
  "refunds": [
    {
      "id": "string (UUID)",
      "amount": "number (decimal)",
      "reason": "string",
      "status": "enum (pending, completed, failed)",
      "transactionId": "string",
      "createdAt": "ISO8601 timestamp"
    }
  ],
  "billingAddress": {
    "firstName": "string",
    "lastName": "string",
    "address1": "string",
    "address2": "string (optional)",
    "city": "string",
    "state": "string",
    "postalCode": "string",
    "country": "string"
  },
  "metadata": "object (flexible key-value for payment-specific data)",
  "createdAt": "ISO8601 timestamp",
  "updatedAt": "ISO8601 timestamp"
}
```

### Payment Method
```json
{
  "id": "string (UUID)",
  "customerId": "string (UUID)",
  "type": "enum (credit_card, debit_card, wallet)",
  "provider": "string (payment provider name)",
  "token": "string (tokenized payment info)",
  "details": {
    "cardBrand": "string (e.g., Visa, Mastercard)",
    "last4": "string (last 4 digits of card)",
    "expiryMonth": "string (MM)",
    "expiryYear": "string (YYYY)",
    "cardholderName": "string"
  },
  "isDefault": "boolean",
  "billingAddressId": "string (UUID, optional)",
  "metadata": "object (flexible key-value for method-specific data)",
  "createdAt": "ISO8601 timestamp",
  "updatedAt": "ISO8601 timestamp"
}
```

## Inventory Models

### Inventory
```json
{
  "productId": "string (UUID)",
  "variantId": "string (UUID, optional)",
  "warehouseId": "string (UUID)",
  "location": {
    "zone": "string",
    "aisle": "string",
    "shelf": "string",
    "bin": "string"
  },
  "quantity": "number (integer)",
  "reservedQuantity": "number (integer)",
  "availableQuantity": "number (integer)",
  "reorderPoint": "number (integer)",
  "reorderQuantity": "number (integer)",
  "lastStockCheck": "ISO8601 timestamp",
  "updatedAt": "ISO8601 timestamp"
}
```

### Warehouse
```json
{
  "id": "string (UUID)",
  "name": "string",
  "code": "string (unique identifier)",
  "address": {
    "address1": "string",
    "address2": "string (optional)",
    "city": "string",
    "state": "string",
    "postalCode": "string",
    "country": "string"
  },
  "contactInfo": {
    "phoneNumber": "string",
    "email": "string"
  },
  "status": "enum (active, inactive)",
  "operatingHours": [
    {
      "day": "enum (monday to sunday)",
      "openTime": "string (HH:MM)",
      "closeTime": "string (HH:MM)",
      "isClosed": "boolean"
    }
  ],
  "servicingRegions": [
    {
      "city": "string",
      "state": "string",
      "country": "string",
      "postalCodes": ["string"]
    }
  ],
  "metadata": "object (flexible key-value for warehouse-specific data)",
  "createdAt": "ISO8601 timestamp",
  "updatedAt": "ISO8601 timestamp"
}
```

## Support Models

### Support Ticket
```json
{
  "id": "string (UUID)",
  "ticketNumber": "string (human-readable identifier)",
  "customerId": "string (UUID)",
  "orderId": "string (UUID, optional)",
  "subject": "string",
  "description": "string",
  "status": "enum (open, in_progress, waiting_for_customer, resolved, closed)",
  "priority": "enum (low, medium, high, urgent)",
  "category": "enum (order_issue, product_question, delivery_problem, return_request, account_issue, other)",
  "assigneeId": "string (UUID, optional, support agent ID)",
  "attachments": [
    {
      "id": "string (UUID)",
      "fileName": "string",
      "fileType": "string",
      "url": "string",
      "uploadedAt": "ISO8601 timestamp"
    }
  ],
  "messages": [
    {
      "id": "string (UUID)",
      "senderId": "string (UUID)",
      "senderType": "enum (customer, agent, system)",
      "content": "string",
      "createdAt": "ISO8601 timestamp",
      "attachments": [
        {
          "id": "string (UUID)",
          "fileName": "string",
          "fileType": "string",
          "url": "string"
        }
      ]
    }
  ],
  "metadata": "object (flexible key-value for ticket-specific data)",
  "statusHistory": [
    {
      "status": "enum (same as ticket status)",
      "timestamp": "ISO8601 timestamp",
      "userId": "string (UUID)",
      "note": "string (optional)"
    }
  ],
  "createdAt": "ISO8601 timestamp",
  "updatedAt": "ISO8601 timestamp"
}
```

## Notification Models

### Notification
```json
{
  "id": "string (UUID)",
  "userId": "string (UUID)",
  "type": "enum (order_status, delivery_update, promotion, system_alert, payment)",
  "title": "string",
  "content": "string",
  "data": "object (context data related to notification)",
  "priority": "enum (low, normal, high)",
  "channels": ["enum (email, sms, push, in_app)"],
  "status": {
    "read": "boolean",
    "readAt": "ISO8601 timestamp (optional)",
    "delivered": {
      "email": "boolean",
      "sms": "boolean",
      "push": "boolean",
      "in_app": "boolean"
    },
    "deliveredAt": {
      "email": "ISO8601 timestamp (optional)",
      "sms": "ISO8601 timestamp (optional)",
      "push": "ISO8601 timestamp (optional)",
      "in_app": "ISO8601 timestamp (optional)"
    }
  },
  "createdAt": "ISO8601 timestamp",
  "scheduledFor": "ISO8601 timestamp (optional, for scheduled notifications)"
}
```

### Notification Template
```json
{
  "id": "string (UUID)",
  "name": "string",
  "type": "enum (order_status, delivery_update, promotion, system_alert, payment)",
  "channels": ["enum (email, sms, push, in_app)"],
  "templates": {
    "email": {
      "subject": "string (with variable placeholders)",
      "body": "string (HTML with variable placeholders)",
      "sender": "string (email address)"
    },
    "sms": {
      "body": "string (with variable placeholders)"
    },
    "push": {
      "title": "string (with variable placeholders)",
      "body": "string (with variable placeholders)",
      "imageUrl": "string (URL, optional)"
    },
    "in_app": {
      "title": "string (with variable placeholders)",
      "body": "string (with variable placeholders)",
      "imageUrl": "string (URL, optional)",
      "action": "string (optional, deep link or action identifier)"
    }
  },
  "variables": ["string (list of expected variables for template)"],
  "isActive": "boolean",
  "createdAt": "ISO8601 timestamp",
  "updatedAt": "ISO8601 timestamp"
}
```

## Analytics Models

### Analytics Event
```json
{
  "id": "string (UUID)",
  "timestamp": "ISO8601 timestamp",
  "userId": "string (UUID, optional)",
  "sessionId": "string",
  "eventType": "string (e.g., page_view, product_view, add_to_cart)",
  "source": "enum (web_app, warehouse_app, admin_dashboard, system)",
  "data": "object (event-specific data)",
  "metadata": {
    "ip": "string (IP address)",
    "userAgent": "string",
    "referrer": "string (optional)",
    "device": "string (optional)",
    "location": {
      "country": "string (optional)",
      "region": "string (optional)",
      "city": "string (optional)"
    }
  }
}
```