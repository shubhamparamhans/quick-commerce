Create a scalable NodeJS Notification Service for a quick commerce delivery platform with the following specifications:

1. Use Express.js with TypeScript and event-driven architecture
2. Implement MongoDB for storing notification data:
   - Notification templates
   - Notification history
   - User preferences and settings
   - Delivery status and metrics
3. Develop integrations for multiple notification channels:
   - Email using Nodemailer with SMTP or SendGrid/Mailgun
   - SMS using Twilio or similar service
   - Push notifications using Firebase Cloud Messaging
   - In-app notifications via WebSockets
4. Create endpoints for:
   - Sending notifications across channels
   - Managing notification templates
   - User notification preferences
   - Notification history and tracking
   - Scheduling notifications for future delivery
   - Batch notification processing
5. Implement message queue consumer (RabbitMQ/Kafka) for handling notification requests
6. Add rate limiting and throttling to prevent notification spam
7. Create retry mechanism for failed notification delivery
8. Implement template rendering with handlebars or similar
9. Add analytics for notification delivery and engagement
10. Include comprehensive validation and error handling
11. Write unit and integration tests using Jest
12. Include Swagger/OpenAPI documentation

The service should be containerized with Docker, follow microservice architecture best practices, implement proper logging of notification activities, and include monitoring hooks.