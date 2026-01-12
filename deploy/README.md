# Writer - Deployment Guide

This guide explains how to deploy Writer using Docker Compose.

## Quick Start

### Development Setup

```bash
# Navigate to deploy directory
cd deploy

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start all services
docker compose -f docker-compose.dev.yml up -d

# View logs
docker compose -f docker-compose.dev.yml logs -f
```

Access Writer at: http://localhost:3000

### Production Setup

```bash
# Navigate to deploy directory
cd deploy

# Copy environment template
cp .env.example .env

# IMPORTANT: Edit .env with strong passwords and API keys
nano .env

# Start all services
docker compose -f docker-compose.prod.yml up -d

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

## Services

| Service | Dev Port | Prod Port | Description |
|---------|----------|-----------|-------------|
| **app** | 3000 | 3000 | Next.js application |
| **postgres** | 5432 | 5432 | PostgreSQL 17 database |
| **redis** | 6379 | 6379 | Redis 7 job queue |
| **qdrant** | 6333, 6334 | 6333, 6334 | Vector database |
| **tika** | 9998 | 9998 | Document parser |
| **minio** | 9000, 9001 | 9000, 9001 | S3-compatible storage |
| **pgadmin** | 5050 | - | DB management (dev only) |
| **redis-commander** | 8081 | - | Redis UI (dev only) |

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
POSTGRES_DB=writer
POSTGRES_USER=writer
POSTGRES_PASSWORD=your-strong-password-here

# Redis
REDIS_PASSWORD=your-strong-password-here

# Qdrant
QDRANT_API_KEY=your-strong-api-key-here

# MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=your-strong-password-here
MINIO_BUCKET=writer-uploads

# PgAdmin (dev only)
PGADMIN_EMAIL=admin@writer.local
PGADMIN_PASSWORD=admin

# Application
NODE_ENV=development  # or "production"
PORT=3000

# LLM Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Auth
BETTER_AUTH_SECRET=your-super-secret-key-here

# Data Residency
DATA_REGION=EU
```

## Development vs Production

### Development (`docker-compose.dev.yml`)

**Features:**
- Hot-reload for Next.js app (volumes mounted)
- No authentication on PostgreSQL, Redis, Qdrant
- PgAdmin for database debugging (port 5050)
- Redis Commander for queue debugging (port 8081)
- Verbose logging
- Simple default passwords

**Use when:** Local development, testing, debugging

### Production (`docker-compose.prod.yml`)

**Features:**
- Optimized production build (standalone mode)
- All services secured with strong passwords/API keys
- Health checks on all services
- Resource limits (CPU, memory)
- Automatic restart policies
- No debugging tools exposed
- Production-ready configuration

**Use when:** Staging, production deployment

## Common Commands

### Docker Compose

```bash
# Development
docker compose -f docker-compose.dev.yml up -d      # Start services
docker compose -f docker-compose.dev.yml down       # Stop services
docker compose -f docker-compose.dev.yml logs -f    # Follow logs
docker compose -f docker-compose.dev.yml restart    # Restart all

# Production
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml logs -f

# Rebuild after code changes
docker compose -f docker-compose.dev.yml up -d --build

# Remove everything (WARNING: deletes all data)
docker compose -f docker-compose.dev.yml down -v
```

### Service Management

```bash
# View status
docker compose -f docker-compose.dev.yml ps

# Restart specific service
docker compose -f docker-compose.dev.yml restart app

# View specific service logs
docker compose -f docker-compose.dev.yml logs -f app

# Enter container
docker compose -f docker-compose.dev.yml exec app sh
docker compose -f docker-compose.dev.yml exec postgres psql -U writer
```

### Database Operations

```bash
# Run migrations
docker compose -f docker-compose.dev.yml exec app npx prisma migrate dev

# Generate Prisma client
docker compose -f docker-compose.dev.yml exec app npx prisma generate

# Access PostgreSQL directly
docker compose -f docker-compose.dev.yml exec postgres psql -U writer -d writer
```

## Accessing Tools

### Development Tools

| Tool | URL | Credentials |
|------|-----|-------------|
| Writer App | http://localhost:3000 | - |
| PgAdmin | http://localhost:5050 | admin@writer.local / admin |
| Redis Commander | http://localhost:8081 | - |
| Qdrant Dashboard | http://localhost:6333/dashboard | - |
| MinIO Console | http://localhost:9001 | minioadmin / admin |

### Production Tools

| Tool | URL |
|------|-----|
| Writer App | http://localhost:3000 |
| Qdrant Dashboard | http://localhost:6333/dashboard |
| MinIO Console | http://localhost:9001 |

## Data Persistence

All data is persisted in Docker volumes:

```bash
# List volumes
docker volume ls

# Backup volumes
docker run --rm -v deploy_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
docker run --rm -v deploy_qdrant_data:/data -v $(pwd):/backup alpine tar czf /backup/qdrant_backup.tar.gz -C /data .
docker run --rm -v deploy_minio_data:/data -v $(pwd):/backup alpine tar czf /backup/minio_backup.tar.gz -C /data .

# Restore volumes
docker run --rm -v deploy_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /data
```

## Troubleshooting

### Service Won't Start

```bash
# Check service status
docker compose -f docker-compose.dev.yml ps

# Check logs
docker compose -f docker-compose.dev.yml logs <service-name>

# Check health status
docker compose -f docker-compose.dev.yml ps --format "table {{.Service}}\t{{.State}}\t{{.Health}}"
```

### Database Connection Issues

```bash
# Test PostgreSQL connection
docker compose -f docker-compose.dev.yml exec postgres pg_isready -U writer

# Check PostgreSQL logs
docker compose -f docker-compose.dev.yml logs postgres
```

### Build Issues

```bash
# Clear Next.js build cache
docker compose -f docker-compose.dev.yml exec app rm -rf .next

# Rebuild from scratch
docker compose -f docker-compose.dev.yml build --no-cache
```

### Port Conflicts

If ports are already in use, modify the port mappings in the docker-compose files:

```yaml
ports:
  - "3001:3000"  # Change 3000 to 3001
```

## Security Checklist (Production)

Before deploying to production:

- [ ] Change all default passwords in `.env`
- [ ] Use strong random passwords (32+ characters)
- [ ] Set `NODE_ENV=production`
- [ ] Configure LLM API keys (OpenAI, Anthropic)
- [ ] Set strong `BETTER_AUTH_SECRET`
- [ ] Enable Qdrant authentication (`QDRANT_API_KEY`)
- [ ] Enable Redis password
- [ ] Configure reverse proxy (Nginx, Caddy, Traefik)
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up log aggregation
- [ ] Enable backups

## Next Steps

- Set up reverse proxy for SSL/TLS
- Configure domain and DNS
- Set up monitoring (Prometheus, Grafana)
- Configure log aggregation
- Set up CI/CD pipeline
- Configure backup strategy

## Support

For issues or questions:
- Check application logs: `docker compose logs -f app`
- Check documentation: `../README.md`
- Review AGENTS.md for architecture guidelines
