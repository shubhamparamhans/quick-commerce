## Authentication Service Prompt

```
Generate a complete NodeJS Authentication Service for a quick commerce delivery application with the following requirements:

1. Use Express.js framework and follow RESTful API design
2. Implement JWT-based authentication with refresh token mechanism
3. Support user roles: Customer, Warehouse Staff, Delivery Personnel, and Admin
4. Include endpoints for:
   - User registration with email verification
   - Login/logout functionality
   - Password reset flow
   - Profile management (view/update)
   - Role-based authorization middleware
   - Social login integration (Google, Facebook)
   - Optional 2FA using authenticator apps
5. Include proper error handling, input validation using Joi or similar
6. Store user data in MongoDB with encrypted passwords using bcrypt
7. Include comprehensive unit tests using Jest
8. Implement rate limiting for security
9. Use TypeScript for better type safety
10. Follow microservice architecture best practices with clear separation of concerns
11. Include Swagger/OpenAPI documentation

The service must be containerized with Docker and include relevant environment configurations. Ensure the code follows industry best practices for security in e-commerce applications.
```