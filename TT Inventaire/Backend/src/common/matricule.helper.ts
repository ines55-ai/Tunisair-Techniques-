/**
 * Génère un matricule unique pour un utilisateur.
 * Format : 1ère lettre prénom (majuscule) + 1ère lettre nom (majuscule) + séquence 3 chiffres
 * Exemple : prenom="Karim", nom="Ben Ahmed", séquence=5 → "KB005"
 *
 * La séquence est déterminée en cherchant le dernier matricule avec le même préfixe en base.
 */

import { PrismaClient } from '@prisma/client';

export function buildMatriculePrefix(prenom: string, nom: string): string {
  const p = (prenom?.[0] ?? 'X').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const n = (nom?.[0] ?? 'X').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return `${p}${n}`;
}

export async function generateMatricule(
  prisma: PrismaClient,
  prenom: string,
  nom: string,
): Promise<string> {
  const prefix = buildMatriculePrefix(prenom, nom);

  // Chercher tous les matricules existants avec ce préfixe
  const existing = await (prisma as any).user.findMany({
    where: {
      matricule: { startsWith: prefix },
    },
    select: { matricule: true },
    orderBy: { matricule: 'desc' },
  });

  // Extraire la séquence max existante pour ce préfixe
  let maxSeq = 0;
  for (const u of existing) {
    const seqStr = u.matricule.slice(prefix.length);
    const seq = parseInt(seqStr, 10);
    if (!isNaN(seq) && seq > maxSeq) {
      maxSeq = seq;
    }
  }

  // Générer le prochain numéro en s'assurant qu'il est unique
  let seq = maxSeq + 1;
  let matricule = `${prefix}${String(seq).padStart(3, '0')}`;

  // Vérification d'unicité globale (cas de collision rare)
  while (true) {
    const conflict = await (prisma as any).user.findUnique({
      where: { matricule },
    });
    if (!conflict) break;
    seq++;
    matricule = `${prefix}${String(seq).padStart(3, '0')}`;
  }

  return matricule;
}
