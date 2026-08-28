import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // 1. Nettoyer la base de données (optionnel)
  console.log('🗑️  Nettoyage de la base de données...');
  await prisma.inventaireLigne.deleteMany();
  await prisma.inventaire.deleteMany();
  await prisma.antivirus.deleteMany();
  await prisma.mouvement.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.materiel.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.bureau.deleteMany();
  await prisma.categorie.deleteMany();
  await prisma.user.deleteMany();

  // 2. Créer des utilisateurs
  console.log('👥 Création des utilisateurs...');
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@tunisair.tn',
      password: hashedPassword,
      nom: 'Administrateur',
      prenom: 'Système',
      role: 'ADMIN',
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: 'mohamed.ben.ali@tunisair.tn',
      password: hashedPassword,
      nom: 'Ben Ali',
      prenom: 'Mohamed',
      role: 'USER',
    },
  });

  // 3. Créer des catégories
  console.log('📁 Création des catégories...');
  const categories = await Promise.all([
    prisma.categorie.create({ data: { code: 'PC', nom: 'Ordinateurs PC', description: 'Ordinateurs de bureau et portables' } }),
    prisma.categorie.create({ data: { code: 'IMP', nom: 'Imprimantes', description: 'Imprimantes et scanners' } }),
    prisma.categorie.create({ data: { code: 'TEL', nom: 'Téléphones', description: 'Téléphones fixes et mobiles' } }),
    prisma.categorie.create({ data: { code: 'RES', nom: 'Réseau', description: 'Équipements réseau (switchs, routeurs)' } }),
    prisma.categorie.create({ data: { code: 'SRV', nom: 'Serveurs', description: 'Serveurs physiques et virtuels' } }),
    prisma.categorie.create({ data: { code: 'ECR', nom: 'Écrans', description: 'Moniteurs et écrans' } }),
    prisma.categorie.create({ data: { code: 'ACC', nom: 'Accessoires', description: 'Claviers, souris, etc.' } }),
  ]);

  // 4. Créer des bureaux
  console.log('🏢 Création des bureaux...');
  const bureaux = await Promise.all([
    prisma.bureau.create({ data: { code: 'B101', nom: 'Bureau Direction', batiment: 'A', etage: '1', capacite: 2 } }),
    prisma.bureau.create({ data: { code: 'B202', nom: 'Bureau Comptabilité', batiment: 'A', etage: '2', capacite: 4 } }),
    prisma.bureau.create({ data: { code: 'B105', nom: 'Bureau RH', batiment: 'A', etage: '1', capacite: 3 } }),
    prisma.bureau.create({ data: { code: 'B203', nom: 'Bureau IT', batiment: 'A', etage: '2', capacite: 5 } }),
    prisma.bureau.create({ data: { code: 'B301', nom: 'Bureau Commercial', batiment: 'B', etage: '3', capacite: 4 } }),
    prisma.bureau.create({ data: { code: 'B302', nom: 'Salle Serveurs', batiment: 'B', etage: '3', capacite: 1 } }),
  ]);

  // 5. Créer des agents
  console.log('👨‍💼 Création des agents...');
  const agents = await Promise.all([
    prisma.agent.create({ data: { matricule: 'TT001', nom: 'Ben Ahmed', prenom: 'Karim', email: 'karim.benahmed@tunisair.tn', telephone: '71234567', adresseIP: '192.168.1.10', bureauId: bureaux[0].id } }),
    prisma.agent.create({ data: { matricule: 'TT002', nom: 'Trabelsi', prenom: 'Amira', email: 'amira.trabelsi@tunisair.tn', telephone: '71234568', adresseIP: '192.168.1.11', bureauId: bureaux[1].id } }),
    prisma.agent.create({ data: { matricule: 'TT003', nom: 'Bouazizi', prenom: 'Sami', email: 'sami.bouazizi@tunisair.tn', telephone: '71234569', adresseIP: '192.168.1.12', bureauId: bureaux[2].id } }),
    prisma.agent.create({ data: { matricule: 'TT004', nom: 'Gharbi', prenom: 'Leila', email: 'leila.gharbi@tunisair.tn', telephone: '71234570', adresseIP: '192.168.1.13', bureauId: bureaux[3].id } }),
    prisma.agent.create({ data: { matricule: 'TT005', nom: 'Mejri', prenom: 'Yassine', email: 'yassine.mejri@tunisair.tn', telephone: '71234571', adresseIP: '192.168.1.14', bureauId: bureaux[4].id } }),
    prisma.agent.create({ data: { matricule: 'TT006', nom: 'Nasri', prenom: 'Fatma', email: 'fatma.nasri@tunisair.tn', telephone: '71234572', adresseIP: '192.168.1.15', bureauId: bureaux[1].id } }),
    prisma.agent.create({ data: { matricule: 'TT007', nom: 'Slimani', prenom: 'Ahmed', email: 'ahmed.slimani@tunisair.tn', telephone: '71234573', adresseIP: '192.168.1.16', bureauId: bureaux[3].id } }),
    prisma.agent.create({ data: { matricule: 'TT008', nom: 'Jbeli', prenom: 'Nadia', email: 'nadia.jbeli@tunisair.tn', telephone: '71234574', adresseIP: '192.168.1.17', bureauId: bureaux[4].id } }),
  ]);

  // 6. Créer des matériels
  console.log('💻 Création des matériels...');
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);
  const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), 1);

  const materiels = await Promise.all([
    // PCs
    prisma.materiel.create({ data: { numeroSerie: 'PC-TT-001', nom: 'Dell OptiPlex 7090', marque: 'Dell', modele: 'OptiPlex 7090', categorieId: categories[0].id, statut: 'EN_SERVICE', dateAcquisition: twoYearsAgo, valeur: 1200, agentId: agents[0].id, bureauId: bureaux[0].id } }),
    prisma.materiel.create({ data: { numeroSerie: 'PC-TT-002', nom: 'HP EliteDesk 800', marque: 'HP', modele: 'EliteDesk 800 G6', categorieId: categories[0].id, statut: 'EN_SERVICE', dateAcquisition: twoYearsAgo, valeur: 1100, agentId: agents[1].id, bureauId: bureaux[1].id } }),
    prisma.materiel.create({ data: { numeroSerie: 'PC-TT-003', nom: 'Lenovo ThinkCentre', marque: 'Lenovo', modele: 'ThinkCentre M720', categorieId: categories[0].id, statut: 'EN_SERVICE', dateAcquisition: oneYearAgo, valeur: 950, agentId: agents[2].id, bureauId: bureaux[2].id } }),
    prisma.materiel.create({ data: { numeroSerie: 'PC-TT-004', nom: 'Dell Latitude 5420', marque: 'Dell', modele: 'Latitude 5420', categorieId: categories[0].id, statut: 'EN_MAINTENANCE', dateAcquisition: oneYearAgo, valeur: 1350, agentId: agents[3].id, bureauId: bureaux[3].id } }),
    prisma.materiel.create({ data: { numeroSerie: 'PC-TT-005', nom: 'HP ProBook 450', marque: 'HP', modele: 'ProBook 450 G8', categorieId: categories[0].id, statut: 'EN_SERVICE', dateAcquisition: sixMonthsAgo, valeur: 1250, agentId: agents[4].id, bureauId: bureaux[4].id } }),
    
    // Imprimantes
    prisma.materiel.create({ data: { numeroSerie: 'IMP-TT-001', nom: 'Canon imageRUNNER', marque: 'Canon', modele: 'imageRUNNER 2530i', categorieId: categories[1].id, statut: 'EN_SERVICE', dateAcquisition: twoYearsAgo, valeur: 2500, bureauId: bureaux[1].id } }),
    prisma.materiel.create({ data: { numeroSerie: 'IMP-TT-002', nom: 'HP LaserJet Pro', marque: 'HP', modele: 'LaserJet Pro M404dn', categorieId: categories[1].id, statut: 'EN_PANNE', dateAcquisition: oneYearAgo, valeur: 350, bureauId: bureaux[2].id } }),
    prisma.materiel.create({ data: { numeroSerie: 'IMP-TT-003', nom: 'Epson WorkForce', marque: 'Epson', modele: 'WorkForce Pro WF-C5790', categorieId: categories[1].id, statut: 'EN_SERVICE', dateAcquisition: sixMonthsAgo, valeur: 450, bureauId: bureaux[4].id } }),
    
    // Téléphones
    prisma.materiel.create({ data: { numeroSerie: 'TEL-TT-001', nom: 'Cisco IP Phone 8861', marque: 'Cisco', modele: '8861', categorieId: categories[2].id, statut: 'EN_SERVICE', dateAcquisition: twoYearsAgo, valeur: 300, agentId: agents[0].id, bureauId: bureaux[0].id } }),
    prisma.materiel.create({ data: { numeroSerie: 'TEL-TT-002', nom: 'Cisco IP Phone 7841', marque: 'Cisco', modele: '7841', categorieId: categories[2].id, statut: 'EN_SERVICE', dateAcquisition: twoYearsAgo, valeur: 250, agentId: agents[1].id, bureauId: bureaux[1].id } }),
    
    // Réseau
    prisma.materiel.create({ data: { numeroSerie: 'SW-TT-001', nom: 'Cisco Catalyst 2960', marque: 'Cisco', modele: 'Catalyst 2960-X', categorieId: categories[3].id, statut: 'EN_SERVICE', dateAcquisition: twoYearsAgo, valeur: 1800, bureauId: bureaux[5].id } }),
    prisma.materiel.create({ data: { numeroSerie: 'RT-TT-001', nom: 'Cisco Router 2911', marque: 'Cisco', modele: '2911', categorieId: categories[3].id, statut: 'EN_SERVICE', dateAcquisition: twoYearsAgo, valeur: 2200, bureauId: bureaux[5].id } }),
    
    // Serveurs
    prisma.materiel.create({ data: { numeroSerie: 'SRV-TT-001', nom: 'Dell PowerEdge R740', marque: 'Dell', modele: 'PowerEdge R740', categorieId: categories[4].id, statut: 'EN_SERVICE', dateAcquisition: oneYearAgo, valeur: 5500, bureauId: bureaux[5].id } }),
    prisma.materiel.create({ data: { numeroSerie: 'SRV-TT-002', nom: 'HP ProLiant DL380', marque: 'HP', modele: 'ProLiant DL380 Gen10', categorieId: categories[4].id, statut: 'EN_SERVICE', dateAcquisition: oneYearAgo, valeur: 5200, bureauId: bureaux[5].id } }),
    
    // Écrans
    prisma.materiel.create({ data: { numeroSerie: 'ECR-TT-001', nom: 'Dell UltraSharp U2419H', marque: 'Dell', modele: 'U2419H', categorieId: categories[5].id, statut: 'EN_SERVICE', dateAcquisition: oneYearAgo, valeur: 250, agentId: agents[3].id, bureauId: bureaux[3].id } }),
    prisma.materiel.create({ data: { numeroSerie: 'ECR-TT-002', nom: 'HP EliteDisplay E243', marque: 'HP', modele: 'E243', categorieId: categories[5].id, statut: 'EN_SERVICE', dateAcquisition: sixMonthsAgo, valeur: 220, agentId: agents[6].id, bureauId: bureaux[3].id } }),
    
    // Matériels en stock
    prisma.materiel.create({ data: { numeroSerie: 'PC-TT-006', nom: 'Dell OptiPlex 3080', marque: 'Dell', modele: 'OptiPlex 3080', categorieId: categories[0].id, statut: 'EN_STOCK', dateAcquisition: sixMonthsAgo, valeur: 850 } }),
    prisma.materiel.create({ data: { numeroSerie: 'ECR-TT-003', nom: 'Samsung S24F350', marque: 'Samsung', modele: 'S24F350', categorieId: categories[5].id, statut: 'EN_STOCK', dateAcquisition: sixMonthsAgo, valeur: 180 } }),
  ]);

  // 7. Créer des stocks
  console.log('📦 Création du stock...');
  await Promise.all([
    prisma.stock.create({ data: { materielId: materiels[16].id, dateArrivage: sixMonthsAgo, quantite: 3, seuilAlerte: 1, emplacement: 'Magasin A - Étagère 1', etat: 'DISPONIBLE' } }),
    prisma.stock.create({ data: { materielId: materiels[17].id, dateArrivage: sixMonthsAgo, quantite: 5, seuilAlerte: 2, emplacement: 'Magasin A - Étagère 2', etat: 'DISPONIBLE' } }),
  ]);

  // 8. Créer des mouvements
  console.log('🔄 Création des mouvements...');
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 15);
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 10);
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, 5);

  await Promise.all([
    prisma.mouvement.create({ data: { materielId: materiels[0].id, typeMouvement: 'AFFECTATION', agentDestId: agents[0].id, date: twoYearsAgo, description: 'Attribution initiale', effectuePar: 'admin@tunisair.tn', cloture: true } }),
    prisma.mouvement.create({ data: { materielId: materiels[3].id, typeMouvement: 'MAINTENANCE', date: threeMonthsAgo, dateRetourPrevue: twoMonthsAgo, description: 'Maintenance préventive', effectuePar: 'admin@tunisair.tn', cloture: true } }),
    prisma.mouvement.create({ data: { materielId: materiels[6].id, typeMouvement: 'MAINTENANCE', date: oneMonthAgo, dateRetourPrevue: now, description: 'Réparation imprimante', effectuePar: 'admin@tunisair.tn', cloture: false } }),
    prisma.mouvement.create({ data: { materielId: materiels[4].id, typeMouvement: 'AFFECTATION', agentDestId: agents[4].id, date: sixMonthsAgo, description: 'Nouvel équipement', effectuePar: 'admin@tunisair.tn', cloture: true } }),
    prisma.mouvement.create({ data: { materielId: materiels[14].id, typeMouvement: 'TRANSFERT', agentSourceId: agents[5].id, agentDestId: agents[3].id, date: twoMonthsAgo, description: 'Changement de bureau', effectuePar: 'admin@tunisair.tn', cloture: true } }),
  ]);

  // 9. Créer des antivirus
  console.log('🛡️  Création des antivirus...');
  const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  await Promise.all([
    prisma.antivirus.create({ data: { materielId: materiels[0].id, nomAntivirus: 'Kaspersky Endpoint Security', version: '11.7.0', numeroLicence: 'KASP-2024-XXXX-0001', dateInstallation: twoYearsAgo, dateExpiration: nextYear, statut: 'Actif' } }),
    prisma.antivirus.create({ data: { materielId: materiels[1].id, nomAntivirus: 'Norton 360', version: '22.21.5.39', numeroLicence: 'NORT-2023-YYYY-0002', dateInstallation: twoYearsAgo, dateExpiration: nextMonth, statut: 'À renouveler' } }),
    prisma.antivirus.create({ data: { materielId: materiels[2].id, nomAntivirus: 'Windows Defender', version: '1.381.2140.0', dateInstallation: oneYearAgo, statut: 'Actif' } }),
    prisma.antivirus.create({ data: { materielId: materiels[3].id, nomAntivirus: 'Bitdefender GravityZone', version: '7.3.3.188', numeroLicence: 'BITD-2023-ZZZZ-0003', dateInstallation: oneYearAgo, dateExpiration: lastMonth, statut: 'Expiré' } }),
    prisma.antivirus.create({ data: { materielId: materiels[4].id, nomAntivirus: 'ESET Endpoint Antivirus', version: '9.1.2046.0', numeroLicence: 'ESET-2026-AAAA-0004', dateInstallation: sixMonthsAgo, dateExpiration: nextYear, statut: 'Actif' } }),
  ]);

  // 10. Créer un inventaire
  console.log('📋 Création d\'un inventaire...');
  const inventaire = await prisma.inventaire.create({
    data: {
      reference: 'INV-2026-001',
      titre: 'Inventaire Annuel 2026',
      dateDebut: new Date(now.getFullYear(), 0, 15),
      dateFin: new Date(now.getFullYear(), 0, 25),
      statut: 'VALIDE',
      responsable: 'Mohamed Ben Ali',
      remarques: 'Inventaire général de début d\'année',
    },
  });

  // Créer les lignes d'inventaire
  const lignesData = materiels.slice(0, 10).map((materiel, index) => ({
    inventaireId: inventaire.id,
    materielId: materiel.id,
    trouve: index < 9, // 9 sur 10 trouvés
    etat: index < 9 ? 'Bon' : null,
    verifPar: index < 9 ? 'Mohamed Ben Ali' : null,
    dateVerif: index < 9 ? new Date(now.getFullYear(), 0, 18 + index) : null,
  }));

  await prisma.inventaireLigne.createMany({
    data: lignesData,
  });

  console.log('✅ Seeding terminé avec succès!');
  console.log(`
📊 Résumé:
- ${2} utilisateurs créés
- ${categories.length} catégories créées
- ${bureaux.length} bureaux créés
- ${agents.length} agents créés
- ${materiels.length} matériels créés
- ${2} articles en stock
- ${5} mouvements créés
- ${5} antivirus créés
- ${1} inventaire créé avec ${lignesData.length} lignes
  `);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
