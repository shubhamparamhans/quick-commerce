## Product Catalog Service Prompt

```
Create a comprehensive NodeJS Product Catalog Service for a quick commerce delivery platform with the following specifications:

1. Use Express.js and follow RESTful API principles
2. Implement MongoDB for storing product information with the following schemas:
   - Product (name, description, base price, availability, images, avg rating)
   - ProductVariant (size, color, weight, price adjustment, SKU, inventory count)
   - Category (hierarchical structure, with parent/child relationships)
   - ProductAttribute (customizable attributes like "organic", "refrigerated", etc.)
3. Include endpoints for:
   - CRUD operations for products, variants, categories, and attributes
   - Product search with filtering (by category, price range, attributes)
   - Product recommendation based on popularity/related items
   - Inventory management (check/update stock levels)
   - Bulk import/export capabilities
   - Product review and rating management
4. Implement caching strategy using Redis for improved performance
5. Include inventory tracking and low-stock notifications
6. Add image upload and management (with resizing) using cloud storage
7. Implement search using MongoDB aggregation or Elasticsearch integration
8. Include comprehensive input validation and error handling
9. Write unit and integration tests using Jest
10. Use TypeScript for improved type safety
11. Include Swagger/OpenAPI documentation

Ensure the service follows microservice best practices, is containerized with Docker, and includes proper logging and monitoring hooks.
