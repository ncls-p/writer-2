---
project_name: 'Writer'
user_name: 'User'
date: '2026-01-06'
sections_completed:
  - technology_stack
  - language_rules
  - framework_rules
  - testing_rules
  - quality_rules
  - workflow_rules
  - critical_rules
status: 'complete'
rule_count: 27
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript 5.x (Strict Mode)
- **UI:** shadcn/ui (Radix Primitives), Tailwind CSS, Framer Motion
- **Auth:** Better Auth (Prisma Adapter)
- **Database:** PostgreSQL (via Prisma ORM)
- **Vector DB:** Qdrant (gRPC client via `@qdrant/js-client-grpc`)
- **Queue:** BullMQ + Redis (ioredis)
- **LLM:** Vercel AI SDK (`ai`, `@ai-sdk/openai`, `@ai-sdk/anthropic`)
- **Testing:** Vitest (Unit), Playwright (E2E), Storybook
- **Deployment:** Docker Compose (Self-hosted)

## Critical Implementation Rules

### Architecture & Boundaries
1. **Clean Architecture Strictness:**
   - `domain/`: Pure TS. NO framework imports (Next.js, Prisma, Zod).
   - `application/`: Use Cases. Orchestration only.
   - `infrastructure/`: Implementations. DB access, 3rd party APIs.
   - `app/`: Presentation. Next.js pages/layouts only.
2. **Module Encapsulation:**
   - Modules (`src/modules/*`) must interact ONLY via their `index.ts` Public API.
   - **Forbidden:** `import { ... } from '../../other-module/infra/adapter'`
3. **REST API Pattern:**
   - Use API Routes (`src/app/api/v1/*`) for all backend logic.
   - **NO** Server Actions for public API or complex mutations (keep it standard).
   - API Routes must be thin: Validate request -> Call UseCase -> Return JSON.

### Language-Specific Rules (TypeScript)
1. **Result Pattern:**
   - Use `Result.ok(value)` or `Result.fail(error)` for logic flows.
   - **NEVER** throw exceptions for expected business errors (e.g., "User not found").
   - Only throw for catastrophic implementation bugs.
2. **Type Safety:**
   - **NO** `any` or `as never`. Use `unknown` with validation if needed.
   - All DTOs must be validated with Zod.
3. **Async/Await:**
   - Always await promises. No floating promises.

### Framework-Specific Rules (Next.js & React)
1. **Components:**
   - Default to Server Components. Add `'use client'` only when interaction is needed.
   - Separate logic into Custom Hooks (`useSearch()`) rather than inside components.
2. **Shadcn/UI:**
   - Use provided components in `components/ui`.
   - Do NOT override styles with arbitary Tailwind unless absolutely necessary.
3. **Data Fetching:**
   - Use **TanStack Query** for client-side data fetching.

### Testing Rules
1. **Unit Tests (`*.spec.ts`):**
   - Co-located with source files.
   - Test Domain Entities and Use Cases in isolation (Mock everything else).
2. **Integration Tests (`tests/integration/*.test.ts`):**
   - Test Infrastructure Adapters (Real DB/Qdrant using Docker).
3. **E2E Tests (`tests/e2e/*.spec.ts`):**
   - Critical user flows only (Login -> Search -> Result).

### Code Quality & Style Rules
- **Naming Conventions:**
  - Files: `kebab-case.ts` (e.g., `user-profile.tsx`, `search.service.ts`)
  - Classes: `PascalCase` (e.g., `UserProfile`, `SearchService`)
  - Variables/Functions: `camelCase`
  - DB Tables: `snake_case` (plural)
- **Comments:**
  - Explain *WHY*, not *WHAT*.
  - No "AI Slop" (e.g., "This function calculates X").

### Critical Anti-Patterns (Do NOT do this)
- ❌ **Logic in Controllers:** API routes should not contain `prisma.find...` calls.
- ❌ **Leaking Infrastructure:** Do not return Prisma objects directly to Frontend. Map to DTOs.
- ❌ **Mixed Responsibilities:** Services should not handle HTTP responses `NextResponse`.
- ❌ **Hardcoded Config:** Use `lib/env.ts` for strictly typed environment variables.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

Last Updated: 2026-01-06
