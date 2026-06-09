const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const parks = await prisma.park.findMany();
  console.log(parks.map(p => p.id));
}
main().catch(console.error).finally(() => prisma.$disconnect());
