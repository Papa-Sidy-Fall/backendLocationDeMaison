import { properties as seededProperties, users as seededUsers } from "./store.js";
import { prisma } from "../lib/prisma.js";
import { toDbListingStatus, toDbUserRole, toDbUserStatus } from "../utils/prisma-mappers.js";

const toDateOnlyValue = (value: string): Date => {
  const parsedDate = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return new Date();
  }

  return parsedDate;
};

export const seedDatabaseIfEmpty = async (): Promise<void> => {
  // Avoid opening an explicit transaction during bootstrap.
  // With the MariaDB adapter, simple startup reads are more reliable
  // when they run as regular queries.
  const usersCount = await prisma.user.count();
  const propertiesCount = await prisma.property.count();

  if (usersCount === 0) {
    await prisma.user.createMany({
      data: seededUsers.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        passwordHash: user.passwordHash,
        role: toDbUserRole(user.role),
        status: toDbUserStatus(user.status),
        joinDate: toDateOnlyValue(user.joinDate),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      skipDuplicates: true,
    });
  }

  if (propertiesCount === 0) {
    await prisma.property.createMany({
      data: seededProperties.map((property) => {
        const createdAt = toDateOnlyValue(property.createdAt);

        return {
          id: property.id,
          title: property.title,
          description: property.description,
          location: property.location,
          quartier: property.quartier,
          city: property.city,
          price: property.price,
          beds: property.beds,
          baths: property.baths,
          area: property.area,
          type: property.type,
          images: property.images,
          features: property.features,
          ownerName: property.owner.name,
          ownerEmail: property.owner.email,
          ownerPhone: property.owner.phone,
          ownerAvatar: property.owner.avatar,
          status: toDbListingStatus(property.status),
          createdAt,
          updatedAt: createdAt,
        };
      }),
      skipDuplicates: true,
    });
  }

  const adminEmail = "admin@maison.sn";
  const adminExists = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (!adminExists) {
    const defaultAdmin = seededUsers.find((user) => user.email === adminEmail);

    if (defaultAdmin) {
      await prisma.user.create({
        data: {
          fullName: defaultAdmin.fullName,
          email: defaultAdmin.email,
          phone: defaultAdmin.phone,
          passwordHash: defaultAdmin.passwordHash,
          role: toDbUserRole(defaultAdmin.role),
          status: toDbUserStatus(defaultAdmin.status),
          joinDate: toDateOnlyValue(defaultAdmin.joinDate),
        },
      });
    }
  }
};
