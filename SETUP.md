# Promotion System - Setup Guide

## 프로젝트 구조

```
promotion-system/
├── apps/
│   ├── coupon-service/      # 쿠폰 서비스 (포트: 3001)
│   ├── point-service/       # 적립금 서비스 (포트: 3002)
│   └── timesale-service/    # 타임세일 서비스 (포트: 3003)
├── docker-compose.yml       # 인프라 설정
└── package.json
```

## 설치 및 실행 가이드

### 1. 인프라 실행

Docker Compose로 MySQL, Redis, Kafka, etcd를 실행합니다:

```bash
cd C:\Users\82104\Documents\promotion-system
docker-compose up -d
```

컨테이너 상태 확인:
```bash
docker-compose ps
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

각 서비스의 `.env.example` 파일을 `.env`로 복사:

```bash
# Coupon Service
copy apps\coupon-service\.env.example apps\coupon-service\.env

# Point Service
copy apps\point-service\.env.example apps\point-service\.env

# Time Sale Service
copy apps\timesale-service\.env.example apps\timesale-service\.env
```

### 4. Prisma 마이그레이션

각 서비스별로 데이터베이스 마이그레이션 실행:

**Coupon Service:**
```bash
cd apps\coupon-service
npx prisma migrate dev --name init
npx prisma generate
cd ..\..
```

**Point Service:**
```bash
cd apps\point-service
npx prisma migrate dev --name init
npx prisma generate
cd ..\..
```

**Time Sale Service:**
```bash
cd apps\timesale-service
npx prisma migrate dev --name init
npx prisma generate
cd ..\..
```

### 5. 서비스 실행

각 서비스를 별도 터미널에서 실행:

**터미널 1 - Coupon Service:**
```bash
npm run start:dev coupon-service
```

**터미널 2 - Point Service:**
```bash
npm run start:dev point-service
```

**터미널 3 - Time Sale Service:**
```bash
npm run start:dev timesale-service
```

## API 엔드포인트

### Coupon Service (http://localhost:3001)
- `POST /api/coupons/policies` - 쿠폰 정책 생성
- `POST /api/coupons/issue` - 쿠폰 발급
- `GET /api/coupons/user/:userId` - 사용자 쿠폰 조회

### Point Service (http://localhost:3002)
- `GET /api/points/:userId` - 적립금 잔액 조회
- `GET /api/points/:userId/history` - 적립금 내역 조회
- `POST /api/points/add` - 적립금 적립
- `POST /api/points/use` - 적립금 사용

### Time Sale Service (http://localhost:3003)
- `POST /api/timesales` - 타임세일 등록
- `POST /api/timesales/:id/orders` - 타임세일 주문
- `GET /api/timesales/:id` - 타임세일 조회

## 테스트 시나리오

### 1. 쿠폰 발급 테스트

```bash
# 1. 쿠폰 정책 생성
curl -X POST http://localhost:3001/api/coupons/policies \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"신규가입쿠폰\",\"description\":\"10% 할인\",\"totalQuantity\":100,\"startTime\":\"2026-01-08T00:00:00Z\",\"endTime\":\"2026-12-31T23:59:59Z\",\"discountType\":\"PERCENTAGE\",\"discountValue\":10,\"minimumOrderAmount\":10000,\"maximumDiscountAmount\":5000}"

# 2. 쿠폰 발급
curl -X POST http://localhost:3001/api/coupons/issue \
  -H "Content-Type: application/json" \
  -d "{\"policyId\":\"1\",\"userId\":\"1\"}"
```

### 2. 적립금 테스트

```bash
# 1. 적립금 적립
curl -X POST http://localhost:3002/api/points/add \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"1\",\"amount\":10000,\"description\":\"회원가입 적립\"}"

# 2. 잔액 조회
curl http://localhost:3002/api/points/1
```

## 문제 해결

### Docker 컨테이너가 시작되지 않는 경우
```bash
docker-compose down -v
docker-compose up -d
```

### Prisma 클라이언트 생성 오류
```bash
cd apps/[service-name]
npx prisma generate
```

### 포트 충돌
각 서비스의 `.env` 파일에서 PORT 값을 변경하세요.
