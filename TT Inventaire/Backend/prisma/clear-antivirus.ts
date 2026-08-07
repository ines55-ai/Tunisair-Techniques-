import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Suppression des données antivirus...');

  // Compter avant suppression (pour log)
  const countBefore = await prisma.antivirus.count();
  await prisma.antivirus.deleteMany();

  const countAfter = await prisma.antivirus.count();

  console.log(`✅ Antivirus supprimés: ${countBefore} (restant: ${countAfter})`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

