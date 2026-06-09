import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.reservation.deleteMany();
  await prisma.park.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin1234!', 12);
  const admin = await prisma.user.create({
    data: {
      nombre: 'Admin',
      apellidos: 'LuciMap',
      email: 'admin@lucimap.mx',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // Create test client user
  const clientPassword = await bcrypt.hash('Client1234!', 12);
  const client1 = await prisma.user.create({
    data: {
      nombre: 'Juan',
      apellidos: 'Perez',
      email: 'juan@example.com',
      password: clientPassword,
      role: 'CLIENT',
    },
  });
  console.log('Client user created:', client1.email);

  // Create parks
  const parks = await Promise.all([
    prisma.park.create({
      data: {
        nombre: 'Parque Nanacamilpa',
        direccion: 'Nanacamilpa, Tlaxcala',
        servicios: 'Baños, Estacionamiento, Guías',
        horario: '18:00 - 23:00',
        hasCabins: true,
        stockCabanas: 5,
        lat: 19.4975,
        lng: -98.5361,
      },
    }),
    prisma.park.create({
      data: {
        nombre: 'Parque Piedra Canteada',
        direccion: 'Zaragoza, Puebla',
        servicios: 'Baños, Restaurante',
        horario: '17:00 - 22:00',
        hasCabins: true,
        stockCabanas: 3,
        lat: 19.4589,
        lng: -98.6014,
      },
    }),
    prisma.park.create({
      data: {
        nombre: 'Zona Natural El Capulín',
        direccion: 'Amecameca, Estado de México',
        servicios: 'Baños ecológicos, Senderos',
        horario: '18:30 - 23:30',
        hasCabins: false,
        stockCabanas: 0,
        lat: 19.1236,
        lng: -98.7654,
      },
    }),
    prisma.park.create({
      data: {
        nombre: 'Santuario del Valle',
        direccion: 'Nanacamilpa, Tlaxcala',
        servicios: 'Baños, Comida local, Guías',
        horario: '18:00 - 23:30',
        hasCabins: true,
        stockCabanas: 4,
        lat: 19.4621,
        lng: -98.5412,
      },
    }),
    prisma.park.create({
      data: {
        nombre: 'EcoParque Luciérnaga Dorada',
        direccion: 'Tlalpujahua, Michoacán',
        servicios: 'Estacionamiento, Cabañas, Fogatas',
        horario: '19:00 - 24:00',
        hasCabins: true,
        stockCabanas: 6,
        lat: 19.8056,
        lng: -100.1743,
      },
    }),
    prisma.park.create({
      data: {
        nombre: 'Reserva Natural Xalpatlahuac',
        direccion: 'Huamantla, Tlaxcala',
        servicios: 'Camping, Baños ecológicos',
        horario: '18:30 - 23:00',
        hasCabins: false,
        stockCabanas: 0,
        lat: 19.3142,
        lng: -97.9254,
      },
    }),
    prisma.park.create({
      data: {
        nombre: 'Santuario Canto del Bosque',
        direccion: 'Nanacamilpa, Tlaxcala',
        servicios: 'Senderos, Restaurante, Baños',
        horario: '18:30 - 23:30',
        hasCabins: true,
        stockCabanas: 8,
        lat: 19.4990,
        lng: -98.5400,
      },
    }),
    prisma.park.create({
      data: {
        nombre: 'Parque Ecológico San Pedro',
        direccion: 'San Pedro, Puebla',
        servicios: 'Estacionamiento, Zonas de picnic',
        horario: '17:00 - 22:00',
        hasCabins: false,
        stockCabanas: 0,
        lat: 19.4500,
        lng: -98.6500,
      },
    }),
  ]);
  console.log('Parks created');

  // Create some sample reservations
  // Note: These use arbitrary dates within the festival period.
  await prisma.reservation.createMany({
    data: [
      {
        userId: client1.id,
        parkId: parks[0].id,
        fechaInicio: new Date('2026-06-10T12:00:00Z'),
        fechaFin: new Date('2026-06-12T12:00:00Z'),
        numPersonas: 2,
        tipo: 'CABIN',
        codigo: 'LUC-MOCK1'
      },
      {
        userId: client1.id,
        parkId: parks[1].id,
        fechaInicio: new Date('2026-07-15T12:00:00Z'),
        fechaFin: new Date('2026-07-16T12:00:00Z'),
        numPersonas: 4,
        tipo: 'CAMPING',
        codigo: 'LUC-MOCK2'
      },
      {
        userId: client1.id,
        parkId: parks[2].id,
        fechaInicio: new Date('2026-08-05T12:00:00Z'),
        fechaFin: new Date('2026-08-07T12:00:00Z'),
        numPersonas: 3,
        tipo: 'CAMPING',
        codigo: 'LUC-MOCK3'
      },
    ],
  });
  console.log('Sample reservations created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
