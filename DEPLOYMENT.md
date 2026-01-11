# 프로모션 시스템 배포 가이드

## 목차
1. [사전 요구사항](#사전-요구사항)
2. [로컬 개발 환경](#로컬-개발-환경)
3. [프로덕션 배포](#프로덕션-배포)
4. [모니터링 및 운영](#모니터링-및-운영)
5. [트러블슈팅](#트러블슈팅)

---

## 사전 요구사항

### 필수 소프트웨어
- **Node.js**: 18.x 이상
- **Docker**: 20.x 이상
- **Docker Compose**: 2.x 이상
- **Git**: 최신 버전

### 시스템 요구사항
- **CPU**: 4 Core 이상
- **RAM**: 8GB 이상
- **Disk**: 20GB 이상 여유 공간

---

## 로컬 개발 환경

### 1. 저장소 클론
```bash
git clone <repository-url>
cd promotion-system
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
```bash
# 각 서비스의 .env 파일 생성
copy apps\coupon-service\.env.example apps\coupon-service\.env
copy apps\point-service\.env.example apps\point-service\.env
copy apps\timesale-service\.env.example apps\timesale-service\.env
```

### 4. 인프라 실행
```bash
docker-compose up -d
```

### 5. 데이터베이스 마이그레이션
```bash
# Coupon Service
cd apps\coupon-service
npx prisma migrate dev
npx prisma generate
cd ..\..

# Point Service
cd apps\point-service
npx prisma migrate dev
npx prisma generate
cd ..\..

# Time Sale Service
cd apps\timesale-service
npx prisma migrate dev
npx prisma generate
npx prisma db seed
cd ..\..
```

### 6. 서비스 실행
```bash
# 터미널 1
npm run start:dev coupon-service

# 터미널 2
npm run start:dev point-service

# 터미널 3
npm run start:dev timesale-service
```

### 7. 서비스 확인
- Coupon Service: http://localhost:3001/api/docs
- Point Service: http://localhost:3002/api/docs
- Time Sale Service: http://localhost:3003/api/docs

---

## 프로덕션 배포

### 방법 1: Docker Compose (권장)

#### 1. Docker 이미지 빌드
```bash
# Windows
.\scripts\build-images.ps1 -Version v1.0.0

# Linux/Mac
chmod +x scripts/build-images.sh
./scripts/build-images.sh v1.0.0
```

#### 2. 환경 변수 설정
프로덕션 환경 변수 파일 생성:
```bash
# .env.production
DATABASE_URL=mysql://user:password@mysql-host:3306/dbname
REDIS_HOST=redis-host
REDIS_PORT=6379
KAFKA_BROKERS=kafka-host:9092
```

#### 3. 데이터베이스 마이그레이션
```bash
# 프로덕션 DB에 마이그레이션 적용
cd apps/coupon-service
npx prisma migrate deploy
cd ../..

cd apps/point-service
npx prisma migrate deploy
cd ../..

cd apps/timesale-service
npx prisma migrate deploy
cd ../..
```

#### 4. 서비스 시작
```bash
docker-compose -f docker-compose.prod.yml up -d
```

#### 5. 헬스 체크
```bash
# 서비스 상태 확인
docker-compose -f docker-compose.prod.yml ps

# 로그 확인
docker-compose -f docker-compose.prod.yml logs -f
```

### 방법 2: Kubernetes (대규모 환경)

#### 1. 이미지 레지스트리에 푸시
```bash
# Docker Hub
docker tag promotion-system/coupon-service:v1.0.0 username/coupon-service:v1.0.0
docker push username/coupon-service:v1.0.0

# 또는 AWS ECR
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com
docker tag promotion-system/coupon-service:v1.0.0 <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com/coupon-service:v1.0.0
docker push <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com/coupon-service:v1.0.0
```

#### 2. Kubernetes 매니페스트 적용
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/deployments/
kubectl apply -f k8s/services/
```

#### 3. 서비스 확인
```bash
kubectl get pods -n promotion-system
kubectl get svc -n promotion-system
```

---

## 모니터링 및 운영

### 로그 확인

#### Docker Compose
```bash
# 전체 로그
docker-compose -f docker-compose.prod.yml logs -f

# 특정 서비스
docker-compose -f docker-compose.prod.yml logs -f coupon-service
```

#### Kubernetes
```bash
# Pod 로그
kubectl logs -f <pod-name> -n promotion-system

# 이전 컨테이너 로그
kubectl logs <pod-name> --previous -n promotion-system
```

### 성능 모니터링

#### Redis 모니터링
```bash
docker exec -it redis redis-cli

# 메모리 사용량
INFO memory

# 키 개수
DBSIZE

# 실시간 명령어 모니터링
MONITOR
```

#### Kafka 모니터링
```bash
docker exec -it kafka bash

# Consumer Group 상태
kafka-consumer-groups --bootstrap-server localhost:9092 --describe --group coupon-service-group

# 토픽 메시지 수
kafka-run-class kafka.tools.GetOffsetShell --broker-list localhost:9092 --topic coupon-issue-requests
```

### 스케일링

#### Docker Compose
```bash
# 서비스 복제
docker-compose -f docker-compose.prod.yml up -d --scale coupon-service=3
```

#### Kubernetes
```bash
# Horizontal Pod Autoscaler
kubectl autoscale deployment coupon-service --cpu-percent=70 --min=2 --max=10 -n promotion-system

# 수동 스케일링
kubectl scale deployment coupon-service --replicas=5 -n promotion-system
```

---

## 트러블슈팅

### 서비스가 시작되지 않는 경우

#### 1. 로그 확인
```bash
docker-compose -f docker-compose.prod.yml logs coupon-service
```

#### 2. 데이터베이스 연결 확인
```bash
# MySQL 연결 테스트
docker exec -it mysql-coupon mysql -uroot -ppassword -e "SHOW DATABASES;"
```

#### 3. Redis 연결 확인
```bash
docker exec -it redis redis-cli PING
```

### Prisma 마이그레이션 실패

```bash
# 마이그레이션 상태 확인
cd apps/coupon-service
npx prisma migrate status

# 마이그레이션 리셋 (개발 환경만!)
npx prisma migrate reset

# 프로덕션 마이그레이션
npx prisma migrate deploy
```

### Kafka 메시지 처리 지연

```bash
# Consumer Lag 확인
docker exec -it kafka kafka-consumer-groups \
  --bootstrap-server localhost:9092 \
  --describe --group coupon-service-group

# Consumer 인스턴스 증가
docker-compose -f docker-compose.prod.yml up -d --scale coupon-service=3
```

### 메모리 부족

```bash
# 컨테이너 리소스 사용량 확인
docker stats

# 메모리 제한 설정 (docker-compose.prod.yml)
services:
  coupon-service:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

---

## 백업 및 복구

### 데이터베이스 백업
```bash
# MySQL 백업
docker exec mysql-coupon mysqldump -uroot -ppassword coupon_db > backup_coupon_$(date +%Y%m%d).sql

# 복구
docker exec -i mysql-coupon mysql -uroot -ppassword coupon_db < backup_coupon_20260111.sql
```

### Redis 백업
```bash
# RDB 스냅샷 생성
docker exec redis redis-cli SAVE

# 백업 파일 복사
docker cp redis:/data/dump.rdb ./backup/redis_$(date +%Y%m%d).rdb
```

---

## 보안 권장사항

1. **환경 변수 관리**
   - `.env` 파일을 Git에 커밋하지 않기
   - 프로덕션 비밀번호는 강력하게 설정
   - AWS Secrets Manager 또는 HashiCorp Vault 사용 권장

2. **네트워크 보안**
   - 방화벽 설정으로 필요한 포트만 개방
   - SSL/TLS 인증서 적용
   - API Gateway에서 rate limiting 설정

3. **접근 제어**
   - 데이터베이스 사용자 권한 최소화
   - Redis AUTH 설정
   - Kafka ACL 설정

---

## 성능 최적화 팁

1. **데이터베이스**
   - 인덱스 최적화
   - 커넥션 풀 크기 조정
   - 쿼리 성능 모니터링

2. **Redis**
   - 메모리 정책 설정 (maxmemory-policy)
   - TTL 적절히 설정
   - 키 네이밍 규칙 준수

3. **Kafka**
   - 파티션 수 조정
   - Batch 크기 최적화
   - Consumer 인스턴스 증가

---

**최종 업데이트**: 2026-01-11  
**버전**: 1.0.0
