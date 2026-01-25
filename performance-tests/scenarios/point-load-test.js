import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { BASE_URL, baseConfig, defaultHeaders } from '../config.js';

// 커스텀 메트릭
const errorRate = new Rate('errors');
const earnPointsTime = new Trend('earn_points_duration');
const usePointsTime = new Trend('use_points_duration');
const balanceCheckTime = new Trend('balance_check_duration');

export const options = {
  ...baseConfig,
  thresholds: {
    ...baseConfig.thresholds,
    'errors': ['rate<0.01'],
    'earn_points_duration': ['p(95)<100'],  // 적립은 빨라야 함
    'balance_check_duration': ['p(95)<50'], // 캐시 덕분에 매우 빨라야 함
  },
};

export default function () {
  const userId = Math.floor(Math.random() * 10000) + 1;

  // 1. 포인트 적립
  const earnPayload = JSON.stringify({
    userId: userId,
    amount: Math.floor(Math.random() * 10000) + 1000,
    description: `부하테스트 적립 ${Date.now()}`,
  });

  const earnRes = http.post(
    `${BASE_URL}/points/earn`,
    earnPayload,
    { headers: defaultHeaders }
  );

  const earnSuccess = check(earnRes, {
    'earn points: status 201': (r) => r.status === 201,
    'earn points: has transaction id': (r) => JSON.parse(r.body).id !== undefined,
    'earn points: response time < 100ms': (r) => r.timings.duration < 100,
  });

  errorRate.add(!earnSuccess);
  earnPointsTime.add(earnRes.timings.duration);

  sleep(0.5);

  // 2. 잔액 조회 (캐시 효과 테스트)
  const balanceRes = http.get(
    `${BASE_URL}/points/users/${userId}/balance`,
    { headers: defaultHeaders }
  );

  const balanceSuccess = check(balanceRes, {
    'get balance: status 200': (r) => r.status === 200,
    'get balance: has balance': (r) => JSON.parse(r.body).balance >= 0,
    'get balance: response time < 50ms': (r) => r.timings.duration < 50,
  });

  errorRate.add(!balanceSuccess);
  balanceCheckTime.add(balanceRes.timings.duration);

  sleep(0.5);

  // 3. 포인트 사용 (잔액이 있는 경우)
  if (balanceSuccess) {
    const balance = JSON.parse(balanceRes.body).balance;

    if (balance > 500) {
      const useAmount = Math.min(500, Math.floor(balance / 2));
      const usePayload = JSON.stringify({
        userId: userId,
        amount: useAmount,
        description: `부하테스트 사용 ${Date.now()}`,
      });

      const useRes = http.post(
        `${BASE_URL}/points/use`,
        usePayload,
        { headers: defaultHeaders }
      );

      const useSuccess = check(useRes, {
        'use points: status 200': (r) => r.status === 200,
        'use points: has transaction id': (r) => JSON.parse(r.body).id !== undefined,
      });

      errorRate.add(!useSuccess);
      usePointsTime.add(useRes.timings.duration);

      sleep(0.5);

      // 4. 거래 내역 조회
      const historyRes = http.get(
        `${BASE_URL}/points/users/${userId}/history?page=0&size=10`,
        { headers: defaultHeaders }
      );

      check(historyRes, {
        'get history: status 200': (r) => r.status === 200,
        'get history: has transactions': (r) => JSON.parse(r.body).transactions.length > 0,
      });
    }
  }

  sleep(1);
}
