-- CreateTable
CREATE TABLE `CoverImage` (
    `eventId` INTEGER NOT NULL,
    `imageId` INTEGER NOT NULL,

    UNIQUE INDEX `CoverImage_imageId_key`(`imageId`),
    PRIMARY KEY (`eventId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CoverImage` ADD CONSTRAINT `CoverImage_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoverImage` ADD CONSTRAINT `CoverImage_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
