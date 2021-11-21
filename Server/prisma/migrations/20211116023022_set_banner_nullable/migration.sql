-- DropForeignKey
ALTER TABLE `banner` DROP FOREIGN KEY `Banner_eventId_fkey`;

-- AlterTable
ALTER TABLE `banner` MODIFY `eventId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Banner` ADD CONSTRAINT `Banner_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
