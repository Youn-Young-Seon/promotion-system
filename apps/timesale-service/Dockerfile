# Time Sale Service Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
RUN npm ci

COPY libs/ ./libs/
COPY apps/timesale-service/ ./apps/timesale-service/

WORKDIR /app/apps/timesale-service
RUN npx prisma generate

WORKDIR /app
RUN npm run build timesale-service

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/apps/timesale-service/prisma ./apps/timesale-service/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

ENV NODE_ENV=production
ENV PORT=3003

EXPOSE 3003

CMD ["node", "dist/apps/timesale-service/main"]
