Create a comprehensive NodeJS Analytics & Reporting Service for a quick commerce delivery platform with the following specifications:

1. Use Express.js with TypeScript and RESTful API design
2. Implement PostgreSQL for storing aggregated data with the following models:
   - Sales analytics (revenue, orders count, average order value)
   - Customer analytics (acquisition, retention, lifetime value)
   - Product analytics (top sellers, slow movers, profit margins)
   - Operational analytics (delivery times, warehouse efficiency)
   - Marketing performance (promotion effectiveness, conversion rates)
3. Create endpoints for:
   - Dashboard metrics and KPIs
   - Custom report generation with filtering options
   - Data export in multiple formats (CSV, Excel, PDF)
   - Scheduled reports delivery via email
   - Real-time analytics streaming for dashboards
4. Implement data aggregation pipelines from other services
5. Add time-series analysis for trend identification
6. Create forecasting algorithms for sales and inventory
7. Implement caching strategy for improved performance
8. Include data visualization helpers (chart data formatting)
9. Add comprehensive validation and error handling
10. Write unit and integration tests using Jest
11. Include Swagger/OpenAPI documentation

The service should implement ETL processes to collect data from other microservices, be containerized with Docker, and follow best practices for handling large datasets efficiently.