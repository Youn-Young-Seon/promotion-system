-- CreateTable
CREATE TABLE `coupon_policies` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `total_quantity` INTEGER NOT NULL,
    `start_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NOT NULL,
    `discount_type` ENUM('FIXED_AMOUNT', 'PERCENTAGE') NOT NULL,
    `discount_value` INTEGER NOT NULL,
    `minimum_order_amount` INTEGER NOT NULL,
    `maximum_discount_amount` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coupons` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `coupon_policy_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `order_id` BIGINT NULL,
    `status` ENUM('AVAILABLE', 'USED', 'EXPIRED', 'CANCELED') NOT NULL DEFAULT 'AVAILABLE',
    `expiration_time` DATETIME(3) NOT NULL,
    `issued_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `coupons_user_id_idx`(`user_id`),
    INDEX `coupons_order_id_idx`(`order_id`),
    INDEX `coupons_status_idx`(`status`),
    INDEX `coupons_issued_at_idx`(`issued_at`),
    INDEX `coupons_coupon_policy_id_idx`(`coupon_policy_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `coupons` ADD CONSTRAINT `coupons_coupon_policy_id_fkey` FOREIGN KEY (`coupon_policy_id`) REFERENCES `coupon_policies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
