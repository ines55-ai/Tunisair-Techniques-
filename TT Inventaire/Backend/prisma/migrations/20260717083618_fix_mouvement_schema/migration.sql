/*
  Warnings:

  - You are about to drop the column `dateDebut` on the `mouvements` table. All the data in the column will be lost.
  - You are about to drop the column `dateFin` on the `mouvements` table. All the data in the column will be lost.
  - You are about to drop the column `motif` on the `mouvements` table. All the data in the column will be lost.
  - You are about to drop the column `validePar` on the `mouvements` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `mouvements` DROP COLUMN `dateDebut`,
    DROP COLUMN `dateFin`,
    DROP COLUMN `motif`,
    DROP COLUMN `validePar`,
    ADD COLUMN `cloture` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `dateRetourPrevue` DATETIME(3) NULL,
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `effectuePar` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `mouvements` ADD CONSTRAINT `mouvements_agentDestId_fkey` FOREIGN KEY (`agentDestId`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
