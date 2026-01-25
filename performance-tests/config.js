// k6 성능 테스트 기본 설정

export const baseConfig = {
  // 테스트 단계 정의
  stages: [
    { duration: '30s', target: 10 },   // 워밍업: 10 VUs
    { duration: '1m', target: 50 },    // 램프업: 50 VUs
    { duration: '2m', target: 100 },   // 피크: 100 VUs
    { duration: '1m', target: 50 },    // 램프다운: 50 VUs
    { duration: '30s', target: 0 },    // 종료: 0 VUs
  ],

  // 성공 기준 (Thresholds)
  thresholds: {
    'http_req_duration': ['p(95)<200'],     // 95%의 요청이 200ms 이하
    'http_req_duration': ['p(99)<500'],     // 99%의 요청이 500ms 이하
    'http_req_failed': ['rate<0.01'],       // 에러율 1% 미만
    'http_reqs': ['rate>100'],              // 초당 100건 이상 처리
  },
};

export const stressConfig = {
  stages: [
    { duration: '1m', target: 100 },
    { duration: '3m', target: 500 },
    { duration: '2m', target: 1000 },  // 스트레스 테스트: 1000 VUs
    { duration: '1m', target: 0 },
  ],

  thresholds: {
    'http_req_duration': ['p(95)<500'],
    'http_req_failed': ['rate<0.05'],   // 에러율 5% 미만
    'http_reqs': ['rate>500'],          // 초당 500건 이상
  },
};

export const spikeConfig = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '10s', target: 500 },   // 급격한 증가
    { duration: '30s', target: 500 },   // 유지
    { duration: '10s', target: 10 },    // 급격한 감소
    { duration: '10s', target: 0 },
  ],

  thresholds: {
    'http_req_duration': ['p(95)<1000'],
    'http_req_failed': ['rate<0.1'],
  },
};

export const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000/api/v1';

export const defaultHeaders = {
  'Content-Type': 'application/json',
};
