Create a NodeJS API Gateway and Integration Layer for a quick commerce delivery platform with these specifications:

1. Use Express.js or NestJS with TypeScript
2. Implement an API Gateway pattern using Kong, Express Gateway, or a custom solution
3. Create the following core functionality:
   - Request routing to appropriate microservices
   - Authentication and authorization middleware
   - Rate limiting and throttling
   - Request/response transformation
   - API versioning support
   - Circuit breaking for service resilience
   - Logging and monitoring
   - CORS handling
   - Response caching where appropriate
4. Implement service discovery using Consul or similar
5. Add service-to-service communication security
6. Create unified error handling and standardized responses
7. Implement request validation using JSON Schema
8. Add health check endpoints for services
9. Create comprehensive documentation with Swagger/OpenAPI
10. Implement GraphQL federation for frontend efficiency (optional)
11. Add analytics collection for API usage
12. Write integration tests for routes and middleware

The gateway should act as the single entry point for all client applications while handling cross-cutting concerns like security, monitoring, and reliability. Ensure proper load balancing and scalability features are implemented.