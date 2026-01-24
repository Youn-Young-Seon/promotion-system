FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY apps/timesale-service/package.json ./apps/timesale-service/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma Client
RUN cd apps/timesale-service && pnpm prisma generate

# Build application
RUN pnpm build timesale-service

# Production stage
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built application and Prisma schema
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/apps/timesale-service/prisma ./prisma

# Generate Prisma Client for production
RUN cd /app && pnpm prisma generate --schema=./prisma/schema.prisma

EXPOSE 3003

CMD ["node", "dist/apps/timesale-service/main.js"]
