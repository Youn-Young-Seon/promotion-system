# Setup Guide

프로모션 시스템 설치 및 실행 가이드

## 1. 사전 요구사항

다음 소프트웨어가 설치되어 있어야 합니다:

- **Node.js** >= 18.x
- **pnpm** >= 8.x
- **Docker** & **Docker Compose**
- **Git**

### pnpm 설치

```bash
npm install -g pnpm
```

## 2. 프로젝트 클론 및 의존성 설치

```bash
# 프로젝트 클론
git clone <repository-url>
cd promotion-system

# 의존성 설치
pnpm install
```

## 3. 환경 변수 설정

각 서비스의 환경 변수 파일을 생성합니다:

```bash
# Coupon Service
cp apps/coupon-service/.env.example apps/coupon-service/.env

# Point Service
cp apps/point-service/.env.example apps/point-service/.env

# TimeSale Service
cp apps/timesale-service/.env.example apps/timesale-service/.env
```

### 데이터베이스 URL 설정

`.env` 파일에서 각 서비스의 `DATABASE_URL`을 확인하고 필요시 수정합니다:

**Coupon Service** (`.env`):
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/coupon_db?schema=public"
```

**Point Service** (`.env`):
```env
DATABASE_URL="postgresql://postgres:password@localhost:5433/point_db?schema=public"
```

**TimeSale Service** (`.env`):
```env
DATABASE_URL="postgresql://postgres:password@localhost:5434/timesale_db?schema=public"
```

## 4. 인프라 서비스 시작

Docker Compose로 PostgreSQL, Redis, Kafka, etcd를 실행합니다:

```bash
docker-compose up -d
```

### 서비스 상태 확인

```bash
docker-compose ps
```

모든 서비스가 `healthy` 상태인지 확인합니다.

### 로그 확인

```bash
docker-compose logs -f
```

## 5. Prisma 마이그레이션

각 서비스의 데이터베이스 스키마를 생성합니다:

```bash
# Coupon Service 마이그레이션
cd apps/coupon-service
pnpm prisma migrate dev --name init
cd ../..

# Point Service 마이그레이션
cd apps/point-service
pnpm prisma migrate dev --name init
cd ../..

# TimeSale Service 마이그레이션
cd apps/timesale-service
pnpm prisma migrate dev --name init
cd ../..
```

## 6. Prisma Client 생성

```bash
# Coupon Service
cd apps/coupon-service
pnpm prisma generate
cd ../..

# Point Service
cd apps/point-service
pnpm prisma generate
cd ../..

# TimeSale Service
cd apps/timesale-service
pnpm prisma generate
cd ../..
```

또는 루트에서 한 번에:

```bash
pnpm prisma:generate
```

## 7. 서비스 실행

### 개발 모드

각 서비스를 별도 터미널에서 실행:

```bash
# Terminal 1 - Coupon Service
cd apps/coupon-service
pnpm start:dev

# Terminal 2 - Point Service
cd apps/point-service
pnpm start:dev

# Terminal 3 - TimeSale Service
cd apps/timesale-service
pnpm start:dev
```

### 서비스 포트 확인

- **Coupon Service**: http://localhost:3001
- **Point Service**: http://localhost:3002
- **TimeSale Service**: http://localhost:3003

## 8. 동작 확인

### Health Check

각 서비스가 정상적으로 실행되었는지 확인:

```bash
# Coupon Service
curl http://localhost:3001/api/v1/coupon-policies

# Point Service
curl http://localhost:3002/api/v1/points/users/1/balance

# TimeSale Service
curl http://localhost:3003/api/v1/products
```

### 데이터베이스 연결 확인

```bash
# PostgreSQL 컨테이너 접속
docker exec -it postgres-coupon psql -U postgres -d coupon_db

# 테이블 확인
\dt

# 종료
\q
```

## 9. 테스트

```bash
# 단위 테스트
pnpm test

# 테스트 커버리지
pnpm test:cov
```

## 10. 중지 및 정리

### 서비스 중지

각 터미널에서 `Ctrl+C`로 서비스를 중지합니다.

### 인프라 중지

```bash
# 컨테이너 중지
docker-compose down

# 볼륨까지 삭제 (데이터 삭제)
docker-compose down -v
```

## 문제 해결

### 포트가 이미 사용 중인 경우

```bash
# 포트 사용 프로세스 확인 (Windows)
netstat -ano | findstr :3001

# 포트 사용 프로세스 확인 (macOS/Linux)
lsof -i :3001
```

### Prisma Client 생성 오류

```bash
# Prisma Client 삭제 후 재생성
rm -rf apps/coupon-service/prisma/generated
cd apps/coupon-service
pnpm prisma generate
```

### Docker 컨테이너 재시작

```bash
# 특정 컨테이너 재시작
docker-compose restart postgres-coupon

# 모든 컨테이너 재시작
docker-compose restart
```

### 데이터베이스 초기화

```bash
# 마이그레이션 초기화
cd apps/coupon-service
pnpm prisma migrate reset
```

## 다음 단계

Phase 2 (V1 구현)이 완료되었습니다. 다음 단계는:

1. **Phase 3**: Redis 통합 및 성능 최적화
   - 분산 락 추가 (Coupon Service)
   - Redis 캐싱 추가 (Point Service)
   - Redis 재고 관리 (TimeSale Service)

2. **Phase 4**: Kafka 이벤트 드리븐
   - Kafka Producer/Consumer 구현
   - 비동기 이벤트 처리

3. **Phase 5**: API Gateway 구현
   - gRPC 통신
   - 인증/인가
   - Circuit Breaker

자세한 내용은 README.md를 참조하세요.
