-- CreateEnum
CREATE TYPE "TimeSaleStatus" AS ENUM ('SCHEDULED', 'ACTIVE', 'ENDED', 'SOLD_OUT');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELED');

-- CreateTable
CREATE TABLE "products" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_sales" (
    "id" BIGSERIAL NOT NULL,
    "product_id" BIGINT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "remaining_quantity" INTEGER NOT NULL,
    "discount_price" INTEGER NOT NULL,
    "start_at" TIMESTAMP NOT NULL,
    "end_at" TIMESTAMP NOT NULL,
    "status" "TimeSaleStatus" NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "time_sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_sale_orders" (
    "id" BIGSERIAL NOT NULL,
    "time_sale_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "queue_number" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "time_sale_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "time_sales_product_id_idx" ON "time_sales"("product_id");

-- CreateIndex
CREATE INDEX "time_sales_status_idx" ON "time_sales"("status");

-- CreateIndex
CREATE INDEX "time_sales_start_at_idx" ON "time_sales"("start_at");

-- CreateIndex
CREATE INDEX "time_sale_orders_time_sale_id_idx" ON "time_sale_orders"("time_sale_id");

-- CreateIndex
CREATE INDEX "time_sale_orders_user_id_idx" ON "time_sale_orders"("user_id");

-- CreateIndex
CREATE INDEX "time_sale_orders_status_idx" ON "time_sale_orders"("status");

-- CreateIndex
CREATE INDEX "time_sale_orders_created_at_idx" ON "time_sale_orders"("created_at");

-- AddForeignKey
ALTER TABLE "time_sales" ADD CONSTRAINT "time_sales_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_sale_orders" ADD CONSTRAINT "time_sale_orders_time_sale_id_fkey" FOREIGN KEY ("time_sale_id") REFERENCES "time_sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
