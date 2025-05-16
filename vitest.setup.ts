import { PrismaClient } from '@prisma/client';

// Ensure Prisma client is generated before tests run
const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});
