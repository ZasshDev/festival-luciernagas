# LuciMap

LuciMap is a full-stack reservation and interactive map management system for the Festival Internacional de las Luciérnagas 2026.

## Architecture

This project strictly follows a **Clean Architecture (MVC + Repository Pattern)** layout:

\`\`\`
Request 
  → Route (thin HTTP layer)
  → Middlewares (authGuard, roleGuard, validate)
  → Controller (orchestrates request/response)
  → Service (pure business logic)
  → Repository (data access, Prisma queries)
  → PostgreSQL
\`\`\`

### Refactorings Applied
1. **Extract AvailabilityService**: Validations for the festival period, maintenance days, and overlap checks were pulled out of the controller into a standalone pure service. This makes unit testing the dates possible without DB/HTTP mocks.
2. **Middleware Composition**: Auth checks are handled using Express middlewares (`authGuard` and `roleGuard`). This removes repeated JWT extraction logic from controllers and centralizes security.

## Security Features Implemented
- **Password Hashing:** `bcrypt` (cost 12)
- **Authentication:** JWT inside `httpOnly` cookies (24h)
- **Input Validation:** End-to-end `zod` schemas
- **SQL Injection Prevention:** Prisma automatically parameterizes queries
- **Authorization:** Strong role checks (CLIENT vs ADMIN)
- **Rate Limiting:** `express-rate-limit` on `/api/auth/*`
- **Secrets Management:** Use of `.env` files.

## Project Setup

### 1. Prerequisites
- Node.js 18+
- PostgreSQL database

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
# Configure your .env from .env.example
npx prisma db push
npm run prisma:seed
npm run dev
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd frontend
npm install
# Configure your .env from .env.example
npm run dev
\`\`\`

## Running Tests
In the `backend` directory:
\`\`\`bash
# Run unit and integration tests
npm run test
\`\`\`
