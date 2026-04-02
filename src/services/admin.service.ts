import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import type { ListingStatus, UserStatus } from "../types/models.js";
import { AppError } from "../utils/app-error.js";
import { formatDateOnly, normalizeText } from "../utils/helpers.js";
import { resolvePublicAssetUrl } from "../utils/media.js";
import {
  fromDbListingStatus,
  fromDbUserRole,
  fromDbUserStatus,
  toDbListingStatus,
  toDbUserStatus,
} from "../utils/prisma-mappers.js";

interface AdminListingQuery {
  status: "all" | ListingStatus;
  search?: string | undefined;
}

export interface AdminListing {
  id: number;
  title: string;
  owner: string;
  email: string;
  phone: string;
  location: string;
  price: number;
  status: ListingStatus;
  date: string;
  type: string;
  image: string;
}

export interface AdminUserView {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  annonces: number;
  status: string;
  joinDate: string;
}

const toAdminListing = (property: {
  id: number;
  title: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  location: string;
  price: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  type: string;
  images: unknown;
}): AdminListing => {
  const firstImage = Array.isArray(property.images) ? property.images[0] : "";

  return {
    id: property.id,
    title: property.title,
    owner: property.ownerName,
    email: property.ownerEmail,
    phone: property.ownerPhone,
    location: property.location,
    price: property.price,
    status: fromDbListingStatus(property.status),
    date: formatDateOnly(property.createdAt),
    type: property.type,
    image: typeof firstImage === "string" ? resolvePublicAssetUrl(firstImage) : "",
  };
};

const toAdminRoleLabel = (role: "ADMIN" | "USER"): string =>
  fromDbUserRole(role) === "admin" ? "Administrateur" : "Proprietaire";

const toAdminUserView = (
  user: {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    role: "ADMIN" | "USER";
    status: "ACTIVE" | "INACTIVE";
    joinDate: Date;
  },
  listingsCount: number,
): AdminUserView => ({
  id: user.id,
  name: user.fullName,
  email: user.email,
  phone: user.phone,
  role: toAdminRoleLabel(user.role),
  annonces: listingsCount,
  status: fromDbUserStatus(user.status),
  joinDate: formatDateOnly(user.joinDate),
});

const getManageableUser = async (userId: number, actorAdminId: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.id === actorAdminId) {
    throw new AppError("You cannot modify your own account", 400);
  }

  if (user.role === "ADMIN") {
    throw new AppError("You cannot modify another admin account", 403);
  }

  return user;
};

export const listAdminListings = async (query: AdminListingQuery): Promise<AdminListing[]> => {
  const where: Prisma.PropertyWhereInput = {};

  if (query.status !== "all") {
    where.status = toDbListingStatus(query.status);
  }

  if (query.search && query.search.trim().length > 0) {
    where.OR = [
      {
        title: {
          contains: query.search,
        },
      },
      {
        ownerName: {
          contains: query.search,
        },
      },
      {
        location: {
          contains: query.search,
        },
      },
      {
        type: {
          contains: query.search,
        },
      },
    ];
  }

  const listings = await prisma.property.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  return listings.map(toAdminListing);
};

export const updateListingStatus = async (id: number, status: ListingStatus): Promise<AdminListing> => {
  try {
    const property = await prisma.property.update({
      where: {
        id,
      },
      data: {
        status: toDbListingStatus(status),
      },
    });

    return toAdminListing(property);
  } catch {
    throw new AppError("Listing not found", 404);
  }
};

export const deleteListing = async (id: number): Promise<void> => {
  try {
    await prisma.property.delete({
      where: {
        id,
      },
    });
  } catch {
    throw new AppError("Listing not found", 404);
  }
};

export const getAdminStats = async () => {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const [totalAnnonces, pending, approved, rejected, totalUsers, newToday] = await prisma.$transaction([
    prisma.property.count(),
    prisma.property.count({
      where: {
        status: "PENDING",
      },
    }),
    prisma.property.count({
      where: {
        status: "APPROVED",
      },
    }),
    prisma.property.count({
      where: {
        status: "REJECTED",
      },
    }),
    prisma.user.count(),
    prisma.property.count({
      where: {
        createdAt: {
          gte: todayStart,
        },
      },
    }),
  ]);

  return {
    totalAnnonces,
    pending,
    approved,
    rejected,
    totalUsers,
    newToday,
  };
};

export const listAdminUsers = async (): Promise<AdminUserView[]> => {
  const [users, listings] = await prisma.$transaction([
    prisma.user.findMany({
      orderBy: {
        joinDate: "desc",
      },
    }),
    prisma.property.findMany({
      select: {
        ownerEmail: true,
      },
    }),
  ]);

  const listingsByEmail = new Map<string, number>();
  for (const listing of listings) {
    const key = normalizeText(listing.ownerEmail);
    listingsByEmail.set(key, (listingsByEmail.get(key) ?? 0) + 1);
  }

  return users.map((user) => toAdminUserView(user, listingsByEmail.get(normalizeText(user.email)) ?? 0));
};

export const updateAdminUserStatus = async (
  userId: number,
  status: UserStatus,
  actorAdminId: number,
): Promise<AdminUserView> => {
  const targetUser = await getManageableUser(userId, actorAdminId);

  const [updatedUser, listingsCount] = await prisma.$transaction([
    prisma.user.update({
      where: {
        id: targetUser.id,
      },
      data: {
        status: toDbUserStatus(status),
      },
    }),
    prisma.property.count({
      where: {
        ownerEmail: targetUser.email,
      },
    }),
  ]);

  return toAdminUserView(updatedUser, listingsCount);
};

export const deleteAdminUser = async (userId: number, actorAdminId: number): Promise<void> => {
  const targetUser = await getManageableUser(userId, actorAdminId);

  await prisma.$transaction([
    prisma.property.deleteMany({
      where: {
        ownerEmail: targetUser.email,
      },
    }),
    prisma.user.delete({
      where: {
        id: targetUser.id,
      },
    }),
  ]);
};
