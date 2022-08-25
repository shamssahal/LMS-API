-- AlterTable
ALTER TABLE `users` ADD COLUMN `available_credit` INTEGER NOT NULL DEFAULT 5,
    ADD COLUMN `default_credit` INTEGER NOT NULL DEFAULT 5;
