-- AlterTable
ALTER TABLE `agents` ADD COLUMN `adresseIP` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `bureaux` ADD COLUMN `capacite` INTEGER NULL;

-- CreateTable
CREATE TABLE `stock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `materielId` INTEGER NOT NULL,
    `dateArrivage` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `quantite` INTEGER NOT NULL DEFAULT 1,
    `seuilAlerte` INTEGER NULL,
    `emplacement` VARCHAR(191) NULL,
    `etat` ENUM('DISPONIBLE', 'RESERVE', 'EN_COMMANDE', 'ENDOMMAGE') NOT NULL DEFAULT 'DISPONIBLE',
    `remarques` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `stock_materielId_key`(`materielId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `stock` ADD CONSTRAINT `stock_materielId_fkey` FOREIGN KEY (`materielId`) REFERENCES `materiels`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
