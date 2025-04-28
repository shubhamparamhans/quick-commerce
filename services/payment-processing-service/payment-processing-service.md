Create a secure NodeJS Payment Processing Service for a quick commerce delivery platform with the following requirements:

1. Use Express.js with TypeScript and RESTful API design patterns
2. Implement PostgreSQL database for storing payment information:
   - Transactions (amount, status, timestamps, payment method)
   - Payment methods (card info with proper encryption)
   - Invoices and receipts
   - Refund records
3. Integrate with payment gateways:
   - Stripe as the primary payment processor
   - PayPal as an alternative option
   - Support for wallet-based payments
4. Implement endpoints for:
   - Processing payments for orders
   - Saving and managing payment methods securely
   - Generating invoices and receipts
   - Processing refunds (full and partial)
   - Payment status verification
   - Payment analytics and reporting
5. Follow PCI DSS compliance requirements for handling sensitive payment data
6. Use proper encryption for storing sensitive information
7. Implement idempotency to prevent duplicate payments
8. Create comprehensive error handling for payment failures
9. Add webhook handlers for payment status updates from payment providers
10. Include retry mechanisms for failed payments
11. Write unit and integration tests with Jest
12. Include Swagger/OpenAPI documentation

The service should be containerized with Docker, include proper security headers, implement rate limiting for payment endpoints, and follow microservice best practices.