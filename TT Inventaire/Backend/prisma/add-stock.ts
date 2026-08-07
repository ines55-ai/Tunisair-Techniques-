import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📦 Ajout de matériels en stock...');

  // Récupérer les catégories existantes
  const categories = await prisma.categorie.findMany();
  const catMap: Record<string, number> = {};
  categories.forEach(c => { catMap[c.code] = c.id; });

  const now = new Date();
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

  const stockItems = [
    // PCs
    { numeroSerie: 'PC-STK-001', nom: 'Dell OptiPlex 5090', marque: 'Dell', modele: 'OptiPlex 5090', categorieCode: 'PC', valeur: 980, dateAcquisition: oneMonthAgo, emplacement: 'Magasin A - Étagère 1', quantite: 3 },
    { numeroSerie: 'PC-STK-002', nom: 'HP EliteDesk 705 G8', marque: 'HP', modele: 'EliteDesk 705 G8', categorieCode: 'PC', valeur: 920, dateAcquisition: oneMonthAgo, emplacement: 'Magasin A - Étagère 1', quantite: 2 },
    { numeroSerie: 'PC-STK-003', nom: 'Lenovo ThinkPad E15', marque: 'Lenovo', modele: 'ThinkPad E15 Gen 3', categorieCode: 'PC', valeur: 1150, dateAcquisition: twoMonthsAgo, emplacement: 'Magasin A - Étagère 2', quantite: 2 },

    // Écrans
    { numeroSerie: 'ECR-STK-001', nom: 'Dell P2422H', marque: 'Dell', modele: 'P2422H 24"', categorieCode: 'ECR', valeur: 210, dateAcquisition: oneMonthAgo, emplacement: 'Magasin A - Étagère 3', quantite: 5 },
    { numeroSerie: 'ECR-STK-002', nom: 'LG 24MK430H', marque: 'LG', modele: '24MK430H-B', categorieCode: 'ECR', valeur: 185, dateAcquisition: twoMonthsAgo, emplacement: 'Magasin A - Étagère 3', quantite: 4 },

    // Imprimantes
    { numeroSerie: 'IMP-STK-001', nom: 'HP LaserJet M110w', marque: 'HP', modele: 'LaserJet M110w', categorieCode: 'IMP', valeur: 280, dateAcquisition: oneMonthAgo, emplacement: 'Magasin B - Étagère 1', quantite: 2 },
    { numeroSerie: 'IMP-STK-002', nom: 'Brother HL-L2350DW', marque: 'Brother', modele: 'HL-L2350DW', categorieCode: 'IMP', valeur: 230, dateAcquisition: twoMonthsAgo, emplacement: 'Magasin B - Étagère 1', quantite: 3 },

    // Accessoires
    { numeroSerie: 'ACC-STK-001', nom: 'Clavier Logitech MK270', marque: 'Logitech', modele: 'MK270 Wireless', categorieCode: 'ACC', valeur: 35, dateAcquisition: oneMonthAgo, emplacement: 'Magasin B - Étagère 2', quantite: 10 },
    { numeroSerie: 'ACC-STK-002', nom: 'Souris Logitech M185', marque: 'Logitech', modele: 'M185 Wireless', categorieCode: 'ACC', valeur: 20, dateAcquisition: oneMonthAgo, emplacement: 'Magasin B - Étagère 2', quantite: 10 },
    { numeroSerie: 'ACC-STK-003', nom: 'Casque Jabra Evolve2 30', marque: 'Jabra', modele: 'Evolve2 30', categorieCode: 'ACC', valeur: 95, dateAcquisition: twoMonthsAgo, emplacement: 'Magasin B - Étagère 3', quantite: 6 },

    // Réseau
    { numeroSerie: 'SW-STK-001', nom: 'Switch TP-Link TL-SG108', marque: 'TP-Link', modele: 'TL-SG108 8 ports', categorieCode: 'RES', valeur: 45, dateAcquisition: twoMonthsAgo, emplacement: 'Magasin B - Étagère 4', quantite: 4 },
  ];

  let created = 0;
  for (const item of stockItems) {
    const categorieId = catMap[item.categorieCode];
    if (!categorieId) {
      console.warn(`⚠️  Catégorie "${item.categorieCode}" introuvable, skipping ${item.numeroSerie}`);
      continue;
    }

    // Vérifier si le matériel existe déjà
    const existing = await prisma.materiel.findUnique({ where: { numeroSerie: item.numeroSerie } });
    if (existing) {
      console.log(`⏭️  ${item.numeroSerie} existe déjà, skipping`);
      continue;
    }

    const materiel = await prisma.materiel.create({
      data: {
        numeroSerie: item.numeroSerie,
        nom: item.nom,
        marque: item.marque,
        modele: item.modele,
        categorieId,
        statut: 'EN_STOCK',
        dateAcquisition: item.dateAcquisition,
        valeur: item.valeur,
      },
    });

    await prisma.stock.create({
      data: {
        materielId: materiel.id,
        dateArrivage: item.dateAcquisition,
        quantite: item.quantite,
        seuilAlerte: Math.max(1, Math.floor(item.quantite / 3)),
        emplacement: item.emplacement,
        etat: 'DISPONIBLE',
      },
    });

    console.log(`✅ ${item.nom} (${item.numeroSerie}) — qté: ${item.quantite}`);
    created++;
  }

  console.log(`\n🎉 ${created} matériels ajoutés en stock avec succès!`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
