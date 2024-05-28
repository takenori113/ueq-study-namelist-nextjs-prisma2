/*
  Warnings:

  - You are about to drop the column `uidId` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the `Uid` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `uid` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Person` DROP FOREIGN KEY `Person_uidId_fkey`;

-- AlterTable
ALTER TABLE `Person` DROP COLUMN `uidId`,
    ADD COLUMN `uid` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Uid`;

-- CreateTable
CREATE TABLE `User` (
    `email` VARCHAR(191) NULL,
    `uid` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Person` ADD CONSTRAINT `Person_uid_fkey` FOREIGN KEY (`uid`) REFERENCES `User`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;
