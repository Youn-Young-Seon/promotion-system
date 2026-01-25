import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { BASE_URL, baseConfig, defaultHeaders } from '../config.js';

// 커스텀 메트릭
const errorRate = new Rate('errors');
const issueCouponErrorRate = new Rate('issue_coupon_errors');

export const options = {
  ...baseConfig,
  thresholds: {
    ...baseConfig.thresholds,
    'errors': ['rate<0.01'],
    'issue_coupon_errors': ['rate<0.01'],
  },
};

// 테스트 데이터 준비
let policyId;

export function setup() {
  // 쿠폰 정책 생성
  const startTime = new Date();
  startTime.setHours(startTime.getHours() + 1);
  const endTime = new Date();
  endTime.setDate(endTime.getDate() + 7);

  const policyPayload = JSON.stringify({
    title: `부하테스트 쿠폰 ${Date.now()}`,
    description: 'k6 부하 테스트용 쿠폰',
    totalQuantity: 10000,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minimumOrderAmount: 10000,
    maximumDiscountAmount: 5000,
  });

  const createRes = http.post(
    `${BASE_URL}/coupon-policies`,
    policyPayload,
    { headers: defaultHeaders }
  );

  check(createRes, {
    'setup: policy created': (r) => r.status === 201,
  });

  const policy = JSON.parse(createRes.body);
  console.log(`Created policy ID: ${policy.id}`);

  return { policyId: policy.id };
}

export default function (data) {
  const userId = Math.floor(Math.random() * 100000) + 1;

  // 쿠폰 발급 테스트
  const issuePayload = JSON.stringify({
    policyId: data.policyId,
    userId: userId,
  });

  const issueRes = http.post(
    `${BASE_URL}/coupons/issue`,
    issuePayload,
    { headers: defaultHeaders }
  );

  const issueSuccess = check(issueRes, {
    'issue coupon: status 201': (r) => r.status === 201,
    'issue coupon: has coupon id': (r) => JSON.parse(r.body).id !== undefined,
    'issue coupon: response time < 200ms': (r) => r.timings.duration < 200,
  });

  errorRate.add(!issueSuccess);
  issueCouponErrorRate.add(issueRes.status !== 201);

  if (issueSuccess) {
    const coupon = JSON.parse(issueRes.body);

    // 사용자 쿠폰 조회
    const getUserCouponsRes = http.get(
      `${BASE_URL}/coupons/user/${userId}`,
      { headers: defaultHeaders }
    );

    check(getUserCouponsRes, {
      'get user coupons: status 200': (r) => r.status === 200,
      'get user coupons: has coupons': (r) => JSON.parse(r.body).coupons.length > 0,
    });
  }

  sleep(1);
}

export function teardown(data) {
  console.log(`Test completed for policy ID: ${data.policyId}`);
}
