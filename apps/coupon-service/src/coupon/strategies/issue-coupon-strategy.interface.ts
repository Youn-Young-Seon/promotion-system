import { IssueCouponResponse } from '../dto';

/**
 * Issue Coupon Strategy Interface
 *
 * All coupon issuance strategies (V1, V2, V3) must implement this interface.
 * Each strategy handles coupon issuance differently based on performance requirements.
 */
export interface IssueCouponStrategy {
    /**
     * Issues a coupon to a user
     *
     * @param policyId - The coupon policy ID
     * @param userId - The user ID
     * @returns Response indicating coupon issuance or pending status
     */
    execute(policyId: bigint, userId: bigint): Promise<IssueCouponResponse>;
}

/**
 * Strategy type identifier
 */
export type StrategyType = 'v1' | 'v2' | 'v3';
