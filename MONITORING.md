# 모니터링 가이드

프로모션 시스템의 모니터링 설정 및 사용 방법

---

## 📊 개요

이 프로젝트는 **Prometheus**와 **Grafana**를 사용하여 실시간 모니터링을 제공합니다.

- **Prometheus**: 메트릭 수집 및 저장
- **Grafana**: 시각화 및 대시보드

---

## 🚀 시작하기

### 1. 인프라 시작

```bash
docker-compose up -d
```

이 명령어로 Prometheus와 Grafana가 자동으로 시작됩니다.

### 2. 서비스 실행

```bash
# 각 터미널에서
cd apps/api-gateway && pnpm start:dev
cd apps/coupon-service && pnpm start:dev
cd apps/point-service && pnpm start:dev
cd apps/timesale-service && pnpm start:dev
```

### 3. 접속

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000
  - 기본 계정: `admin` / `admin`

---

## 📈 메트릭 확인

### Prometheus 직접 확인

각 서비스의 `/metrics` 엔드포인트에서 메트릭을 확인할 수 있습니다:

```bash
# API Gateway
curl http://localhost:4000/metrics

# Coupon Service
curl http://localhost:3001/metrics

# Point Service
curl http://localhost:3002/metrics

# TimeSale Service
curl http://localhost:3003/metrics
```

### 주요 메트릭

#### 1. HTTP 요청 메트릭
- `*_http_requests_total`: 총 HTTP 요청 수
- `*_http_request_duration_seconds`: HTTP 요청 응답 시간

#### 2. 시스템 메트릭
- `*_process_cpu_user_seconds_total`: CPU 사용 시간
- `*_process_resident_memory_bytes`: 메모리 사용량
- `*_nodejs_eventloop_lag_seconds`: Node.js 이벤트 루프 지연

#### 3. Node.js 메트릭
- `*_nodejs_heap_size_total_bytes`: 힙 메모리 총량
- `*_nodejs_heap_size_used_bytes`: 사용 중인 힙 메모리
- `*_nodejs_external_memory_bytes`: 외부 메모리 사용량

---

## 📊 Grafana 대시보드

### 사전 구성된 대시보드

프로젝트에는 다음 메트릭을 시각화하는 대시보드가 포함되어 있습니다:

1. **Request Rate (req/s)**
   - 각 서비스의 초당 요청 수

2. **Response Time (ms)**
   - P95 응답 시간 (95번째 백분위수)

3. **CPU Usage (%)**
   - 각 서비스의 CPU 사용률

4. **Memory Usage (MB)**
   - 각 서비스의 메모리 사용량

5. **Total Requests (Last 5m)**
   - 최근 5분간 총 요청 수

6. **Error Rate (%)**
   - 5xx 에러 비율

7. **Avg Response Time (ms)**
   - 평균 응답 시간 (P50)

8. **Active Services**
   - 현재 실행 중인 서비스 수

### 대시보드 접속

1. Grafana 로그인: http://localhost:3000 (admin/admin)
2. 좌측 메뉴에서 "Dashboards" 클릭
3. "Promotion System Monitoring" 대시보드 선택

### 커스텀 대시보드 생성

1. Grafana 좌측 메뉴에서 "+" → "Dashboard" 클릭
2. "Add new panel" 클릭
3. Query에 Prometheus 쿼리 입력
4. 시각화 옵션 설정
5. "Save" 클릭

---

## 🔍 유용한 Prometheus 쿼리

### 요청률 (RPS)

```promql
# API Gateway 요청률
rate(api_gateway_http_requests_total[1m])

# 전체 서비스 요청률
sum(rate(api_gateway_http_requests_total[1m]))
```

### 에러율

```promql
# 5xx 에러율
sum(rate(api_gateway_http_requests_total{status_code=~"5.."}[5m]))
/
sum(rate(api_gateway_http_requests_total[5m])) * 100
```

### 응답 시간

```promql
# P95 응답 시간
histogram_quantile(0.95,
  rate(api_gateway_http_request_duration_seconds_bucket[5m])
) * 1000

# P50 응답 시간 (중앙값)
histogram_quantile(0.5,
  rate(api_gateway_http_request_duration_seconds_bucket[5m])
) * 1000
```

### 리소스 사용량

```promql
# CPU 사용률 (%)
rate(api_gateway_process_cpu_user_seconds_total[1m]) * 100

# 메모리 사용량 (MB)
api_gateway_process_resident_memory_bytes / 1024 / 1024
```

---

## 🎯 모니터링 Best Practices

### 1. 알림 설정

Grafana에서 알림 규칙을 설정하여 임계값 초과 시 알림을 받을 수 있습니다:

- 에러율 > 5%
- P95 응답 시간 > 1000ms
- CPU 사용률 > 80%
- 메모리 사용량 > 1GB

### 2. 주요 모니터링 지표 (Golden Signals)

1. **Latency (지연시간)**: 응답 시간
2. **Traffic (트래픽)**: 요청률
3. **Errors (에러)**: 에러율
4. **Saturation (포화도)**: CPU/메모리 사용률

### 3. 정기적인 확인

- 일일: 에러율, 응답 시간
- 주간: 트래픽 추이, 리소스 사용량
- 월간: 용량 계획, 성능 최적화

---

## 🔧 설정 파일

### Prometheus 설정

`monitoring/prometheus.yml`:
- 스크래핑 간격: 15초
- 타겟: API Gateway, Coupon Service, Point Service, TimeSale Service

### Grafana 프로비저닝

`monitoring/grafana/provisioning/`:
- `datasources/prometheus.yml`: Prometheus 데이터 소스 자동 설정
- `dashboards/default.yml`: 대시보드 자동 로드 설정
- `dashboards/promotion-system-dashboard.json`: 사전 구성된 대시보드

---

## 🐛 트러블슈팅

### Prometheus가 메트릭을 수집하지 못하는 경우

1. 서비스가 실행 중인지 확인:
   ```bash
   curl http://localhost:4000/metrics
   ```

2. Prometheus 타겟 상태 확인:
   - http://localhost:9090/targets

3. Docker 네트워크 확인:
   ```bash
   docker network inspect promotion-system_promotion-network
   ```

### Grafana 대시보드가 표시되지 않는 경우

1. Prometheus 데이터 소스 확인:
   - Grafana → Configuration → Data Sources

2. 쿼리 테스트:
   - Dashboard → Panel → Edit → Query Inspector

3. 로그 확인:
   ```bash
   docker logs grafana
   docker logs prometheus
   ```

---

## 📚 참고 자료

- [Prometheus 공식 문서](https://prometheus.io/docs/)
- [Grafana 공식 문서](https://grafana.com/docs/)
- [PromQL 쿼리 가이드](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [NestJS Prometheus 모듈](https://github.com/willsoto/nestjs-prometheus)

---

**작성일**: 2026-01-25
**버전**: 1.0.0
