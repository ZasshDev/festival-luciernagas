const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'master@lucimap.mx';
  const password = 'Password123!';
  const hashedPassword = await bcrypt.hash(password, 12);
  
  await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN'
    },
    create: {
      nombre: 'Master',
      apellidos: 'Admin',
      email: email,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Account created successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
