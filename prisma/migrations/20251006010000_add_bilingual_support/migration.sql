-- AlterTable
ALTER TABLE `about_profile` ADD COLUMN `bioEn` TEXT NULL,
    ADD COLUMN `bioHtml` LONGTEXT NULL,
    ADD COLUMN `bioHtmlEn` LONGTEXT NULL,
    ADD COLUMN `subtitleEn` VARCHAR(191) NULL,
    ADD COLUMN `titleEn` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `courses` ADD COLUMN `categoryEn` VARCHAR(191) NULL,
    ADD COLUMN `titleEn` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `education` ADD COLUMN `degreeEn` VARCHAR(191) NULL,
    ADD COLUMN `fieldEn` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `contentJson` LONGTEXT NULL,
    ADD COLUMN `contentType` VARCHAR(191) NOT NULL DEFAULT 'markdown';

-- AlterTable
ALTER TABLE `work_experience` ADD COLUMN `descriptionEn` TEXT NULL,
    ADD COLUMN `descriptionHtmlEn` LONGTEXT NULL,
    ADD COLUMN `positionEn` VARCHAR(191) NULL;
