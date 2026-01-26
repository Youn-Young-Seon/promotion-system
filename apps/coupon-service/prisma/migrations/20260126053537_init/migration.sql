-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('FIXED_AMOUNT', 'PERCENTAGE');

-- CreateEnum
CREATE TYPE "CouponStatus" AS ENUM ('AVAILABLE', 'USED', 'EXPIRED', 'CANCELED');

-- CreateTable
CREATE TABLE "coupon_policies" (
    "id" BIGSERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "total_quantity" INTEGER NOT NULL,
    "issued_quantity" INTEGER NOT NULL DEFAULT 0,
    "start_time" TIMESTAMP NOT NULL,
    "end_time" TIMESTAMP NOT NULL,
    "discount_type" "DiscountType" NOT NULL,
    "discount_value" INTEGER NOT NULL,
    "minimum_order_amount" INTEGER NOT NULL,
    "maximum_discount_amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "coupon_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" BIGSERIAL NOT NULL,
    "coupon_policy_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "order_id" BIGINT,
    "status" "CouponStatus" NOT NULL,
    "expiration_time" TIMESTAMP NOT NULL,
    "issued_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "coupons_user_id_idx" ON "coupons"("user_id");

-- CreateIndex
CREATE INDEX "coupons_order_id_idx" ON "coupons"("order_id");

-- CreateIndex
CREATE INDEX "coupons_status_idx" ON "coupons"("status");

-- CreateIndex
CREATE INDEX "coupons_issued_at_idx" ON "coupons"("issued_at");

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_coupon_policy_id_fkey" FOREIGN KEY ("coupon_policy_id") REFERENCES "coupon_policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
