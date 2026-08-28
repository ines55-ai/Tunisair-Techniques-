-- Étape 1 : ajouter la colonne avec une valeur par défaut temporaire
ALTER TABLE `users` ADD COLUMN `matricule` VARCHAR(191) NOT NULL DEFAULT '';

-- Étape 2 : générer un matricule unique pour chaque utilisateur existant
--           Format : 1ère lettre prenom + 1ère lettre nom + id zero-padded sur 3 chiffres
UPDATE `users`
SET `matricule` = CONCAT(
  UPPER(LEFT(`prenom`, 1)),
  UPPER(LEFT(`nom`, 1)),
  LPAD(`id`, 3, '0')
);

-- Étape 3 : supprimer la valeur par défaut et ajouter la contrainte UNIQUE
ALTER TABLE `users` ALTER COLUMN `matricule` DROP DEFAULT;
ALTER TABLE `users` ADD CONSTRAINT `users_matricule_key` UNIQUE (`matricule`);
