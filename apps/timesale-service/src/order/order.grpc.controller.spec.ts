import { Test, TestingModule } from '@nestjs/testing';
import { OrderGrpcController } from './order.grpc.controller';
import { OrderService } from './order.service';
import { OrderStatus } from '../../prisma/generated/client';

describe('OrderGrpcController', () => {
  let controller: OrderGrpcController;
  let service: OrderService;

  const mockOrderService = {
    create: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderGrpcController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderGrpcController>(OrderGrpcController);
    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create order successfully with string parameters', async () => {
      const mockOrder = {
        id: BigInt(1),
        timeSaleId: BigInt(10),
        userId: BigInt(100),
        quantity: 2,
        status: OrderStatus.PENDING,
        queueNumber: 1,
        createdAt: new Date('2026-01-15'),
        timeSale: {
          id: BigInt(10),
          discountPrice: 9900,
          product: {
            id: BigInt(5),
            name: 'iPhone 15',
            price: 15000,
          },
        },
      };

      mockOrderService.create.mockResolvedValue(mockOrder);

      const result = await controller.createOrder({
        timeSaleId: '10',
        userId: '100',
        quantity: 2,
      });

      expect(service.create).toHaveBeenCalledWith({
        timeSaleId: 10,
        userId: 100,
        quantity: 2,
      });

      expect(result).toEqual({
        order: {
          id: '1',
          timeSaleId: '10',
          userId: '100',
          quantity: 2,
          status: OrderStatus.PENDING,
          queueNumber: 1,
          createdAt: mockOrder.createdAt.toISOString(),
        },
      });
    });

    it('should create order successfully with number parameters', async () => {
      const mockOrder = {
        id: BigInt(2),
        timeSaleId: BigInt(11),
        userId: BigInt(200),
        quantity: 1,
        status: OrderStatus.PENDING,
        queueNumber: 2,
        createdAt: new Date('2026-01-16'),
      };

      mockOrderService.create.mockResolvedValue(mockOrder);

      await controller.createOrder({
        timeSaleId: 11,
        userId: 200,
        quantity: 1,
      });

      expect(service.create).toHaveBeenCalledWith({
        timeSaleId: 11,
        userId: 200,
        quantity: 1,
      });
    });

    it('should handle multiple quantity', async () => {
      const mockOrder = {
        id: BigInt(3),
        timeSaleId: BigInt(12),
        userId: BigInt(300),
        quantity: 5,
        status: OrderStatus.PENDING,
        queueNumber: 3,
        createdAt: new Date('2026-01-17'),
      };

      mockOrderService.create.mockResolvedValue(mockOrder);

      const result = await controller.createOrder({
        timeSaleId: 12,
        userId: 300,
        quantity: 5,
      });

      expect(result.order.quantity).toBe(5);
    });

    it('should handle order without timeSale relation', async () => {
      const mockOrder = {
        id: BigInt(4),
        timeSaleId: BigInt(13),
        userId: BigInt(400),
        quantity: 1,
        status: OrderStatus.PENDING,
        queueNumber: 4,
        createdAt: new Date('2026-01-18'),
        timeSale: null,
      };

      mockOrderService.create.mockResolvedValue(mockOrder);

      const result = await controller.createOrder({
        timeSaleId: 13,
        userId: 400,
        quantity: 1,
      });

      expect(result).toEqual({
        order: {
          id: '4',
          timeSaleId: '13',
          userId: '400',
          quantity: 1,
          status: OrderStatus.PENDING,
          queueNumber: 4,
          createdAt: mockOrder.createdAt.toISOString(),
        },
      });
    });
  });

  describe('getOrder', () => {
    it('should get order successfully with string parameter', async () => {
      const mockOrder = {
        id: BigInt(1),
        timeSaleId: BigInt(10),
        userId: BigInt(100),
        quantity: 2,
        status: OrderStatus.COMPLETED,
        queueNumber: 1,
        createdAt: new Date('2026-01-15'),
        timeSale: {
          id: BigInt(10),
          discountPrice: 9900,
          product: {
            id: BigInt(5),
            name: 'iPhone 15',
            price: 15000,
          },
        },
      };

      mockOrderService.findById.mockResolvedValue(mockOrder);

      const result = await controller.getOrder({ id: '1' });

      expect(service.findById).toHaveBeenCalledWith(1);

      expect(result).toEqual({
        order: {
          id: '1',
          timeSaleId: '10',
          userId: '100',
          quantity: 2,
          status: OrderStatus.COMPLETED,
          queueNumber: 1,
          createdAt: mockOrder.createdAt.toISOString(),
        },
      });
    });

    it('should get order successfully with number parameter', async () => {
      const mockOrder = {
        id: BigInt(5),
        timeSaleId: BigInt(15),
        userId: BigInt(500),
        quantity: 3,
        status: OrderStatus.PENDING,
        queueNumber: 10,
        createdAt: new Date('2026-01-20'),
      };

      mockOrderService.findById.mockResolvedValue(mockOrder);

      await controller.getOrder({ id: 5 });

      expect(service.findById).toHaveBeenCalledWith(5);
    });

    it('should handle order with CANCELED status', async () => {
      const mockOrder = {
        id: BigInt(6),
        timeSaleId: BigInt(16),
        userId: BigInt(600),
        quantity: 1,
        status: OrderStatus.CANCELED,
        queueNumber: 20,
        createdAt: new Date('2026-01-21'),
      };

      mockOrderService.findById.mockResolvedValue(mockOrder);

      const result = await controller.getOrder({ id: 6 });

      expect(result.order.status).toBe(OrderStatus.CANCELED);
    });

    it('should handle order without relations', async () => {
      const mockOrder = {
        id: BigInt(7),
        timeSaleId: BigInt(17),
        userId: BigInt(700),
        quantity: 2,
        status: OrderStatus.COMPLETED,
        queueNumber: 5,
        createdAt: new Date('2026-01-22'),
        timeSale: null,
      };

      mockOrderService.findById.mockResolvedValue(mockOrder);

      const result = await controller.getOrder({ id: 7 });

      expect(result).toEqual({
        order: {
          id: '7',
          timeSaleId: '17',
          userId: '700',
          quantity: 2,
          status: OrderStatus.COMPLETED,
          queueNumber: 5,
          createdAt: mockOrder.createdAt.toISOString(),
        },
      });
    });
  });

  describe('parameter type conversion', () => {
    it('should correctly convert string IDs to numbers', async () => {
      const mockOrder = {
        id: BigInt(999),
        timeSaleId: BigInt(888),
        userId: BigInt(777),
        quantity: 1,
        status: OrderStatus.PENDING,
        queueNumber: 1,
        createdAt: new Date(),
      };

      mockOrderService.create.mockResolvedValue(mockOrder);

      await controller.createOrder({
        timeSaleId: '888',
        userId: '777',
        quantity: 1,
      });

      expect(service.create).toHaveBeenCalledWith({
        timeSaleId: 888,
        userId: 777,
        quantity: 1,
      });
    });

    it('should handle mixed parameter types', async () => {
      const mockOrder = {
        id: BigInt(100),
        timeSaleId: BigInt(200),
        userId: BigInt(300),
        quantity: 2,
        status: OrderStatus.PENDING,
        queueNumber: 1,
        createdAt: new Date(),
      };

      mockOrderService.create.mockResolvedValue(mockOrder);

      await controller.createOrder({
        timeSaleId: '200',
        userId: 300,
        quantity: 2,
      });

      expect(service.create).toHaveBeenCalledWith({
        timeSaleId: 200,
        userId: 300,
        quantity: 2,
      });
    });
  });
});
