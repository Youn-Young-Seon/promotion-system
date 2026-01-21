import { CreateOrderResponse } from '../dto';

/**
 * Order Strategy Interface
 *
 * All order processing strategies (V1, V2, V3) must implement this interface.
 * Each strategy handles order creation differently based on performance requirements.
 */
export interface OrderStrategy {
    /**
     * Creates an order for a timesale
     *
     * @param timeSaleId - The timesale ID
     * @param userId - The user ID
     * @param quantity - The quantity to order
     * @returns Response indicating order creation or queue status
     */
    execute(timeSaleId: bigint, userId: bigint, quantity: bigint): Promise<CreateOrderResponse>;
}

/**
 * Strategy type identifier
 */
export type StrategyType = 'v1' | 'v2' | 'v3';
