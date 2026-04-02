import process from "node:process";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

process.loadEnvFile?.();

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined. Check backend/.env.");
}

const withAdapterDefaults = (rawDatabaseUrl: string): string => {
  const parsedUrl = new URL(rawDatabaseUrl);

  if (!parsedUrl.searchParams.has("allowPublicKeyRetrieval")) {
    parsedUrl.searchParams.set("allowPublicKeyRetrieval", "true");
  }

  return parsedUrl.toString();
};

const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaMariaDb(withAdapterDefaults(databaseUrl)),
  });

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
