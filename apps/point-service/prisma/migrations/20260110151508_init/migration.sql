-- CreateTable
CREATE TABLE `point_balances` (
    `user_id` BIGINT NOT NULL,
    `balance` BIGINT NOT NULL DEFAULT 0,
    `version` BIGINT NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `points` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `amount` BIGINT NOT NULL,
    `type` ENUM('EARNED', 'SPENT') NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `balance_snapshot` BIGINT NOT NULL,
    `version` BIGINT NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `points_user_id_idx`(`user_id`),
    INDEX `points_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
