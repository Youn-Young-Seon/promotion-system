-- CreateEnum
CREATE TYPE "PointType" AS ENUM ('EARNED', 'SPENT', 'CANCELED');

-- CreateTable
CREATE TABLE "point_balances" (
    "user_id" BIGINT NOT NULL,
    "balance" BIGINT NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "point_balances_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "points" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "amount" BIGINT NOT NULL,
    "type" "PointType" NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "balance_snapshot" BIGINT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "points_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "points_user_id_idx" ON "points"("user_id");

-- CreateIndex
CREATE INDEX "points_created_at_idx" ON "points"("created_at");

-- CreateIndex
CREATE INDEX "points_type_idx" ON "points"("type");
