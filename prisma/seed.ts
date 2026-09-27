import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const password = await bcrypt.hash('secret123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password,
      role: Role.ADMIN,
    },
  });

  const jane = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      name: 'Jane Doe',
      password,
      role: Role.USER,
    },
  });

  await prisma.list.deleteMany({ where: { ownerId: jane.id } });

  await prisma.list.create({
    data: {
      title: 'To Do',
      position: 0,
      ownerId: jane.id,
      cards: {
        create: [
          { title: 'Configurer le projet', position: 0 },
          {
            title: 'Rédiger le README',
            description: 'Expliquer comment lancer le projet',
            position: 1,
          },
        ],
      },
    },
  });

  await prisma.list.create({
    data: {
      title: 'En cours',
      position: 1,
      ownerId: jane.id,
      cards: { create: [{ title: "Développer l'API", position: 0 }] },
    },
  });

  await prisma.list.create({
    data: {
      title: 'Terminé',
      position: 2,
      ownerId: jane.id,
      cards: { create: [{ title: 'Choisir la technologie', position: 0 }] },
    },
  });

  console.log('Seed terminé :', admin.email, jane.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
