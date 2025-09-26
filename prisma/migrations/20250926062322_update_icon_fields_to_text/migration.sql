-- AlterTable
ALTER TABLE `contact_info` MODIFY `icon` TEXT NULL;

-- AlterTable
ALTER TABLE `courses` MODIFY `providerIcon` TEXT NULL,
    MODIFY `icon` TEXT NULL;

-- AlterTable
ALTER TABLE `skills` MODIFY `icon` TEXT NOT NULL;
