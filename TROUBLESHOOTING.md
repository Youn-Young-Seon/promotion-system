# 트러블슈팅 가이드

이 문서는 프로젝트에서 자주 발생하는 문제와 해결 방법을 정리합니다.

## 서비스 시작 관련

### 1. "Environment variable not found: DATABASE_URL_COUPON"

**증상:**
```
PrismaClientInitializationError: error: Environment variable not found: DATABASE_URL_COUPON.
```

**원인:**
- `.env` 파일이 없거나 환경 변수가 설정되지 않음
- 잘못된 `.env` 파일 경로 참조

**해결:**
```bash
# 1. .env 파일 확인
cat .env | grep DATABASE_URL

# 2. 필요한 변수가 없다면 .env.example에서 복사
cp .env.example .env

# 3. 다음 변수들이 있는지 확인
# DATABASE_URL_COUPON="mysql://root:root@localhost:3307/coupon_db"
# DATABASE_URL_POINT="mysql://root:root@localhost:3308/point_db"
# DATABASE_URL_TIMESALE="mysql://root:root@localhost:3309/timesale_db"

# 4. 서비스 재시작
npm run start:all
```

### 2. "Invalid value undefined for datasource"

**증상:**
```
Invalid value undefined for datasource "db" provided to PrismaClient constructor.
```

**원인:**
- PrismaService가 환경 변수를 읽지 못함
- 빌드된 코드가 최신 PrismaService를 반영하지 못함

**해결:**
```bash
# 1. 전체 클린 빌드
rm -rf dist
npm run build

# 2. Prisma 클라이언트 재생성
npm run prisma:generate:all

# 3. 서비스 재시작
npm run start:all
```

### 3. "Cannot find module '@prisma/client'"

**증상:**
```
Error: Cannot find module '@prisma/client'
```

**원인:**
- Prisma 클라이언트가 생성되지 않음

**해결:**
```bash
# Prisma 클라이언트 생성
npm run prisma:generate:all

# 빌드 후 재시작
npm run build
npm run start:all
```

## Prisma 관련

### 4. Prisma 재생성 후에도 에러 발생

**증상:**
- Prisma 클라이언트를 재생성했는데도 에러가 계속 발생

**해결:**
```bash
# 1. 생성된 Prisma 클라이언트 완전 삭제
rm -rf apps/coupon-service/src/generated
rm -rf apps/point-service/src/generated
rm -rf apps/timesale-service/src/generated

# 2. dist 폴더도 삭제
rm -rf dist

# 3. Prisma 클라이언트 재생성
npm run prisma:generate:all

# 4. 빌드
npm run build

# 5. 서비스 재시작
npm run start:all
```

### 5. Prisma Migration 실패

**증상:**
```
Error: There is a conflict between env vars
```

**원인:**
- 여러 개의 .env 파일이 충돌

**해결:**
```bash
# 서비스별 .env 파일 삭제 (루트 .env만 사용)
rm -f apps/coupon-service/.env
rm -f apps/point-service/.env
rm -f apps/timesale-service/.env
rm -f apps/api-gateway/.env

# 마이그레이션 재실행
npm run prisma:migrate:all
```

## Docker 인프라 관련

### 6. MySQL 연결 실패

**증상:**
```
Error: Can't connect to MySQL server
```

**해결:**
```bash
# Docker 컨테이너 상태 확인
docker-compose ps

# MySQL 컨테이너 재시작
docker-compose restart mysql-coupon mysql-point mysql-timesale

# 또는 전체 인프라 재시작
docker-compose down
docker-compose up -d
```

### 7. Redis 연결 실패

**증상:**
```
Error: Redis connection refused
```

**해결:**
```bash
# Redis 상태 확인
docker ps | grep redis

# Redis 재시작
docker-compose restart redis

# Redis 연결 테스트
docker exec -it redis redis-cli ping
# 응답: PONG
```

### 8. Kafka 연결 실패

**증상:**
```
KafkaJSConnectionError: Connection refused
```

**해결:**
```bash
# Kafka 상태 확인
docker-compose ps kafka zookeeper

# Kafka 재시작
docker-compose restart kafka zookeeper

# Kafka 토픽 확인
docker exec -it kafka kafka-topics \
  --bootstrap-server localhost:9092 --list
```

