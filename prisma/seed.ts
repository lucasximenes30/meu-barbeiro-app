import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ['query'] });

async function main() {
  console.log('Start seeding...');

  // 1. Create a Barbershop
  const barbershop = await prisma.barbershop.create({
    data: {
      name: 'Barbearia Vintage',
      document: '12.345.678/0001-90',
      phone: '11999999999',
      address: 'Rua das Flores, 123',
    },
  });

  // 2. Create Settings
  await prisma.settings.create({
    data: {
      barbershopId: barbershop.id,
      openingTime: '09:00',
      closingTime: '20:00',
      slotDuration: 30,
    },
  });

  // 3. Create Users (Owner and Barber)
  const owner = await prisma.user.create({
    data: {
      barbershopId: barbershop.id,
      name: 'João Dono',
      email: 'joao@barbearia.com',
      password: 'hashed_password_here', // mock
      role: 'OWNER',
    },
  });

  const barber = await prisma.user.create({
    data: {
      barbershopId: barbershop.id,
      name: 'Pedro Barbeiro',
      email: 'pedro@barbearia.com',
      password: 'hashed_password_here',
      role: 'BARBER',
    },
  });

  // 4. Create Customers
  const customer = await prisma.customer.create({
    data: {
      barbershopId: barbershop.id,
      name: 'Lucas Cliente',
      email: 'lucas@cliente.com',
      phone: '11988888888',
    },
  });

  // 5. Create Services
  const haircut = await prisma.service.create({
    data: {
      barbershopId: barbershop.id,
      name: 'Corte Clássico',
      price: 50.0,
      duration: 30,
    },
  });

  const beard = await prisma.service.create({
    data: {
      barbershopId: barbershop.id,
      name: 'Barba Terapia',
      price: 35.0,
      duration: 30,
    },
  });

  // 6. Create Products
  const pomade = await prisma.product.create({
    data: {
      barbershopId: barbershop.id,
      name: 'Pomada Matte',
      price: 45.0,
      stock: 20,
    },
  });

  // 7. Create Appointment
  await prisma.appointment.create({
    data: {
      barbershopId: barbershop.id,
      customerId: customer.id,
      userId: barber.id,
      serviceId: haircut.id,
      date: new Date(new Date().setHours(14, 0, 0, 0)),
      status: 'CONFIRMED',
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
