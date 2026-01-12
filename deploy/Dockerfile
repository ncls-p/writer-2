# Multi-stage Dockerfile for Writer (Next.js)

# ============================================
# Stage 1: Base image with dependencies
# ============================================
FROM node:20-alpine AS base

# Install dependencies required for native modules
RUN apk add --no-cache libc6-compat wget

WORKDIR /app

# ============================================
# Stage 2: Install dependencies
# ============================================
FROM base AS deps

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# ============================================
# Stage 3: Development/Builder stage
# ============================================
FROM base AS builder

WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy project files
COPY . .

# Generate Prisma client (if schema exists)
RUN if [ -f prisma/schema.prisma ]; then npx prisma generate; fi

# Build Next.js application
RUN npm run build

# ============================================
# Stage 4: Production runner
# ============================================
FROM base AS runner

WORKDIR /app

ENV NODE_ENV production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy Prisma client if exists
RUN if [ -d "/app/node_modules/.prisma" ]; then \
    mkdir -p ./node_modules/.prisma && \
    cp -r /app/node_modules/.prisma/client ./node_modules/.prisma/; \
    fi

# Set correct ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start application
CMD ["node", "server.js"]
