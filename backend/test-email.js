const { PrismaClient } = require('@prisma/client');
const { sendConfirmationEmail } = require('./src/services/email.service');
const prisma = new PrismaClient();

async function main() {
  const email = 'zasshie02@gmail.com';
  
  // Find or create user
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        nombre: 'Zasshie',
        apellidos: 'Tester',
        email,
        password: 'TestPassword123!',
        role: 'CLIENT'
      }
    });
  }

  // Find a park
  const park = await prisma.park.findFirst();
  if (!park) {
    console.error('No parks found. Please run the seed first.');
    return;
  }

  // Create a reservation
  const reservation = await prisma.reservation.create({
    data: {
      userId: user.id,
      parkId: park.id,
      fechaInicio: new Date('2026-06-15T12:00:00Z'),
      fechaFin: new Date('2026-06-17T12:00:00Z'),
      numPersonas: 4,
      tipo: 'CABIN',
      codigo: 'LUC-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    },
    include: {
      user: true,
      park: true,
    }
  });

  console.log(`Reservation created for ${email}. Sending email...`);

  // Send the email
  await sendConfirmationEmail(email, {
    id: reservation.id,
    codigo: reservation.codigo,
    parkName: reservation.park.nombre,
    fechaInicio: reservation.fechaInicio,
    fechaFin: reservation.fechaFin,
    numPersonas: reservation.numPersonas,
    tipo: reservation.tipo,
  });

  console.log('Done! Check your inbox (or Ethereal URL if using test credentials).');
}

main().catch(console.error).finally(() => prisma.$disconnect());
