Develop a robust NodeJS Order Management Service for a quick commerce delivery application with these specifications:

1. Use Express.js framework with TypeScript and RESTful API design
2. Implement PostgreSQL database for storing order information with the following entities:
   - Orders (customer info, delivery address, payment status, order status)
   - OrderItems (products, quantities, pricing)
   - OrderStatus history (timestamps for ordered, confirmed, packed, shipped, delivered)
   - Delivery information (delivery person, estimated delivery time)
3. Create endpoints for:
   - Order creation and modification
   - Order status updates with history tracking
   - Order cancellation with inventory adjustment
   - Order search and filtering (by status, date, customer)
   - Delivery time estimation based on warehouse location and customer address
   - Returns and refunds processing
4. Implement event-driven architecture using RabbitMQ or Kafka for:
   - Inventory updates when orders are placed/canceled
   - Payment processing communication
   - Notification triggers at key order status changes
5. Include comprehensive validation, error handling and transaction management
6. Implement order analytics for reporting (conversion rates, average order value)
7. Add real-time order tracking capabilities
8. Create unit and integration tests using Jest
9. Implement database migrations using Sequelize or similar
10. Include Swagger/OpenAPI documentation

The service should be containerized with Docker, follow microservice best practices, and include proper logging and monitoring capabilities for production scenarios.