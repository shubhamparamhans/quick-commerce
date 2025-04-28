Develop a comprehensive NodeJS Warehouse Management Service for a quick commerce delivery application with these requirements:

1. Use Express.js with TypeScript and RESTful API design
2. Implement MongoDB for storing warehouse information:
   - Inventory (product, quantity, location within warehouse)
   - Warehouse zones and shelf locations
   - Pick lists and packing instructions
   - Staff assignments and performance metrics
   - Quality control checkpoints
3. Create endpoints for:
   - Inventory management (view/update stock levels)
   - Order picking optimization (shortest path algorithm)
   - Packing workflow management
   - Staff task assignment and tracking
   - Delivery handoff process
   - Returns processing
   - Inventory forecasting and reordering suggestions
4. Implement real-time inventory synchronization
5. Add barcode/QR code generation and processing
6. Create batch processing for bulk operations
7. Implement webhooks to notify other services of inventory changes
8. Add reporting endpoints for warehouse efficiency metrics
9. Include comprehensive input validation and error handling
10. Write unit and integration tests using Jest
11. Include Swagger/OpenAPI documentation

The service should be containerized with Docker, follow microservice architecture best practices, include proper logging for warehouse operations, and support multiple warehouse locations.