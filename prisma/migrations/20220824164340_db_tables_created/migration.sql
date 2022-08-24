-- CreateTable
CREATE TABLE `users` (
    `userId` VARCHAR(255) NOT NULL,
    `userName` VARCHAR(255) NOT NULL,
    `id_loc` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `login` (
    `userId` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `books` (
    `bookId` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `author` VARCHAR(255) NOT NULL,
    `cover_loc` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `status` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`bookId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_book` (
    `userId` VARCHAR(255) NOT NULL,
    `bookId` VARCHAR(255) NOT NULL,
    `allocatedOn` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `returnedOn` TIMESTAMP(0) NULL,

    PRIMARY KEY (`userId`, `bookId`, `allocatedOn`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `login` ADD CONSTRAINT `users_login_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_book` ADD CONSTRAINT `user_book_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_book` ADD CONSTRAINT `user_book_ibfk_2` FOREIGN KEY (`bookId`) REFERENCES `books`(`bookId`) ON DELETE CASCADE ON UPDATE NO ACTION;
