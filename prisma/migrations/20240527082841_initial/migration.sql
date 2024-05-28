/*
  Warnings:

  - You are about to drop the `person` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `person`;

-- CreateTable
CREATE TABLE `Person` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NULL,
    `note` VARCHAR(191) NULL,
    `photo` VARCHAR(191) NULL,
    `birth_date` VARCHAR(191) NULL,
    `uidId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Uid` (
    `uid` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Person` ADD CONSTRAINT `Person_uidId_fkey` FOREIGN KEY (`uidId`) REFERENCES `Uid`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;
