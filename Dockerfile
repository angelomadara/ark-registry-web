# Dockerfile
# Multi-stage build: dev + prod

# ---- Build stage ----
FROM node:22-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .

RUN npm run build

# ---- Dev stage ----
FROM node:22-slim AS development

WORKDIR /app

# Install all dependencies including devDependencies
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

COPY . .

EXPOSE 3000

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]

# ---- Production stage ----
FROM node:22-slim AS production

WORKDIR /app

# Copy built artifacts from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
