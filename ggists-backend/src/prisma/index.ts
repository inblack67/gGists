import { PrismaClient } from '@prisma/client';

export const getPrismaClient = () => {
  const prisma = new PrismaClient({ log: ['query', 'error', 'info', 'warn'] });
  return prisma;
};
