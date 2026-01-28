import { Test, TestingModule } from '@nestjs/testing';
import { PointGrpcController } from './point.grpc.controller';
import { PointService } from './point.service';
import { PointType } from '../../prisma/generated/client';

describe('PointGrpcController', () => {
  let controller: PointGrpcController;
  let service: PointService;

  const mockPointService = {
    earnPoints: jest.fn(),
    usePoints: jest.fn(),
    cancelPoints: jest.fn(),
    getBalance: jest.fn(),
    getHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointGrpcController],
      providers: [
        {
          provide: PointService,
          useValue: mockPointService,
        },
      ],
    }).compile();

    controller = module.get<PointGrpcController>(PointGrpcController);
    service = module.get<PointService>(PointService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('earnPoints', () => {
    it('should earn points successfully with string parameters', async () => {
      const mockPoint = {
        id: BigInt(1),
        userId: BigInt(100),
        amount: BigInt(1000),
        type: PointType.EARNED,
        description: 'Signup bonus',
        balanceSnapshot: BigInt(5000),
        createdAt: new Date('2026-01-01'),
      };

      mockPointService.earnPoints.mockResolvedValue(mockPoint);

      const result = await controller.earnPoints({
        userId: '100',
        amount: '1000',
        description: 'Signup bonus',
      });

      expect(service.earnPoints).toHaveBeenCalledWith({
        userId: 100,
        amount: 1000,
        description: 'Signup bonus',
      });

      expect(result).toEqual({
        point: {
          id: '1',
          userId: '100',
          amount: '1000',
          type: PointType.EARNED,
          description: 'Signup bonus',
          balanceSnapshot: '5000',
          createdAt: mockPoint.createdAt.toISOString(),
        },
      });
    });

    it('should earn points successfully with number parameters', async () => {
      const mockPoint = {
        id: BigInt(2),
        userId: BigInt(200),
        amount: BigInt(2000),
        type: PointType.EARNED,
        description: 'Purchase reward',
        balanceSnapshot: BigInt(10000),
        createdAt: new Date('2026-01-02'),
      };

      mockPointService.earnPoints.mockResolvedValue(mockPoint);

      await controller.earnPoints({
        userId: 200,
        amount: 2000,
        description: 'Purchase reward',
      });

      expect(service.earnPoints).toHaveBeenCalledWith({
        userId: 200,
        amount: 2000,
        description: 'Purchase reward',
      });
    });

    it('should handle null description', async () => {
      const mockPoint = {
        id: BigInt(3),
        userId: BigInt(300),
        amount: BigInt(500),
        type: PointType.EARNED,
        description: null,
        balanceSnapshot: BigInt(500),
        createdAt: new Date('2026-01-03'),
      };

      mockPointService.earnPoints.mockResolvedValue(mockPoint);

      const result = await controller.earnPoints({
        userId: 300,
        amount: 500,
        description: 'Test',
      });

      expect(result.point.description).toBe('');
    });
  });

  describe('usePoints', () => {
    it('should use points successfully', async () => {
      const mockPoint = {
        id: BigInt(4),
        userId: BigInt(100),
        amount: BigInt(-500),
        type: PointType.SPENT,
        description: 'Order payment',
        balanceSnapshot: BigInt(4500),
        createdAt: new Date('2026-01-10'),
      };

      mockPointService.usePoints.mockResolvedValue(mockPoint);

      const result = await controller.usePoints({
        userId: '100',
        amount: '500',
        description: 'Order payment',
      });

      expect(service.usePoints).toHaveBeenCalledWith({
        userId: 100,
        amount: 500,
        description: 'Order payment',
      });

      expect(result).toEqual({
        point: {
          id: '4',
          userId: '100',
          amount: '-500',
          type: PointType.SPENT,
          description: 'Order payment',
          balanceSnapshot: '4500',
          createdAt: mockPoint.createdAt.toISOString(),
        },
      });
    });

    it('should handle number parameters', async () => {
      const mockPoint = {
        id: BigInt(5),
        userId: BigInt(200),
        amount: BigInt(-1000),
        type: PointType.SPENT,
        description: 'Shopping',
        balanceSnapshot: BigInt(9000),
        createdAt: new Date('2026-01-11'),
      };

      mockPointService.usePoints.mockResolvedValue(mockPoint);

      await controller.usePoints({
        userId: 200,
        amount: 1000,
        description: 'Shopping',
      });

      expect(service.usePoints).toHaveBeenCalledWith({
        userId: 200,
        amount: 1000,
        description: 'Shopping',
      });
    });
  });

  describe('cancelPoints', () => {
    it('should cancel points successfully', async () => {
      const mockPoint = {
        id: BigInt(6),
        userId: BigInt(100),
        amount: BigInt(500),
        type: PointType.CANCELED,
        description: 'Order cancellation refund',
        balanceSnapshot: BigInt(5000),
        createdAt: new Date('2026-01-15'),
      };

      mockPointService.cancelPoints.mockResolvedValue(mockPoint);

      const result = await controller.cancelPoints({
        transactionId: '4',
        description: 'Order cancellation refund',
      });

      expect(service.cancelPoints).toHaveBeenCalledWith({
        transactionId: 4,
        description: 'Order cancellation refund',
      });

      expect(result).toEqual({
        point: {
          id: '6',
          userId: '100',
          amount: '500',
          type: PointType.CANCELED,
          description: 'Order cancellation refund',
          balanceSnapshot: '5000',
          createdAt: mockPoint.createdAt.toISOString(),
        },
      });
    });

    it('should handle number parameter', async () => {
      const mockPoint = {
        id: BigInt(7),
        userId: BigInt(200),
        amount: BigInt(1000),
        type: PointType.CANCELED,
        description: 'Refund',
        balanceSnapshot: BigInt(10000),
        createdAt: new Date('2026-01-16'),
      };

      mockPointService.cancelPoints.mockResolvedValue(mockPoint);

      await controller.cancelPoints({
        transactionId: 5,
        description: 'Refund',
      });

      expect(service.cancelPoints).toHaveBeenCalledWith({
        transactionId: 5,
        description: 'Refund',
      });
    });
  });

  describe('getBalance', () => {
    it('should get balance successfully with string parameter', async () => {
      mockPointService.getBalance.mockResolvedValue(5000);

      const result = await controller.getBalance({ userId: '100' });

      expect(service.getBalance).toHaveBeenCalledWith(100);

      expect(result).toEqual({
        userId: '100',
        balance: '5000',
      });
    });

    it('should get balance successfully with number parameter', async () => {
      mockPointService.getBalance.mockResolvedValue(10000);

      const result = await controller.getBalance({ userId: 200 });

      expect(service.getBalance).toHaveBeenCalledWith(200);

      expect(result).toEqual({
        userId: '200',
        balance: '10000',
      });
    });

    it('should return zero balance for new user', async () => {
      mockPointService.getBalance.mockResolvedValue(0);

      const result = await controller.getBalance({ userId: 300 });

      expect(result).toEqual({
        userId: '300',
        balance: '0',
      });
    });
  });

  describe('getHistory', () => {
    it('should get point history successfully', async () => {
      const mockPoints = [
        {
          id: BigInt(1),
          userId: BigInt(100),
          amount: BigInt(1000),
          type: PointType.EARNED,
          description: 'Signup bonus',
          balanceSnapshot: BigInt(1000),
          createdAt: new Date('2026-01-01'),
        },
        {
          id: BigInt(2),
          userId: BigInt(100),
          amount: BigInt(-500),
          type: PointType.SPENT,
          description: 'Order payment',
          balanceSnapshot: BigInt(500),
          createdAt: new Date('2026-01-10'),
        },
      ];

      mockPointService.getHistory.mockResolvedValue({
        points: mockPoints,
        total: 2,
      });

      const result = await controller.getHistory({
        userId: '100',
        page: 1,
        size: 10,
      });

      expect(service.getHistory).toHaveBeenCalledWith(100, 1, 10);

      expect(result).toEqual({
        points: [
          {
            id: '1',
            userId: '100',
            amount: '1000',
            type: PointType.EARNED,
            description: 'Signup bonus',
            balanceSnapshot: '1000',
            createdAt: mockPoints[0]!.createdAt.toISOString(),
          },
          {
            id: '2',
            userId: '100',
            amount: '-500',
            type: PointType.SPENT,
            description: 'Order payment',
            balanceSnapshot: '500',
            createdAt: mockPoints[1]!.createdAt.toISOString(),
          },
        ],
        total: 2,
        page: 1,
        size: 10,
      });
    });

    it('should handle empty history', async () => {
      mockPointService.getHistory.mockResolvedValue({
        points: [],
        total: 0,
      });

      const result = await controller.getHistory({
        userId: 100,
        page: 1,
        size: 10,
      });

      expect(result).toEqual({
        points: [],
        total: 0,
        page: 1,
        size: 10,
      });
    });

    it('should handle pagination correctly', async () => {
      const mockPoints = [
        {
          id: BigInt(11),
          userId: BigInt(100),
          amount: BigInt(100),
          type: PointType.EARNED,
          description: 'Daily bonus',
          balanceSnapshot: BigInt(6100),
          createdAt: new Date('2026-01-20'),
        },
      ];

      mockPointService.getHistory.mockResolvedValue({
        points: mockPoints,
        total: 25,
      });

      const result = await controller.getHistory({
        userId: 100,
        page: 3,
        size: 10,
      });

      expect(service.getHistory).toHaveBeenCalledWith(100, 3, 10);
      expect(result.page).toBe(3);
      expect(result.size).toBe(10);
      expect(result.total).toBe(25);
    });
  });
});
