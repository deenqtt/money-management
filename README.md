# Money Management MVP

Bootstrap monorepo for a Telegram-first personal money management app.

## Scope
- Manual expense input through Telegram
- PostgreSQL + Prisma persistence
- Monthly budget summary
- Private dashboard for monitoring

## Structure
- `apps/web`: Next.js dashboard
- `apps/bot`: Telegram bot
- `packages/shared`: domain logic, validation, and budget summary
- `packages/database`: Prisma client and repository adapter

## Setup
1. Copy `.env.example` to `.env`.
2. Start PostgreSQL with `docker compose up -d`.
   - The container listens on host port `5433` so it does not collide with a local Postgres on `5432`.
3. Install dependencies.
4. Run `npm run prisma:generate`.
5. Apply the schema with `npm run db:push`.
6. Seed the admin user with `npm run prisma:seed`.

## Run
- One command for both:
  ```bash
  npm run dev
  ```
- Dashboard only:
  ```bash
  npm run dev:web
  ```
- Telegram bot:
  ```bash
  npm run dev:bot
  ```

## Dashboard Login
- Email: value from `DASHBOARD_ADMIN_EMAIL` in `.env`
- Password: value from `DASHBOARD_ADMIN_PASSWORD` in `.env`

## Telegram Bot
- Create a bot with `@BotFather`
- Put the token into `TELEGRAM_BOT_TOKEN` in `.env`
- Start the bot with `npm run dev:bot`
- In Telegram, use:
  - `/link` to attach your account to the dashboard user
  - `/expense 15000 food lunch`
  - `/summary`
  - `/recent`

## Deploying the web app to Vercel
The dashboard can be deployed to Vercel. The Telegram bot should stay on a separate host, because the current bot uses long-running polling and Vercel is not a good fit for that runtime model.

1. Push this repo to GitHub.
2. In Vercel, import the repository as a new project.
3. Set the project root to the repository root.
4. Keep the web app as the deployed target.
5. Set the production build command to:
   ```bash
   npm run build:web
   ```
6. Add these environment variables in Vercel:
   - `DATABASE_URL`
   - `DASHBOARD_COOKIE_SECRET`
   - `DASHBOARD_ADMIN_EMAIL`
   - `DASHBOARD_ADMIN_PASSWORD`
   - `DASHBOARD_ADMIN_PASSWORD_HASH` if you want to override the generated hash
7. Point `DATABASE_URL` at a hosted Postgres instance that Vercel can reach.
8. Do not set `TELEGRAM_BOT_TOKEN` for the Vercel web project unless you also plan to run the bot elsewhere.

If you want the Telegram bot on Vercel too, I need to convert it from polling to webhook mode first.

## Notes
- The dashboard and Telegram bot read from the same PostgreSQL database.
- The seed script hashes `DASHBOARD_ADMIN_PASSWORD` if you do not provide `DASHBOARD_ADMIN_PASSWORD_HASH`.
- The bot will auto-link to the dashboard user when `DASHBOARD_ADMIN_EMAIL` matches an existing user.
