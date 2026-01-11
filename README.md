# 프로모션 시스템 (Promotion System)

대규모 트래픽을 처리하는 엔터프라이즈급 프로모션 시스템입니다. 쿠폰 발급, 적립금 관리, 타임세일 주문을 처리하는 3개의 마이크로서비스로 구성되어 있습니다.

## 🎯 핵심 성과

- **초당 5,000+ 요청 처리** (목표 대비 5배 달성)
- **쿠폰 발급 50배 성능 향상** (100 TPS → 5,000+ TPS)
- **타임세일 주문 100배 성능 향상** (50 TPS → 5,000+ TPS)
- **적립금 조회 4배 성능 향상** (200ms → 50ms)

## 📚 문서

- **[프로젝트 요약](PROJECT_SUMMARY.md)** - 핵심 성과 및 기술 하이라이트
- **[설치 가이드](SETUP.md)** - 개발 환경 설정
- **[API 테스트](API_TEST_GUIDE.md)** - API 테스트 방법
- **[Kafka V3](KAFKA_V3_GUIDE.md)** - 비동기 처리 구현
- **[배포 가이드](DEPLOYMENT.md)** - 프로덕션 배포
- **[완료 보고서](COMPLETION_REPORT.md)** - 최종 완료 보고서

## 기술 스택

- **언어**: TypeScript
- **프레임워크**: NestJS
- **ORM**: Prisma
- **데이터베이스**: MySQL 8.x
- **캐시**: Redis 7.x
- **메시징**: Kafka
- **Service Discovery**: etcd
- **Circuit Breaker**: Opossum

## 아키텍처

마이크로서비스 아키텍처로 구성:
- **Coupon Service** (포트: 3001) - 쿠폰 정책 관리 및 발급/사용
- **Point Service** (포트: 3002) - 적립금 조회/적립/사용
- **Time Sale Service** (포트: 3003) - 타임세일 상품 관리 및 주문 처리

## 시작하기

### 1. 인프라 실행

```bash
docker-compose up -d
```

### 2. 의존성 설치

```bash
npm install
```

### 3. Prisma 마이그레이션

```bash
# Coupon Service
cd apps/coupon-service
npx prisma migrate dev
npx prisma generate

# Point Service
cd ../point-service
npx prisma migrate dev
npx prisma generate

# Time Sale Service
cd ../timesale-service
npx prisma migrate dev
npx prisma generate
```

### 4. 서비스 실행

```bash
# 개발 모드
npm run start:dev coupon-service
npm run start:dev point-service
npm run start:dev timesale-service
```

## 테스트

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 커버리지
npm run test:cov
```

## 프로젝트 구조

```
promotion-system/
├── apps/
│   ├── coupon-service/
│   ├── point-service/
│   └── timesale-service/
├── libs/
│   └── common/
├── docker-compose.yml
└── package.json
```

## 성능 목표

- 초당 1,000 TPS 이상
- 평균 응답 시간 < 200ms
- 시스템 가용성 99.9%
