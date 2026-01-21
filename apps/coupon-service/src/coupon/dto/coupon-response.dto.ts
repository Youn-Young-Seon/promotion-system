import { CouponStatus } from '../../generated/client';

/**
 * V1/V2 전략 응답: 실제 쿠폰 객체
 */
export interface CouponIssuedResponse {
    type: 'COUPON_ISSUED';
    id: string;
    couponPolicyId: string;
    userId: string;
    status: CouponStatus;
    expirationTime: Date;
    issuedAt: Date;
}

/**
 * V3 전략 응답: 대기열 등록
 */
export interface CouponPendingResponse {
    type: 'COUPON_PENDING';
    status: string;
    message: string;
    policyId: string;
    userId: string;
}

/**
 * Discriminated Union: type 필드로 타입 구분
 * TypeScript가 자동으로 타입 가드 처리
 */
export type IssueCouponResponse = CouponIssuedResponse | CouponPendingResponse;

/**
 * Type guard functions
 */
export function isCouponIssued(response: IssueCouponResponse): response is CouponIssuedResponse {
    return response.type === 'COUPON_ISSUED';
}

export function isCouponPending(response: IssueCouponResponse): response is CouponPendingResponse {
    return response.type === 'COUPON_PENDING';
}
