import { Test, TestingModule } from '@nestjs/testing';
import { TimesaleGrpcController } from './timesale.grpc.controller';
import { TimeSaleService } from './timesale.service';
import { TimeSaleStatus } from '../../prisma/generated/client';

describe('TimesaleGrpcController', () => {
  let controller: TimesaleGrpcController;
  let service: TimeSaleService;

  const mockTimeSaleService = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimesaleGrpcController],
      providers: [
        {
          provide: TimeSaleService,
          useValue: mockTimeSaleService,
        },
      ],
    }).compile();

    controller = module.get<TimesaleGrpcController>(TimesaleGrpcController);
    service = module.get<TimeSaleService>(TimeSaleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTimeSale', () => {
    it('should create timesale successfully with product', async () => {
      const mockTimeSale = {
        id: BigInt(1),
        productId: BigInt(10),
        quantity: 100,
        remainingQuantity: 100,
        discountPrice: 9900,
        startAt: new Date('2026-02-01T00:00:00Z'),
        endAt: new Date('2026-02-28T23:59:59Z'),
        status: TimeSaleStatus.SCHEDULED,
        createdAt: new Date('2026-01-15'),
        product: {
          id: BigInt(10),
          name: 'iPhone 15',
          price: 15000,
          description: 'Latest iPhone model',
        },
      };

      mockTimeSaleService.create.mockResolvedValue(mockTimeSale);

      const result = await controller.createTimeSale({
        productId: '10',
        quantity: 100,
        discountPrice: 9900,
        startAt: '2026-02-01T00:00:00Z',
        endAt: '2026-02-28T23:59:59Z',
      });

      expect(service.create).toHaveBeenCalledWith({
        productId: 10,
        quantity: 100,
        discountPrice: 9900,
        startAt: '2026-02-01T00:00:00Z',
        endAt: '2026-02-28T23:59:59Z',
      });

      expect(result).toEqual({
        timesale: {
          id: '1',
          productId: '10',
          quantity: 100,
          remainingQuantity: 100,
          discountPrice: 9900,
          startAt: mockTimeSale.startAt.toISOString(),
          endAt: mockTimeSale.endAt.toISOString(),
          status: TimeSaleStatus.SCHEDULED,
          createdAt: mockTimeSale.createdAt.toISOString(),
          product: {
            id: '10',
            name: 'iPhone 15',
            price: 15000,
            description: 'Latest iPhone model',
          },
        },
      });
    });

    it('should create timesale with number parameter', async () => {
      const mockTimeSale = {
        id: BigInt(2),
        productId: BigInt(20),
        quantity: 50,
        remainingQuantity: 50,
        discountPrice: 7900,
        startAt: new Date('2026-03-01T00:00:00Z'),
        endAt: new Date('2026-03-31T23:59:59Z'),
        status: TimeSaleStatus.SCHEDULED,
        createdAt: new Date('2026-02-15'),
        product: null,
      };

      mockTimeSaleService.create.mockResolvedValue(mockTimeSale);

      await controller.createTimeSale({
        productId: 20,
        quantity: 50,
        discountPrice: 7900,
        startAt: '2026-03-01T00:00:00Z',
        endAt: '2026-03-31T23:59:59Z',
      });

      expect(service.create).toHaveBeenCalledWith({
        productId: 20,
        quantity: 50,
        discountPrice: 7900,
        startAt: '2026-03-01T00:00:00Z',
        endAt: '2026-03-31T23:59:59Z',
      });
    });

    it('should handle timesale without product relation', async () => {
      const mockTimeSale = {
        id: BigInt(3),
        productId: BigInt(30),
        quantity: 200,
        remainingQuantity: 200,
        discountPrice: 5000,
        startAt: new Date('2026-04-01T00:00:00Z'),
        endAt: new Date('2026-04-30T23:59:59Z'),
        status: TimeSaleStatus.SCHEDULED,
        createdAt: new Date('2026-03-15'),
        product: null,
      };

      mockTimeSaleService.create.mockResolvedValue(mockTimeSale);

      const result = await controller.createTimeSale({
        productId: 30,
        quantity: 200,
        discountPrice: 5000,
        startAt: '2026-04-01T00:00:00Z',
        endAt: '2026-04-30T23:59:59Z',
      });

      expect(result.timesale).not.toHaveProperty('product');
    });

    it('should handle product with null description', async () => {
      const mockTimeSale = {
        id: BigInt(4),
        productId: BigInt(40),
        quantity: 75,
        remainingQuantity: 75,
        discountPrice: 12000,
        startAt: new Date('2026-05-01T00:00:00Z'),
        endAt: new Date('2026-05-31T23:59:59Z'),
        status: TimeSaleStatus.SCHEDULED,
        createdAt: new Date('2026-04-15'),
        product: {
          id: BigInt(40),
          name: 'MacBook Pro',
          price: 25000,
          description: null,
        },
      };

      mockTimeSaleService.create.mockResolvedValue(mockTimeSale);

      const result = await controller.createTimeSale({
        productId: 40,
        quantity: 75,
        discountPrice: 12000,
        startAt: '2026-05-01T00:00:00Z',
        endAt: '2026-05-31T23:59:59Z',
      });

      expect((result.timesale as Record<string, unknown>)['product']).toHaveProperty('description', '');
    });
  });

  describe('getTimeSale', () => {
    it('should get timesale successfully with string parameter', async () => {
      const mockTimeSale = {
        id: BigInt(1),
        productId: BigInt(10),
        quantity: 100,
        remainingQuantity: 50,
        discountPrice: 9900,
        startAt: new Date('2026-02-01T00:00:00Z'),
        endAt: new Date('2026-02-28T23:59:59Z'),
        status: TimeSaleStatus.ACTIVE,
        createdAt: new Date('2026-01-15'),
        product: {
          id: BigInt(10),
          name: 'iPhone 15',
          price: 15000,
          description: 'Latest iPhone model',
        },
      };

      mockTimeSaleService.findById.mockResolvedValue(mockTimeSale);

      const result = await controller.getTimeSale({ id: '1' });

      expect(service.findById).toHaveBeenCalledWith(1);

      expect(result).toEqual({
        timesale: {
          id: '1',
          productId: '10',
          quantity: 100,
          remainingQuantity: 50,
          discountPrice: 9900,
          startAt: mockTimeSale.startAt.toISOString(),
          endAt: mockTimeSale.endAt.toISOString(),
          status: TimeSaleStatus.ACTIVE,
          createdAt: mockTimeSale.createdAt.toISOString(),
          product: {
            id: '10',
            name: 'iPhone 15',
            price: 15000,
            description: 'Latest iPhone model',
          },
        },
      });
    });

    it('should get timesale with number parameter', async () => {
      const mockTimeSale = {
        id: BigInt(5),
        productId: BigInt(50),
        quantity: 300,
        remainingQuantity: 0,
        discountPrice: 8000,
        startAt: new Date('2026-06-01T00:00:00Z'),
        endAt: new Date('2026-06-30T23:59:59Z'),
        status: TimeSaleStatus.SOLD_OUT,
        createdAt: new Date('2026-05-15'),
        product: null,
      };

      mockTimeSaleService.findById.mockResolvedValue(mockTimeSale);

      await controller.getTimeSale({ id: 5 });

      expect(service.findById).toHaveBeenCalledWith(5);
    });

    it('should handle SOLD_OUT status', async () => {
      const mockTimeSale = {
        id: BigInt(6),
        productId: BigInt(60),
        quantity: 50,
        remainingQuantity: 0,
        discountPrice: 4500,
        startAt: new Date('2026-07-01T00:00:00Z'),
        endAt: new Date('2026-07-31T23:59:59Z'),
        status: TimeSaleStatus.SOLD_OUT,
        createdAt: new Date('2026-06-15'),
      };

      mockTimeSaleService.findById.mockResolvedValue(mockTimeSale);

      const result = await controller.getTimeSale({ id: 6 });

      expect((result.timesale as Record<string, unknown>)['status']).toBe(TimeSaleStatus.SOLD_OUT);
      expect((result.timesale as Record<string, unknown>)['remainingQuantity']).toBe(0);
    });
  });

  describe('listTimeSales', () => {
    it('should list timesales with status filter', async () => {
      const mockTimeSales = [
        {
          id: BigInt(1),
          productId: BigInt(10),
          quantity: 100,
          remainingQuantity: 50,
          discountPrice: 9900,
          startAt: new Date('2026-02-01T00:00:00Z'),
          endAt: new Date('2026-02-28T23:59:59Z'),
          status: TimeSaleStatus.ACTIVE,
          createdAt: new Date('2026-01-15'),
          product: {
            id: BigInt(10),
            name: 'iPhone 15',
            price: 15000,
            description: 'Latest iPhone',
          },
        },
        {
          id: BigInt(2),
          productId: BigInt(20),
          quantity: 75,
          remainingQuantity: 30,
          discountPrice: 7900,
          startAt: new Date('2026-02-05T00:00:00Z'),
          endAt: new Date('2026-02-25T23:59:59Z'),
          status: TimeSaleStatus.ACTIVE,
          createdAt: new Date('2026-01-20'),
          product: {
            id: BigInt(20),
            name: 'Galaxy S24',
            price: 12000,
            description: null,
          },
        },
      ];

      mockTimeSaleService.findAll.mockResolvedValue({
        timeSales: mockTimeSales,
        total: 2,
      });

      const result = await controller.listTimeSales({
        status: 'ACTIVE',
        page: 1,
        size: 10,
      });

      expect(service.findAll).toHaveBeenCalledWith(1, 10, TimeSaleStatus.ACTIVE);

      expect(result).toEqual({
        timesales: [
          {
            id: '1',
            productId: '10',
            quantity: 100,
            remainingQuantity: 50,
            discountPrice: 9900,
            startAt: mockTimeSales[0]!.startAt.toISOString(),
            endAt: mockTimeSales[0]!.endAt.toISOString(),
            status: TimeSaleStatus.ACTIVE,
            createdAt: mockTimeSales[0]!.createdAt.toISOString(),
            product: {
              id: '10',
              name: 'iPhone 15',
              price: 15000,
              description: 'Latest iPhone',
            },
          },
          {
            id: '2',
            productId: '20',
            quantity: 75,
            remainingQuantity: 30,
            discountPrice: 7900,
            startAt: mockTimeSales[1]!.startAt.toISOString(),
            endAt: mockTimeSales[1]!.endAt.toISOString(),
            status: TimeSaleStatus.ACTIVE,
            createdAt: mockTimeSales[1]!.createdAt.toISOString(),
            product: {
              id: '20',
              name: 'Galaxy S24',
              price: 12000,
              description: '',
            },
          },
        ],
        total: 2,
        page: 1,
        size: 10,
      });
    });

    it('should list timesales without status filter', async () => {
      const mockTimeSales = [
        {
          id: BigInt(3),
          productId: BigInt(30),
          quantity: 200,
          remainingQuantity: 200,
          discountPrice: 5000,
          startAt: new Date('2026-03-01T00:00:00Z'),
          endAt: new Date('2026-03-31T23:59:59Z'),
          status: TimeSaleStatus.SCHEDULED,
          createdAt: new Date('2026-02-15'),
          product: null,
        },
      ];

      mockTimeSaleService.findAll.mockResolvedValue({
        timeSales: mockTimeSales,
        total: 1,
      });

      const result = await controller.listTimeSales({
        page: 1,
        size: 10,
      });

      expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined);

      expect(result.timesales[0]).not.toHaveProperty('product');
    });

    it('should handle empty list', async () => {
      mockTimeSaleService.findAll.mockResolvedValue({
        timeSales: [],
        total: 0,
      });

      const result = await controller.listTimeSales({
        status: 'ENDED',
        page: 1,
        size: 10,
      });

      expect(result).toEqual({
        timesales: [],
        total: 0,
        page: 1,
        size: 10,
      });
    });

    it('should handle pagination correctly', async () => {
      const mockTimeSales = [
        {
          id: BigInt(21),
          productId: BigInt(210),
          quantity: 150,
          remainingQuantity: 100,
          discountPrice: 6500,
          startAt: new Date('2026-08-01T00:00:00Z'),
          endAt: new Date('2026-08-31T23:59:59Z'),
          status: TimeSaleStatus.ACTIVE,
          createdAt: new Date('2026-07-15'),
          product: null,
        },
      ];

      mockTimeSaleService.findAll.mockResolvedValue({
        timeSales: mockTimeSales,
        total: 50,
      });

      const result = await controller.listTimeSales({
        page: 3,
        size: 20,
      });

      expect(service.findAll).toHaveBeenCalledWith(3, 20, undefined);
      expect(result.page).toBe(3);
      expect(result.size).toBe(20);
      expect(result.total).toBe(50);
    });
  });

  describe('status enum handling', () => {
    it('should handle all status enum values', async () => {
      const statuses = ['SCHEDULED', 'ACTIVE', 'SOLD_OUT', 'ENDED'];

      for (const status of statuses) {
        mockTimeSaleService.findAll.mockResolvedValue({
          timeSales: [],
          total: 0,
        });

        await controller.listTimeSales({
          status,
          page: 1,
          size: 10,
        });

        expect(service.findAll).toHaveBeenCalledWith(
          1,
          10,
          status as TimeSaleStatus,
        );
      }
    });

    it('should handle missing status parameter', async () => {
      mockTimeSaleService.findAll.mockResolvedValue({
        timeSales: [],
        total: 0,
      });

      await controller.listTimeSales({
        page: 1,
        size: 10,
      });

      expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined);
    });
  });
});
