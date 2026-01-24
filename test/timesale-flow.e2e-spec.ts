import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../apps/api-gateway/src/app.module';

describe('TimeSale Service E2E Tests', () => {
  let app: INestApplication;
  let productId: number;
  let timesaleId: number;
  let orderId: number;
  const userId = Math.floor(Math.random() * 100000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Product Flow', () => {
    it('should create a product', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/products')
        .send({
          name: 'E2E Test Product',
          price: 100000,
          description: 'For E2E testing',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('E2E Test Product');
      productId = response.body.id;
    });

    it('should get product by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/products/${productId}`)
        .expect(200);

      expect(response.body.id).toBe(productId);
      expect(response.body.name).toBe('E2E Test Product');
    });
  });

  describe('TimeSale Flow', () => {
    it('should create a timesale', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/time-sales')
        .send({
          productId,
          quantity: 5,
          discountPrice: 80000,
          startAt: new Date(Date.now() - 1000).toISOString(),
          endAt: new Date(Date.now() + 3600000).toISOString(),
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('ACTIVE');
      timesaleId = response.body.id;
    });

    it('should get timesale by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/time-sales/${timesaleId}`)
        .expect(200);

      expect(response.body.id).toBe(timesaleId);
      expect(response.body.productId).toBe(productId);
    });

    it('should list timesales', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/time-sales?page=0&size=10')
        .expect(200);

      expect(response.body).toHaveProperty('timesales');
      expect(Array.isArray(response.body.timesales)).toBe(true);
    });
  });

  describe('Order Flow', () => {
    it('should create an order', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/orders')
        .send({
          timeSaleId: timesaleId,
          userId,
          quantity: 1,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('COMPLETED');
      orderId = response.body.id;
    });

    it('should get order by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/orders/${orderId}`)
        .expect(200);

      expect(response.body.id).toBe(orderId);
      expect(response.body.userId).toBe(String(userId));
    });

    it('should fail when quantity exceeds stock', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/orders')
        .send({
          timeSaleId: timesaleId,
          userId: userId + 1,
          quantity: 100,
        })
        .expect(400);
    });
  });
});
