# Coupon Service Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# 의존성 복사 및 설치
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
RUN npm ci

# 소스 코드 복사
COPY libs/ ./libs/
COPY apps/coupon-service/ ./apps/coupon-service/

# Prisma 생성
WORKDIR /app/apps/coupon-service
RUN npx prisma generate

# 빌드
WORKDIR /app
RUN npm run build coupon-service

# Production 이미지
FROM node:18-alpine

WORKDIR /app

# 프로덕션 의존성만 설치
COPY package*.json ./
RUN npm ci --only=production

# 빌드된 파일 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/apps/coupon-service/prisma ./apps/coupon-service/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# 환경 변수
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/apps/coupon-service/main"]
