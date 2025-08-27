# Employee Scheduler (MVC) - Starter

Stack: Node.js (Express) + MongoDB (Mongoose)
Structure follows MVC pattern: controllers, services, models, routes, validators, middleware.

Quick start:
1. Copy .env.example to .env and set MONGO_URI and JWT_SECRET.
2. npm install
3. npm run seed
4. npm start
5. Open Swagger at http://localhost:4000/api-docs

Features:
- Authentication (JWT) + RBAC (admin/manager/staff)
- Validation using express-validator
- Shift assignment with conflict checks (including overnight)
- Aggregation endpoint for coverage & conflicts (/analytics/coverage)
- Seed includes mixed roles, locations, teams, availability, time-offs, edge cases
