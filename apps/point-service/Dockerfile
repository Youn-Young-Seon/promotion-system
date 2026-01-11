# Point Service Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
RUN npm ci

COPY libs/ ./libs/
COPY apps/point-service/ ./apps/point-service/

WORKDIR /app/apps/point-service
RUN npx prisma generate

WORKDIR /app
RUN npm run build point-service

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/apps/point-service/prisma ./apps/point-service/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

ENV NODE_ENV=production
ENV PORT=3002

EXPOSE 3002

CMD ["node", "dist/apps/point-service/main"]
