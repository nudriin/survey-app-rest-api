/*
  Warnings:

  - You are about to alter the column `createdAt` on the `form_details` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `createdAt` on the `forms` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `created_at` on the `responses` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `createdAt` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Added the required column `select_option_text` to the `responses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `form_details` MODIFY `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `forms` MODIFY `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `questions` MODIFY `question` VARCHAR(225) NOT NULL,
    MODIFY `acronim` VARCHAR(225) NOT NULL,
    MODIFY `option_1` VARCHAR(225) NOT NULL,
    MODIFY `option_2` VARCHAR(225) NOT NULL,
    MODIFY `option_3` VARCHAR(225) NOT NULL,
    MODIFY `option_4` VARCHAR(225) NOT NULL;

-- AlterTable
ALTER TABLE `respondens` MODIFY `name` VARCHAR(225) NOT NULL,
    MODIFY `email` VARCHAR(225) NOT NULL,
    MODIFY `address` VARCHAR(225) NOT NULL,
    MODIFY `phone` VARCHAR(225) NOT NULL,
    MODIFY `education` VARCHAR(225) NOT NULL,
    MODIFY `profession` VARCHAR(225) NOT NULL,
    MODIFY `service_type` VARCHAR(225) NOT NULL;

-- AlterTable
ALTER TABLE `responses` ADD COLUMN `select_option_text` VARCHAR(225) NOT NULL,
    MODIFY `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `users` MODIFY `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
