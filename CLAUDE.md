# CLAUDE.md

## Project Goal
Build a personal money management app focused on monthly spending control.

Primary flow:
- User inputs expenses manually via Telegram.
- The system stores each expense.
- The user monitors monthly spending progress via Telegram and a private web dashboard.

## MVP Scope
- Expense only.
- Monthly budget as a single total target.
- Manual transaction input.
- Private dashboard login.
- Monthly summary and transaction history.

## Recommended Tech Stack

### Core Stack
- TypeScript
- Next.js for the web dashboard and API layer
- PostgreSQL for persistent storage
- Prisma for database access and migrations
- Telegram bot using Telegraf

### UI Stack
- React
- Tailwind CSS
- shadcn/ui for reusable dashboard components
- Lucide icons for simple iconography

### Validation and Utilities
- Zod for input validation
- date-fns for date handling
- bcrypt or a similar secure hashing library for dashboard authentication

### Testing
- Vitest for unit tests
- Playwright for end-to-end dashboard tests

### Tooling
- ESLint
- Prettier
- Docker and Docker Compose for local development

## Suggested Architecture
- Use a small monorepo-style setup so the Telegram bot and the dashboard can evolve independently.
- Keep the Telegram bot as a separate process from the web app, even if they share the same database and code for validation or business rules.
- Put shared domain logic in a common module so transaction parsing, budget calculations, and validation stay consistent.
- Use PostgreSQL as the single source of truth for expenses, budgets, and Telegram user linkage.
- Expose all data mutations through a shared service layer so both Telegram and the dashboard use the same business rules.

## Core Data
Each expense should capture:
- amount
- date
- category
- short note
- created_at
- user_id or Telegram linkage

## Product Rules
- Keep it simple.
- Do not overengineer features that are not needed for the MVP.
- Telegram is the main input channel.
- The web dashboard is for monitoring and review.
- Monthly total spending must be compared against the monthly target.
- If the budget is near or over the limit, the system should make that clear.

## Non-Goals For MVP
- Income tracking
- Net worth or balance tracking
- Category-specific budgets
- Multi-user enterprise permissions
- Complex finance analytics

## Implementation Guidance
- Prefer a clean, maintainable architecture.
- If the stack is not defined yet, use the recommended stack above.
- Keep Telegram bot logic, business logic, and dashboard UI separated.
- Make sure data written from Telegram is immediately visible in the dashboard.
- Use simple, explicit naming for tables, fields, and UI labels.

## Working Style
- Ask before making major scope changes.
- Prefer small, incremental changes.
- When adding a feature, ensure it fits the MVP goal and does not add unnecessary complexity.
