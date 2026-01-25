import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { BASE_URL, stressConfig, defaultHeaders } from '../config.js';

// 커스텀 메트릭
const errorRate = new Rate('errors');
const orderSuccessRate = new Rate('order_success');
const orderFailRate = new Rate('order_fail');
const orderTime = new Trend('order_duration');
const totalOrders = new Counter('total_orders');

// 스트레스 테스트 사용 (타임세일은 높은 동시성 필요)
export const options = {
  ...stressConfig,
  thresholds: {
    ...stressConfig.thresholds,
    'errors': ['rate<0.05'],
    'order_success': ['rate>0.5'],  // 재고 소진 전까지 최소 50% 성공
    'order_duration': ['p(95)<100'], // Redis 기반이므로 빨라야 함
  },
};

let timeSaleId;
let productId;

export function setup() {
  // 1. 상품 생성
  const productPayload = JSON.stringify({
    name: `부하테스트 상품 ${Date.now()}`,
    price: 100000,
    description: 'k6 부하 테스트용 상품',
  });

  const productRes = http.post(
    `${BASE_URL}/products`,
    productPayload,
    { headers: defaultHeaders }
  );

  check(productRes, {
    'setup: product created': (r) => r.status === 201,
  });

  const product = JSON.parse(productRes.body);
  productId = product.id;

  // 2. 타임세일 생성 (충분한 재고로 설정)
  const startTime = new Date();
  startTime.setMinutes(startTime.getMinutes() - 5); // 이미 시작됨
  const endTime = new Date();
  endTime.setHours(endTime.getHours() + 1);

  const timeSalePayload = JSON.stringify({
    productId: productId,
    salePrice: 50000,
    quantity: 10000,  // 충분한 재고
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
  });

  const timeSaleRes = http.post(
    `${BASE_URL}/time-sales`,
    timeSalePayload,
    { headers: defaultHeaders }
  );

  check(timeSaleRes, {
    'setup: timesale created': (r) => r.status === 201,
  });

  const timeSale = JSON.parse(timeSaleRes.body);
  timeSaleId = timeSale.id;

  console.log(`Created TimeSale ID: ${timeSaleId} with 10000 quantity`);

  return { timeSaleId, productId };
}

export default function (data) {
  const userId = Math.floor(Math.random() * 100000) + 1;
  const quantity = Math.floor(Math.random() * 3) + 1; // 1-3개 주문

  // 주문 생성 (동시성 테스트)
  const orderPayload = JSON.stringify({
    timeSaleId: data.timeSaleId,
    userId: userId,
    quantity: quantity,
  });

  const orderRes = http.post(
    `${BASE_URL}/orders`,
    orderPayload,
    { headers: defaultHeaders }
  );

  totalOrders.add(1);

  const orderSuccess = orderRes.status === 201;
  const orderFail = orderRes.status === 400; // 재고 부족

  check(orderRes, {
    'order: status is 201 or 400': (r) => r.status === 201 || r.status === 400,
    'order: response time < 100ms': (r) => r.timings.duration < 100,
  });

  if (orderSuccess) {
    const order = JSON.parse(orderRes.body);
    orderSuccessRate.add(1);
    orderTime.add(orderRes.timings.duration);

    // 주문 조회
    const getOrderRes = http.get(
      `${BASE_URL}/orders/${order.id}`,
      { headers: defaultHeaders }
    );

    check(getOrderRes, {
      'get order: status 200': (r) => r.status === 200,
      'get order: has order id': (r) => JSON.parse(r.body).id === order.id,
    });
  } else if (orderFail) {
    orderFailRate.add(1);
    console.log('Order failed: Out of stock');
  } else {
    errorRate.add(1);
  }

  // 타임세일 상태 조회
  const timeSaleRes = http.get(
    `${BASE_URL}/time-sales/${data.timeSaleId}`,
    { headers: defaultHeaders }
  );

  check(timeSaleRes, {
    'get timesale: status 200': (r) => r.status === 200,
    'get timesale: has remaining quantity': (r) => {
      const ts = JSON.parse(r.body);
      return ts.remainingQuantity !== undefined;
    },
  });

  sleep(0.5);
}

export function teardown(data) {
  // 최종 재고 확인
  const timeSaleRes = http.get(
    `${BASE_URL}/time-sales/${data.timeSaleId}`,
    { headers: defaultHeaders }
  );

  if (timeSaleRes.status === 200) {
    const timeSale = JSON.parse(timeSaleRes.body);
    console.log(`Final remaining quantity: ${timeSale.remainingQuantity}`);
    console.log(`Total sold: ${10000 - timeSale.remainingQuantity}`);
  }
}
