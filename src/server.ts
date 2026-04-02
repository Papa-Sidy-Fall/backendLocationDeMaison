import "./lib/env.js";
import { app } from "./app.js";
import { seedDatabaseIfEmpty } from "./data/seed.js";
import { prisma } from "./lib/prisma.js";

const PORT = Number.parseInt(process.env.PORT ?? "4004", 10);

const startServer = async () => {
  await prisma.$connect();
  await seedDatabaseIfEmpty();

  app.listen(PORT, () => {
    console.log(`Serveur demarre sur http://localhost:${PORT}`);
  });
};

const shutdown = async () => {
  await prisma.$disconnect();
};

process.on("SIGINT", () => {
  void shutdown();
});

process.on("SIGTERM", () => {
  void shutdown();
});

startServer().catch(async (error) => {
  console.error("Erreur au demarrage du serveur:", error);
  await prisma.$disconnect();
  process.exit(1);
});
