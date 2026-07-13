# =============================================================
# Stage 1: Dependencies & Build
# =============================================================
FROM node:22-slim AS builder

WORKDIR /app

# Install system deps needed for native modules (if any)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy package manifests first for layer caching
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Nuxt for production (generates .output/)
RUN npm run build

# =============================================================
# Stage 2: Production runner
# =============================================================
FROM node:22-slim AS production

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy built output from builder
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", ".output/server/index.mjs"]

# =============================================================
# Stage 3: Development runner (default target)
# =============================================================
FROM node:22-slim AS development

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy package manifests first for layer caching
COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

# Copy source (will be overridden by volume mount at runtime)
COPY . .

EXPOSE 3000

ENV NODE_ENV=development

CMD ["npx", "nuxt", "dev", "--host", "0.0.0.0", "--port", "3000"]
