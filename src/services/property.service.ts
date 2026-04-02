import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import type {
  ContactMessage,
  ListingStatus,
  Property,
  PublishPropertyInput,
  VisitRequest,
} from "../types/models.js";
import { AppError } from "../utils/app-error.js";
import { buildAvatar, normalizeText } from "../utils/helpers.js";
import {
  toContactMessageResponse,
  toDbListingStatus,
  toPropertyResponse,
  toVisitRequestResponse,
} from "../utils/prisma-mappers.js";

interface PropertyListQuery {
  page: number;
  limit: number;
  type?: string | undefined;
  quartier?: string | undefined;
  priceRange?: string | undefined;
  status: "all" | ListingStatus;
  viewerEmail?: string | undefined;
  search?: string | undefined;
}

interface VisitRequestInput {
  propertyId?: number | undefined;
  property?: string | undefined;
  location?: string | undefined;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message: string;
}

interface ContactMessageInput {
  propertyId?: number | undefined;
  property?: string | undefined;
  location?: string | undefined;
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface PaginatedResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

const parsePriceRange = (range?: string): { gte?: number; lte?: number } => {
  if (!range || normalizeText(range) === "all") {
    return {};
  }

  const normalizedRange = range.replace(/\s+/g, "");

  if (normalizedRange.endsWith("+")) {
    const min = Number.parseInt(normalizedRange.replace("+", ""), 10);

    if (!Number.isFinite(min)) {
      return {};
    }

    return {
      gte: min,
    };
  }

  const [minRaw, maxRaw] = normalizedRange.split("-");
  const min = Number.parseInt(minRaw ?? "", 10);
  const max = Number.parseInt(maxRaw ?? "", 10);

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return {};
  }

  return {
    gte: min,
    lte: max,
  };
};

const getInactiveOwnerEmails = async (): Promise<string[]> => {
  const inactiveUsers = await prisma.user.findMany({
    where: {
      status: "INACTIVE",
    },
    select: {
      email: true,
    },
  });

  return inactiveUsers.map((user) => user.email.trim().toLowerCase());
};

const ensureOwnerIsActive = async (ownerEmail: string): Promise<void> => {
  const normalizedOwnerEmail = ownerEmail.trim().toLowerCase();
  const owner = await prisma.user.findUnique({
    where: {
      email: normalizedOwnerEmail,
    },
    select: {
      status: true,
    },
  });

  if (owner && owner.status !== "ACTIVE") {
    throw new AppError("Property not found", 404);
  }
};

const buildVisibilityFilter = (query: PropertyListQuery): Prisma.PropertyWhereInput | undefined => {
  const viewerEmail = query.viewerEmail?.trim().toLowerCase();

  if (query.status === "approved") {
    if (!viewerEmail) {
      return { status: "APPROVED" };
    }

    return {
      OR: [
        { status: "APPROVED" },
        {
          ownerEmail: {
            equals: viewerEmail,
          },
        },
      ],
    };
  }

  if (query.status === "all") {
    if (!viewerEmail) {
      return undefined;
    }

    return {
      OR: [
        { status: "APPROVED" },
        {
          ownerEmail: {
            equals: viewerEmail,
          },
        },
      ],
    };
  }

  const statusFilter: Prisma.PropertyWhereInput = {
    status: toDbListingStatus(query.status),
  };

  if (!viewerEmail) {
    return statusFilter;
  }

  return {
    AND: [
      statusFilter,
      {
        ownerEmail: {
          equals: viewerEmail,
        },
      },
    ],
  };
};

const buildPropertyWhere = (query: PropertyListQuery, inactiveOwnerEmails: string[]): Prisma.PropertyWhereInput => {
  const whereConditions: Prisma.PropertyWhereInput[] = [];

  const visibilityFilter = buildVisibilityFilter(query);
  if (visibilityFilter) {
    whereConditions.push(visibilityFilter);
  }

  if (inactiveOwnerEmails.length > 0) {
    whereConditions.push({
      ownerEmail: {
        notIn: inactiveOwnerEmails,
      },
    });
  }

  if (query.type && normalizeText(query.type) !== "all") {
    whereConditions.push({
      type: {
        contains: query.type,
      },
    });
  }

  if (query.quartier && normalizeText(query.quartier) !== "all") {
    whereConditions.push({
      quartier: {
        contains: query.quartier,
      },
    });
  }

  const priceFilter = parsePriceRange(query.priceRange);
  if (priceFilter.gte !== undefined || priceFilter.lte !== undefined) {
    whereConditions.push({
      price: priceFilter,
    });
  }

  if (query.search && query.search.trim().length > 0) {
    whereConditions.push({
      OR: [
        {
          title: {
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
        {
          ownerName: {
            contains: query.search,
          },
        },
      ],
    });
  }

  if (whereConditions.length === 0) {
    return {};
  }

  if (whereConditions.length === 1) {
    return whereConditions[0] ?? {};
  }

  return {
    AND: whereConditions,
  };
};

const resolveProperty = async (propertyId?: number, propertyTitle?: string) => {
  if (propertyId !== undefined) {
    const property = await prisma.property.findUnique({
      where: {
        id: propertyId,
      },
    });

    if (!property) {
      throw new AppError("Property not found", 404);
    }

    await ensureOwnerIsActive(property.ownerEmail);
    return property;
  }

  if (!propertyTitle || propertyTitle.trim().length === 0) {
    throw new AppError("propertyId or property is required", 400);
  }

  const inactiveOwnerEmails = await getInactiveOwnerEmails();
  const where: Prisma.PropertyWhereInput = {
    title: {
      contains: propertyTitle,
    },
  };

  if (inactiveOwnerEmails.length > 0) {
    where.ownerEmail = {
      notIn: inactiveOwnerEmails,
    };
  }

  const candidates = await prisma.property.findMany({
    where,
    take: 20,
  });

  const normalizedTitle = normalizeText(propertyTitle);
  const exactMatch = candidates.find((candidate) => normalizeText(candidate.title) === normalizedTitle);

  if (exactMatch) {
    return exactMatch;
  }

  const firstCandidate = candidates[0];

  if (!firstCandidate) {
    throw new AppError("Property not found", 404);
  }

  return firstCandidate;
};

export const listProperties = async (query: PropertyListQuery): Promise<PaginatedResult<Property>> => {
  const inactiveOwnerEmails = await getInactiveOwnerEmails();
  const where = buildPropertyWhere(query, inactiveOwnerEmails);

  const totalItems = await prisma.property.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalItems / query.limit));
  const page = Math.min(query.page, totalPages);

  const properties = await prisma.property.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * query.limit,
    take: query.limit,
  });

  return {
    items: properties.map(toPropertyResponse),
    pagination: {
      page,
      limit: query.limit,
      totalItems,
      totalPages,
    },
  };
};

export const getPropertyById = async (id: number): Promise<Property> => {
  const property = await prisma.property.findUnique({
    where: {
      id,
    },
  });

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  await ensureOwnerIsActive(property.ownerEmail);
  return toPropertyResponse(property);
};

export const getSimilarProperties = async (propertyId: number, limit = 3): Promise<Property[]> => {
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  await ensureOwnerIsActive(property.ownerEmail);
  const inactiveOwnerEmails = await getInactiveOwnerEmails();

  const candidatesWhere: Prisma.PropertyWhereInput = {
    id: {
      not: property.id,
    },
    status: "APPROVED",
  };

  if (inactiveOwnerEmails.length > 0) {
    candidatesWhere.ownerEmail = {
      notIn: inactiveOwnerEmails,
    };
  }

  const candidates = await prisma.property.findMany({
    where: candidatesWhere,
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  return candidates
    .map((candidate) => {
      let score = 0;

      if (normalizeText(candidate.type) === normalizeText(property.type)) {
        score += 2;
      }

      if (normalizeText(candidate.quartier) === normalizeText(property.quartier)) {
        score += 2;
      }

      const priceGap = Math.abs(candidate.price - property.price);
      score -= Math.floor(priceGap / 100000);

      return {
        score,
        property: toPropertyResponse(candidate),
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, Math.max(1, limit))
    .map((entry) => entry.property);
};

export const publishProperty = async (input: PublishPropertyInput): Promise<Property> => {
  const ownerEmail = input.ownerEmail.trim().toLowerCase();
  const owner = await prisma.user.findUnique({
    where: {
      email: ownerEmail,
    },
  });

  if (!owner) {
    throw new AppError("Authenticated user not found", 404);
  }

  if (owner.status !== "ACTIVE") {
    throw new AppError("Account is inactive. Contact an administrator.", 403);
  }

  const normalizedImageUrls = input.imageUrls.map((imagePath) => imagePath.trim()).filter((imagePath) => imagePath.length > 0);

  if (normalizedImageUrls.length < 1) {
    throw new AppError("At least one image is required", 400);
  }

  if (normalizedImageUrls.length > 5) {
    throw new AppError("You can upload a maximum of 5 images", 400);
  }

  const ownerName = owner.fullName;

  const createdProperty = await prisma.property.create({
    data: {
      title: input.title,
      description:
        input.description.length > 0
          ? input.description
          : `${input.title} situe a ${input.location}. Annonce publiee en attente de validation administrateur.`,
      quartier: input.quartier.length > 0 ? input.quartier : input.location,
      city: "Dakar",
      location: input.location,
      price: input.price,
      beds: input.bedrooms,
      baths: input.bathrooms,
      area: input.area,
      type: input.propertyType,
      images: normalizedImageUrls,
      features: input.features,
      ownerName,
      ownerEmail: owner.email,
      ownerPhone: owner.phone,
      ownerAvatar: buildAvatar(ownerName),
      status: "PENDING",
    },
  });

  return toPropertyResponse(createdProperty);
};

export const createVisitRequest = async (input: VisitRequestInput): Promise<VisitRequest> => {
  const property = await resolveProperty(input.propertyId, input.property);

  const requestedDate = new Date(`${input.date}T00:00:00.000Z`);

  if (Number.isNaN(requestedDate.getTime())) {
    throw new AppError("Invalid date format", 400);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (requestedDate < today) {
    throw new AppError("Visit date cannot be in the past", 400);
  }

  const visitRequest = await prisma.visitRequest.create({
    data: {
      propertyId: property.id,
      propertyTitle: property.title,
      location: input.location && input.location.length > 0 ? input.location : property.location,
      name: input.name,
      email: input.email,
      phone: input.phone,
      date: requestedDate,
      time: input.time,
      message: input.message,
      status: "PENDING",
    },
  });

  return toVisitRequestResponse(visitRequest);
};

export const createContactMessage = async (input: ContactMessageInput): Promise<ContactMessage> => {
  const property = await resolveProperty(input.propertyId, input.property);

  const message = await prisma.contactMessage.create({
    data: {
      propertyId: property.id,
      propertyTitle: property.title,
      location: input.location && input.location.length > 0 ? input.location : property.location,
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
    },
  });

  return toContactMessageResponse(message);
};

export const listVisitRequests = async (): Promise<VisitRequest[]> => {
  const visits = await prisma.visitRequest.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return visits.map(toVisitRequestResponse);
};

export const listContactMessages = async (): Promise<ContactMessage[]> => {
  const messages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return messages.map(toContactMessageResponse);
};
