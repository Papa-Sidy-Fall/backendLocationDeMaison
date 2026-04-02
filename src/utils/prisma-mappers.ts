import type {
  ContactMessage as DbContactMessage,
  ListingStatus as DbListingStatus,
  Property as DbProperty,
  User as DbUser,
  UserRole as DbUserRole,
  UserStatus as DbUserStatus,
  VisitRequest as DbVisitRequest,
  VisitStatus as DbVisitStatus,
} from "@prisma/client";
import type {
  ContactMessage,
  ListingStatus,
  Property,
  UserRole,
  UserStatus,
  VisitRequest,
  VisitStatus,
} from "../types/models.js";
import { formatDateOnly } from "./helpers.js";
import { resolvePublicAssetUrl } from "./media.js";

const listingStatusToDbMap: Record<ListingStatus, DbListingStatus> = {
  pending: "PENDING",
  approved: "APPROVED",
  rejected: "REJECTED",
};

const listingStatusFromDbMap: Record<DbListingStatus, ListingStatus> = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

const userRoleToDbMap: Record<UserRole, DbUserRole> = {
  admin: "ADMIN",
  user: "USER",
};

const userRoleFromDbMap: Record<DbUserRole, UserRole> = {
  ADMIN: "admin",
  USER: "user",
};

const userStatusToDbMap: Record<UserStatus, DbUserStatus> = {
  active: "ACTIVE",
  inactive: "INACTIVE",
};

const userStatusFromDbMap: Record<DbUserStatus, UserStatus> = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

const visitStatusToDbMap: Record<VisitStatus, DbVisitStatus> = {
  pending: "PENDING",
  confirmed: "CONFIRMED",
  cancelled: "CANCELLED",
};

const visitStatusFromDbMap: Record<DbVisitStatus, VisitStatus> = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
};

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
};

export const toDbListingStatus = (status: ListingStatus): DbListingStatus => listingStatusToDbMap[status];

export const fromDbListingStatus = (status: DbListingStatus): ListingStatus => listingStatusFromDbMap[status];

export const toDbUserRole = (role: UserRole): DbUserRole => userRoleToDbMap[role];

export const fromDbUserRole = (role: DbUserRole): UserRole => userRoleFromDbMap[role];

export const toDbUserStatus = (status: UserStatus): DbUserStatus => userStatusToDbMap[status];

export const fromDbUserStatus = (status: DbUserStatus): UserStatus => userStatusFromDbMap[status];

export const toDbVisitStatus = (status: VisitStatus): DbVisitStatus => visitStatusToDbMap[status];

export const fromDbVisitStatus = (status: DbVisitStatus): VisitStatus => visitStatusFromDbMap[status];

export const toPropertyResponse = (property: DbProperty): Property => ({
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
  images: toStringArray(property.images).map(resolvePublicAssetUrl).filter((value) => value.length > 0),
  features: toStringArray(property.features),
  owner: {
    name: property.ownerName,
    email: property.ownerEmail,
    phone: property.ownerPhone,
    avatar: property.ownerAvatar,
  },
  status: fromDbListingStatus(property.status),
  createdAt: formatDateOnly(property.createdAt),
});

export const toVisitRequestResponse = (visitRequest: DbVisitRequest): VisitRequest => ({
  id: visitRequest.id,
  propertyId: visitRequest.propertyId,
  propertyTitle: visitRequest.propertyTitle,
  location: visitRequest.location,
  name: visitRequest.name,
  email: visitRequest.email,
  phone: visitRequest.phone,
  date: formatDateOnly(visitRequest.date),
  time: visitRequest.time,
  message: visitRequest.message,
  status: fromDbVisitStatus(visitRequest.status),
  createdAt: visitRequest.createdAt.toISOString(),
});

export const toContactMessageResponse = (message: DbContactMessage): ContactMessage => ({
  id: message.id,
  propertyId: message.propertyId,
  propertyTitle: message.propertyTitle,
  location: message.location,
  name: message.name,
  email: message.email,
  phone: message.phone,
  message: message.message,
  createdAt: message.createdAt.toISOString(),
});

export const toAuthUserResponse = (user: DbUser) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: fromDbUserRole(user.role),
});
