import { PrismaClient } from '@prisma/client';

// Prüfen, ob wir uns im Entwicklungsmodus befinden
const isDev = process.env.NODE_ENV === 'development';

// Erstelle eine globale Variable, um den Prisma-Client zwischen den Aufrufen zu speichern
if (isDev) {
  global.prisma = global.prisma || new PrismaClient();
} else {
  var prisma = new PrismaClient();
}

// Exportiere den Prisma-Client
export default global.prisma || prisma;
