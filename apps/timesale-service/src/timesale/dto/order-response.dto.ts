import { OrderStatus } from '../../generated/client';

/**
 * V1/V2 전략 응답: 실제 주문 객체
 */
export interface OrderCreatedResponse {
    type: 'ORDER_CREATED';
    id: string;
    userId: string;
    timeSaleId: string;
    quantity: string;
    status: OrderStatus;
    createdAt: Date;
}

/**
 * V3 전략 응답: 대기열 등록
 */
export interface OrderQueuedResponse {
    type: 'ORDER_QUEUED';
    status: string;
    message: string;
    timeSaleId: string;
    userId: string;
    queuePosition: string;
}

/**
 * Discriminated Union: type 필드로 타입 구분
 * TypeScript가 자동으로 타입 가드 처리
 */
export type CreateOrderResponse = OrderCreatedResponse | OrderQueuedResponse;

/**
 * Type guard functions
 */
export function isOrderCreated(response: CreateOrderResponse): response is OrderCreatedResponse {
    return response.type === 'ORDER_CREATED';
}

export function isOrderQueued(response: CreateOrderResponse): response is OrderQueuedResponse {
    return response.type === 'ORDER_QUEUED';
}
