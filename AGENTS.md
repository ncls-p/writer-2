# AGENTS.md - AI Agent Guidelines for Writer

This file contains critical rules and patterns for AI agents working in this codebase.
Read this file before implementing any code.

## Technology Stack

| Category    | Technology                                           |
|-------------|------------------------------------------------------|
| Framework   | Next.js 14+ (App Router)                             |
| Language    | TypeScript 5.x (Strict Mode)                         |
| UI          | shadcn/ui (Radix), Tailwind CSS, Framer Motion       |
| Auth        | Better Auth (Prisma Adapter)                         |
| Database    | PostgreSQL via Prisma ORM                            |
| Vector DB   | Qdrant (`@qdrant/js-client-grpc`)                    |
| Queue       | BullMQ + Redis (ioredis)                             |
| LLM         | Vercel AI SDK (`ai`, `@ai-sdk/openai`, `@ai-sdk/anthropic`) |
| Testing     | Vitest (unit), Playwright (E2E), Storybook           |
| Deployment  | Docker Compose (self-hosted)                         |

## Build/Lint/Test Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build

# Linting & Formatting
npm run lint             # ESLint
npm run lint:fix         # ESLint with auto-fix
npm run format           # Prettier format
npm run typecheck        # TypeScript type checking

# Testing
npm run test             # Run all unit tests (Vitest)
npm run test:watch       # Watch mode
npx vitest <path>        # Run single test file
npx vitest -t "name"     # Run test by name pattern

# Integration & E2E
npm run test:integration # Integration tests (requires Docker)
npm run test:e2e         # Playwright E2E tests
npx playwright test <file> # Run single E2E test

# Database
npx prisma migrate dev   # Run migrations
npx prisma generate      # Generate Prisma client
```

## Project Structure

```
src/
├── app/                  # Next.js App Router (Presentation layer)
│   ├── api/v1/          # REST API routes
│   ├── (auth)/          # Auth-related pages
│   └── (dashboard)/     # Main app pages
├── modules/             # Feature modules (Clean Architecture)
│   └── <module>/
│       ├── domain/      # Entities, Value Objects (pure TS)
│       ├── application/ # Use Cases, Ports (interfaces)
│       ├── infrastructure/ # Adapters (DB, APIs)
│       └── index.ts     # Public API (ONLY export from here)
├── components/
│   ├── ui/              # shadcn/ui components
│   └── features/        # Feature-specific components
├── lib/                 # Shared utilities (env.ts, result.ts)
└── tests/               # integration/ and e2e/ tests
```

## Architecture Rules

### Clean Architecture Boundaries
- **domain/**: Pure TypeScript. NO framework imports (Next.js, Prisma, Zod)
- **application/**: Use Cases only. Orchestration, no implementation details
- **infrastructure/**: Implementations. DB adapters, third-party API clients
- **app/**: Presentation only. Next.js pages, layouts, API routes

### Module Encapsulation
- Modules in `src/modules/*` interact ONLY via their `index.ts` public API
- Good: `import { SearchService } from '@/modules/search'`
- Bad: `import { SearchAdapter } from '@/modules/search/infrastructure/adapter'`

### API Routes Pattern
- Use `src/app/api/v1/*` for all backend endpoints
- NO Server Actions for public API or complex mutations
- Routes must be thin: validate -> call UseCase -> return JSON

## Code Style Guidelines

### Naming Conventions
| Type              | Convention        | Example                          |
|-------------------|-------------------|----------------------------------|
| Files             | kebab-case        | `user-profile.tsx`               |
| Classes           | PascalCase        | `UserProfile`, `SearchService`   |
| Variables/Funcs   | camelCase         | `getUserById`, `searchResults`   |
| Constants         | SCREAMING_SNAKE   | `MAX_RETRIES`, `API_BASE_URL`    |
| DB Tables         | snake_case plural | `users`, `search_queries`        |

### Imports Order
1. Node.js built-ins (`import path from 'path'`)
2. External packages (`import { z } from 'zod'`)
3. Internal aliases (`import { Button } from '@/components/ui'`)
4. Relative imports (`import { helper } from './utils'`)
5. Types last (`import type { User } from '@/types'`)

### TypeScript Rules
- **NO** `any` or `as never` - use `unknown` with validation
- All DTOs validated with Zod schemas
- Always await promises - no floating promises

### React/Next.js Rules
- Default to Server Components; add `'use client'` only when needed
- Extract logic into custom hooks (`useSearch()`)
- Use TanStack Query for client-side data fetching
- Use shadcn/ui components as-is; don't override styles unnecessarily

## Error Handling

Use Result pattern for expected errors. Never throw for business logic failures.

```typescript
// Good - use Result for expected errors
function findUser(id: string): Result<User, NotFoundError> {
  const user = await db.user.findUnique({ where: { id } });
  if (!user) return Result.fail(new NotFoundError('User not found'));
  return Result.ok(user);
}

// Bad - throwing for expected cases
function findUser(id: string): User {
  if (!user) throw new Error('User not found'); // Don't do this
}
```

API errors: Return `{ error: { code, message, details? } }` with appropriate HTTP status.

## Testing Guidelines

- **Unit Tests (`*.spec.ts`)**: Co-locate with source. Mock external deps. Test business logic.
- **Integration Tests (`tests/integration/*.test.ts`)**: Real DB/Qdrant via Docker.
- **E2E Tests (`tests/e2e/*.spec.ts`)**: Critical user flows only. Keep fast.

## Anti-Patterns (AVOID)

- **Logic in Controllers**: API routes must not contain `prisma.find...` calls
- **Leaking Infrastructure**: Never return Prisma objects to frontend - map to DTOs
- **Mixed Responsibilities**: Services must not handle `NextResponse`
- **Hardcoded Config**: Use `lib/env.ts` for typed environment variables
- **God Components**: Break down large components, max ~200 lines

## Comments & Git

- Comments: Explain WHY, not WHAT. Use JSDoc for public APIs.
- Commits: Use conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`)

---

Last Updated: 2026-01-11
