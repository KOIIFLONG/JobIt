import { PrismaClient } from '@prisma/client'

// Ensure single Prisma instance in development
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error']
  })

// Prevent multiple instances in production
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma