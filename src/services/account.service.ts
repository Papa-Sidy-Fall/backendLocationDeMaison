import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/app-error.js";
import { fromDbUserRole, toPropertyResponse } from "../utils/prisma-mappers.js";

export interface AccountDashboardProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: "admin" | "user";
}

export interface AccountDashboardMessage {
  id: string;
  type: "contact" | "visit";
  propertyId: number;
  propertyTitle: string;
  location: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  message: string;
  createdAt: string;
  visitDate?: string | undefined;
  visitTime?: string | undefined;
  visitStatus?: "pending" | "confirmed" | "cancelled" | undefined;
}

export interface AccountDashboardData {
  profile: AccountDashboardProfile;
  publications: ReturnType<typeof toPropertyResponse>[];
  messages: AccountDashboardMessage[];
  stats: {
    totalPublications: number;
    pendingPublications: number;
    approvedPublications: number;
    rejectedPublications: number;
    totalMessages: number;
  };
}

const toIsoString = (value: Date): string => value.toISOString();

export const getAccountDashboard = async (email: string): Promise<AccountDashboardData> => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const publicationsDb = await prisma.property.findMany({
    where: {
      ownerEmail: normalizedEmail,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const propertyIds = publicationsDb.map((publication) => publication.id);

  const [contactMessagesDb, visitRequestsDb] =
    propertyIds.length > 0
      ? await prisma.$transaction([
          prisma.contactMessage.findMany({
            where: {
              propertyId: {
                in: propertyIds,
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          }),
          prisma.visitRequest.findMany({
            where: {
              propertyId: {
                in: propertyIds,
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          }),
        ])
      : [[], []];

  const contactMessages: AccountDashboardMessage[] = contactMessagesDb.map((message) => ({
    id: `contact-${message.id}`,
    type: "contact",
    propertyId: message.propertyId,
    propertyTitle: message.propertyTitle,
    location: message.location,
    senderName: message.name,
    senderEmail: message.email,
    senderPhone: message.phone,
    message: message.message,
    createdAt: toIsoString(message.createdAt),
  }));

  const visitMessages: AccountDashboardMessage[] = visitRequestsDb.map((visit) => ({
    id: `visit-${visit.id}`,
    type: "visit",
    propertyId: visit.propertyId,
    propertyTitle: visit.propertyTitle,
    location: visit.location,
    senderName: visit.name,
    senderEmail: visit.email,
    senderPhone: visit.phone,
    message: visit.message,
    createdAt: toIsoString(visit.createdAt),
    visitDate: visit.date.toISOString(),
    visitTime: visit.time,
    visitStatus:
      visit.status === "CONFIRMED" ? "confirmed" : visit.status === "CANCELLED" ? "cancelled" : "pending",
  }));

  const publications = publicationsDb.map(toPropertyResponse);
  const messages = [...contactMessages, ...visitMessages].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );

  const publicationStats = publications.reduce(
    (accumulator, publication) => {
      if (publication.status === "pending") {
        accumulator.pendingPublications += 1;
      } else if (publication.status === "approved") {
        accumulator.approvedPublications += 1;
      } else {
        accumulator.rejectedPublications += 1;
      }

      return accumulator;
    },
    {
      pendingPublications: 0,
      approvedPublications: 0,
      rejectedPublications: 0,
    },
  );

  return {
    profile: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: fromDbUserRole(user.role),
    },
    publications,
    messages,
    stats: {
      totalPublications: publications.length,
      pendingPublications: publicationStats.pendingPublications,
      approvedPublications: publicationStats.approvedPublications,
      rejectedPublications: publicationStats.rejectedPublications,
      totalMessages: messages.length,
    },
  };
};