## 성능 테스트 관련

### 9. "Too Many Requests" (429 에러)

**증상:**
- 성능 테스트 실행 시 429 에러 대량 발생

**원인:**
- Rate Limiting이 기본값(100 req/min)으로 설정됨

**해결:**
```bash
# 1. .env 파일에 추가
echo "RATE_LIMIT_MAX=100000" >> .env
echo "RATE_LIMIT_WINDOW=60" >> .env

# 2. API Gateway만 재시작
# Ctrl+C로 기존 서비스 중지 후
npm run start:gateway
```

### 10. "Internal Server Error" (500 에러)

**증상:**
- API 호출 시 500 에러 발생

**원인:**
- 서비스 내부 에러 (다양한 원인 가능)

**디버깅:**
```bash
# 서비스 로그 확인
# 각 서비스의 터미널에서 에러 로그 확인

# 직접 API 호출로 에러 확인
curl -v http://localhost:4000/api/coupons/issue?strategy=v1 \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"policyId":"1","userId":"test"}'
```

## gRPC 관련

### 11. "The invalid .proto definition (file not found)"

**증상:**
```
The invalid .proto definition (file at "..." not found)
```

**원인:**
- proto 파일 경로가 잘못됨

**해결:**
- Gateway 모듈에서 proto 파일 경로가 `process.cwd() + '/proto/*.proto'`를 참조하는지 확인
- proto 파일이 프로젝트 루트의 `proto/` 디렉토리에 있는지 확인

```bash
# proto 파일 확인
ls proto/
# 출력: coupon.proto  point.proto  timesale.proto
```

### 12. gRPC 서비스 연결 실패

**증상:**
```
14 UNAVAILABLE: No connection established
```

**원인:**
- gRPC 서비스가 실행되지 않음
- 포트가 다름

**해결:**
```bash
# gRPC 포트 확인 (5001, 5002, 5003)
netstat -ano | findstr "5001 5002 5003"

# 서비스 재시작
npm run start:all
```

## 빌드 관련

### 13. Webpack 빌드 실패

**증상:**
```
webpack compiled with errors
```

**해결:**
```bash
# node_modules 재설치
rm -rf node_modules
pnpm install

# 빌드 재시도
npm run build
```

### 14. TypeScript 타입 에러

**증상:**
- 빌드 시 TypeScript 타입 에러

**해결:**
```bash
# Prisma 클라이언트 재생성 (타입 정의 포함)
npm run prisma:generate:all

# 빌드
npm run build
```

## 일반적인 해결 순서

문제가 발생하면 다음 순서로 시도하세요:

```bash
# 1단계: 간단한 재시작
npm run start:all

# 2단계: 빌드 재실행
npm run build
npm run start:all

# 3단계: Prisma 재생성
npm run prisma:generate:all
npm run build
npm run start:all

# 4단계: 완전 클린 빌드
rm -rf dist
rm -rf apps/*/src/generated
npm run prisma:generate:all
npm run build
npm run start:all

# 5단계: Docker 인프라 재시작
docker-compose down
docker-compose up -d
npm run start:all

# 6단계: 전체 재설치
rm -rf node_modules
pnpm install
npm run prisma:generate:all
npm run build
docker-compose down
docker-compose up -d
npm run start:all
```

## 도움이 필요하신가요?

위 방법으로 해결되지 않는다면:
1. GitHub Issues에 문제 등록
2. 에러 로그 전체를 포함해주세요
3. 실행한 명령어와 환경 정보를 함께 제공해주세요

### 유용한 디버깅 명령어

```bash
# 서비스 포트 확인
netstat -ano | findstr "3001 3002 3003 4000 5001 5002 5003"

# Docker 컨테이너 상태
docker-compose ps

# Docker 로그 확인
docker-compose logs mysql-coupon
docker-compose logs redis
docker-compose logs kafka

# 환경 변수 확인
cat .env

# Prisma 클라이언트 위치 확인
ls -la apps/coupon-service/src/generated/client

# 빌드 결과 확인
ls -la dist/apps/
```
