-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'MANAGER', 'USER') NOT NULL DEFAULT 'USER',
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matricule` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `telephone` VARCHAR(191) NULL,
    `poste` VARCHAR(191) NULL,
    `departement` VARCHAR(191) NULL,
    `bureauId` INTEGER NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `agents_matricule_key`(`matricule`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bureaux` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `etage` VARCHAR(191) NULL,
    `batiment` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `bureaux_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `categories_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materiels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numeroSerie` VARCHAR(191) NOT NULL,
    `numeroInventaire` VARCHAR(191) NULL,
    `nom` VARCHAR(191) NOT NULL,
    `marque` VARCHAR(191) NULL,
    `modele` VARCHAR(191) NULL,
    `categorieId` INTEGER NOT NULL,
    `statut` ENUM('EN_SERVICE', 'EN_PANNE', 'EN_MAINTENANCE', 'EN_STOCK', 'REFORME', 'PERDU') NOT NULL DEFAULT 'EN_SERVICE',
    `dateAcquisition` DATETIME(3) NULL,
    `garantieExpire` DATETIME(3) NULL,
    `valeur` DOUBLE NULL,
    `agentId` INTEGER NULL,
    `bureauId` INTEGER NULL,
    `description` TEXT NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `materiels_numeroSerie_key`(`numeroSerie`),
    UNIQUE INDEX `materiels_numeroInventaire_key`(`numeroInventaire`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mouvements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `materielId` INTEGER NOT NULL,
    `typeMouvement` ENUM('AFFECTATION', 'RETOUR', 'TRANSFERT', 'MAINTENANCE', 'REFORME') NOT NULL,
    `agentSourceId` INTEGER NULL,
    `agentDestId` INTEGER NULL,
    `dateDebut` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateFin` DATETIME(3) NULL,
    `motif` TEXT NULL,
    `remarques` TEXT NULL,
    `validePar` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventaires` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reference` VARCHAR(191) NOT NULL,
    `titre` VARCHAR(191) NOT NULL,
    `dateDebut` DATETIME(3) NOT NULL,
    `dateFin` DATETIME(3) NULL,
    `statut` ENUM('EN_COURS', 'TERMINE', 'VALIDE', 'ANNULE') NOT NULL DEFAULT 'EN_COURS',
    `responsable` VARCHAR(191) NOT NULL,
    `remarques` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `inventaires_reference_key`(`reference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventaire_lignes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inventaireId` INTEGER NOT NULL,
    `materielId` INTEGER NOT NULL,
    `trouve` BOOLEAN NOT NULL DEFAULT false,
    `etat` VARCHAR(191) NULL,
    `remarques` TEXT NULL,
    `dateVerif` DATETIME(3) NULL,
    `verifPar` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `antivirus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `materielId` INTEGER NOT NULL,
    `nomAntivirus` VARCHAR(191) NOT NULL,
    `version` VARCHAR(191) NULL,
    `numeroLicence` VARCHAR(191) NULL,
    `dateInstallation` DATETIME(3) NULL,
    `dateExpiration` DATETIME(3) NULL,
    `statut` VARCHAR(191) NOT NULL DEFAULT 'Actif',
    `remarques` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `agents` ADD CONSTRAINT `agents_bureauId_fkey` FOREIGN KEY (`bureauId`) REFERENCES `bureaux`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `materiels` ADD CONSTRAINT `materiels_categorieId_fkey` FOREIGN KEY (`categorieId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `materiels` ADD CONSTRAINT `materiels_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `materiels` ADD CONSTRAINT `materiels_bureauId_fkey` FOREIGN KEY (`bureauId`) REFERENCES `bureaux`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mouvements` ADD CONSTRAINT `mouvements_materielId_fkey` FOREIGN KEY (`materielId`) REFERENCES `materiels`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mouvements` ADD CONSTRAINT `mouvements_agentSourceId_fkey` FOREIGN KEY (`agentSourceId`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventaire_lignes` ADD CONSTRAINT `inventaire_lignes_inventaireId_fkey` FOREIGN KEY (`inventaireId`) REFERENCES `inventaires`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventaire_lignes` ADD CONSTRAINT `inventaire_lignes_materielId_fkey` FOREIGN KEY (`materielId`) REFERENCES `materiels`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `antivirus` ADD CONSTRAINT `antivirus_materielId_fkey` FOREIGN KEY (`materielId`) REFERENCES `materiels`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
