-- AlterTable
ALTER TABLE `books` ADD COLUMN `book_status` VARCHAR(255) NOT NULL DEFAULT 'available';

-- AlterTable
ALTER TABLE `users` ADD COLUMN `account_status` VARCHAR(255) NOT NULL DEFAULT 'active';
