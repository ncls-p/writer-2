# Writer

**Content Intelligence Engine** - A SaaS B2B application that combines RAG, iterative web search, proactive monitoring, and adaptive content generation in one unified interface.

## Overview

Writer eliminates tool juggling and information fragmentation by replacing the "Google + ChatGPT" workflow with one intelligent tool. Chat, research, monitor, and generate content without ever leaving the conversation.

**Core Promise:** Everything works at once, ideally on one screen. Chat → Answer → Action.

## Features

### Core Capabilities

| Feature | Description |
|---------|-------------|
| **RAG Search** | Semantic search across indexed internal documents via Qdrant |
| **Iterative Web Search** | Automatic multi-iteration research until completeness (max 5 iterations) |
| **Automated Veille** | Proactive topic monitoring with contextual alerts |
| **Image Generation** | AI-powered image creation via `/image` command |
| **Reliability Scores** | Source traceability with confidence scoring |
| **Multi-Platform Templates** | LinkedIn, Blog, Tweet, Discord content generation |

### Slash Commands

- `/deep` - Deep research with iterative search
- `/watch` - Configure monitoring topics
- `/image` - Generate images
- `/export` - Export content (Markdown, PDF)
- `/new` - Start new conversation
- `/help` - Help and command reference

### Smart Features

- **Intent Detection** - Auto-execute high-confidence actions, prompt for uncertain ones
- **Contextual Suggestions** - Action chips after each response
- **Inline Citations** - Every statement linked to expandable source cards
- **Streaming Responses** - First token <500ms
- **Real-time Progress** - Visibility into long-running operations

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript 5.x (Strict Mode) |
| UI | shadcn/ui, Tailwind CSS, Framer Motion |
| Auth | Better Auth (Prisma Adapter) |
| Database | PostgreSQL via Prisma ORM |
| Vector DB | Qdrant (gRPC) |
| Queue | BullMQ + Redis |
| LLM | Vercel AI SDK (OpenAI, Anthropic) |
| Testing | Vitest, Playwright, Storybook |
| Deployment | Docker Compose |

## Architecture

Writer follows Clean Architecture principles with feature-based modules:

```
src/
├── app/                  # Next.js App Router (Presentation)
│   ├── api/v1/          # REST API routes
│   ├── (auth)/          # Auth pages
│   └── (dashboard)/     # Main app pages
├── modules/             # Feature modules
│   └── <module>/
│       ├── domain/      # Entities, Value Objects
│       ├── application/ # Use Cases, Ports
│       ├── infrastructure/ # Adapters
│       └── index.ts     # Public API
├── components/
│   ├── ui/              # shadcn/ui components
│   └── features/        # Feature components
├── lib/                 # Shared utilities
└── tests/               # Integration & E2E tests
```

### Multi-Tenant Data Model

```
Organisation (Tenant)
├── Workspaces (shared, managed by Admin)
│   ├── "All Company" → Access: Everyone
│   ├── "Engineering" → Access: Engineering team
│   └── "Marketing" → Access: Marketing team
└── Personal Spaces (private per user)
    └── "My Space" → Access: Owner only
```

## Prerequisites

- Node.js 20+
- Docker & Docker Compose

**Or for local development without Docker:**
- PostgreSQL 15+
- Redis 7+
- Qdrant (self-hosted or cloud)

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd writer
npm install
```

### 2. Environment Setup

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/writer"

# Redis
REDIS_URL="redis://localhost:6379"

# Qdrant
QDRANT_URL="http://localhost:6334"

# LLM Providers
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."

# Auth
BETTER_AUTH_SECRET="your-secret-key"
```

### 3. Database Setup

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server

# Code Quality
npm run lint             # ESLint
npm run lint:fix         # ESLint with auto-fix
npm run format           # Prettier format
npm run typecheck        # TypeScript check

# Testing
npm run test             # Unit tests (Vitest)
npm run test:watch       # Watch mode
npx vitest <path>        # Single test file
npm run test:integration # Integration tests
npm run test:e2e         # E2E tests (Playwright)

# Database
npx prisma migrate dev   # Run migrations
npx prisma studio        # Database GUI
```

### Code Style

- **Files**: `kebab-case.ts`
- **Classes**: `PascalCase`
- **Variables/Functions**: `camelCase`
- **Commits**: Conventional commits (`feat:`, `fix:`, `refactor:`)

See [AGENTS.md](./AGENTS.md) for complete coding guidelines.

## Deployment

### Docker Compose (Recommended)

The easiest way to run Writer with all dependencies.

**Development:**
```bash
cd deploy
cp .env.example .env
nano .env  # Configure your environment
docker compose -f docker-compose.dev.yml up -d
```

**Production:**
```bash
cd deploy
cp .env.example .env
nano .env  # IMPORTANT: Set strong passwords and API keys
docker compose -f docker-compose.prod.yml up -d
```

Access Writer at: http://localhost:3000

See [deploy/README.md](./deploy/README.md) for detailed deployment documentation.

### Services Included

| Service | Dev | Prod | Description |
|---------|------|-------|-------------|
| PostgreSQL 17 | ✓ | ✓ | Main database |
| Redis 7 | ✓ | ✓ | Job queue (BullMQ) |
| Qdrant | ✓ | ✓ | Vector database for RAG |
| Apache Tika | ✓ | ✓ | Document parser |
| MinIO | ✓ | ✓ | S3-compatible storage |
| pgAdmin | ✓ | - | DB management (dev only) |
| Redis Commander | ✓ | - | Redis UI (dev only) |

### Local Development

### Infrastructure Requirements

### Infrastructure Requirements

| Component | Recommendation |
|-----------|---------------|
| Qdrant | 3-node cluster for HA, NVMe SSD, 16GB+ RAM/node |
| PostgreSQL | Managed service or dedicated instance |
| Redis | Managed service or dedicated instance |

### Performance Targets

- Chat response: First token <500ms
- RAG search: <2s
- Web search: <3s (single), <15s (deep)
- Image generation: <10s
- Concurrent users: 100+ per tenant

## Security

- **GDPR Compliant**: EU data residency, right to be forgotten, data portability
- **Encryption**: AES-256 at-rest, TLS 1.3 in-transit
- **Tenant Isolation**: Separate Qdrant collections per organization
- **LLM Privacy**: Uses "no training" APIs only

### RBAC Roles

| Role | Permissions |
|------|-------------|
| Owner | Full access including billing |
| Admin | Users, sources, workspaces |
| Member | Full usage, no org config |
| Viewer | Read-only access |

## Roadmap

- [ ] GraphRAG (Neo4j) for relational queries
- [ ] Auto-generated Trend Reports
- [ ] Codebase indexation
- [ ] Slack/Notion integrations
- [ ] Self-hosted deployment option
- [ ] Contradiction detection

## License

Proprietary - All rights reserved.
