import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate } from 'k6/metrics';
import { BASE_URL, baseConfig, defaultHeaders } from '../config.js';

// 커스텀 메트릭
const errorRate = new Rate('errors');

export const options = {
  ...baseConfig,
  thresholds: {
    ...baseConfig.thresholds,
    'errors': ['rate<0.05'],
    'http_req_duration{scenario:coupon}': ['p(95)<200'],
    'http_req_duration{scenario:point}': ['p(95)<100'],
    'http_req_duration{scenario:timesale}': ['p(95)<100'],
  },
};

let testData = {};

export function setup() {
  // 쿠폰 정책 생성
  const startTime = new Date();
  startTime.setHours(startTime.getHours() + 1);
  const endTime = new Date();
  endTime.setDate(endTime.getDate() + 7);

  const policyRes = http.post(
    `${BASE_URL}/coupon-policies`,
    JSON.stringify({
      title: `전체 시스템 테스트 쿠폰 ${Date.now()}`,
      description: '전체 부하 테스트용',
      totalQuantity: 5000,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minimumOrderAmount: 10000,
      maximumDiscountAmount: 5000,
    }),
    { headers: defaultHeaders }
  );

  const policy = JSON.parse(policyRes.body);

  // 상품 생성
  const productRes = http.post(
    `${BASE_URL}/products`,
    JSON.stringify({
      name: `전체 시스템 테스트 상품 ${Date.now()}`,
      price: 100000,
      description: '전체 부하 테스트용',
    }),
    { headers: defaultHeaders }
  );

  const product = JSON.parse(productRes.body);

  // 타임세일 생성
  const tsStartTime = new Date();
  tsStartTime.setMinutes(tsStartTime.getMinutes() - 5);
  const tsEndTime = new Date();
  tsEndTime.setHours(tsEndTime.getHours() + 1);

  const timeSaleRes = http.post(
    `${BASE_URL}/time-sales`,
    JSON.stringify({
      productId: product.id,
      salePrice: 50000,
      quantity: 5000,
      startTime: tsStartTime.toISOString(),
      endTime: tsEndTime.toISOString(),
    }),
    { headers: defaultHeaders }
  );

  const timeSale = JSON.parse(timeSaleRes.body);

  console.log('Setup complete:');
  console.log(`- Policy ID: ${policy.id}`);
  console.log(`- Product ID: ${product.id}`);
  console.log(`- TimeSale ID: ${timeSale.id}`);

  return {
    policyId: policy.id,
    productId: product.id,
    timeSaleId: timeSale.id,
  };
}

export default function (data) {
  const userId = Math.floor(Math.random() * 50000) + 1;

  // 시나리오 1: 쿠폰 시스템
  group('Coupon Service', function () {
    const issueRes = http.post(
      `${BASE_URL}/coupons/issue`,
      JSON.stringify({
        policyId: data.policyId,
        userId: userId,
      }),
      {
        headers: defaultHeaders,
        tags: { scenario: 'coupon' }
      }
    );

    const success = check(issueRes, {
      'coupon issued': (r) => r.status === 201,
    });

    errorRate.add(!success);
  });

  sleep(0.5);

  // 시나리오 2: 포인트 시스템
  group('Point Service', function () {
    // 적립
    const earnRes = http.post(
      `${BASE_URL}/points/earn`,
      JSON.stringify({
        userId: userId,
        amount: Math.floor(Math.random() * 5000) + 1000,
        description: '전체 테스트 적립',
      }),
      {
        headers: defaultHeaders,
        tags: { scenario: 'point' }
      }
    );

    check(earnRes, {
      'points earned': (r) => r.status === 201,
    });

    sleep(0.3);

    // 잔액 조회
    const balanceRes = http.get(
      `${BASE_URL}/points/users/${userId}/balance`,
      {
        headers: defaultHeaders,
        tags: { scenario: 'point' }
      }
    );

    check(balanceRes, {
      'balance retrieved': (r) => r.status === 200,
    });
  });

  sleep(0.5);

  // 시나리오 3: 타임세일 시스템
  group('TimeSale Service', function () {
    const orderRes = http.post(
      `${BASE_URL}/orders`,
      JSON.stringify({
        timeSaleId: data.timeSaleId,
        userId: userId,
        quantity: Math.floor(Math.random() * 2) + 1,
      }),
      {
        headers: defaultHeaders,
        tags: { scenario: 'timesale' }
      }
    );

    const success = check(orderRes, {
      'order created or sold out': (r) => r.status === 201 || r.status === 400,
    });

    errorRate.add(!success && orderRes.status !== 400);
  });

  sleep(1);
}

export function teardown(data) {
  console.log('Full system test completed');
}
