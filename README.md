# Dietkem Monorepo

A modern monorepo using TurboRepo, featuring a React frontend with tRPC and Drizzle ORM.

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + tRPC
- **Database**: PostgreSQL + Drizzle ORM
- **Package Manager**: pnpm
- **Build System**: TurboRepo

## Prerequisites

- Node.js >= 18
- pnpm >= 8.15.4
- Docker and Docker Compose

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the PostgreSQL database:
   ```bash
   docker-compose up -d
   ```

3. Push the database schema:
   ```bash
   pnpm --filter @dietkem/db db:push
   ```

4. Start the development servers:
   ```bash
   pnpm dev
   ```

This will start:
- Frontend at http://localhost:3000
- Backend at http://localhost:3001
- PostgreSQL at localhost:5432

## Project Structure

```
.
├── apps/
│   ├── web/          # React frontend
│   └── api/          # tRPC backend
├── packages/
│   └── db/           # Database schema and client
├── docker-compose.yml
└── package.json
```

## Available Scripts

- `pnpm dev` - Start all services in development mode
- `pnpm build` - Build all packages and applications
- `pnpm lint` - Run linting for all packages
- `pnpm format` - Format all files with Prettier 