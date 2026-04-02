import { formatDateOnly } from "./helpers.js";
import { resolvePublicAssetUrl } from "./media.js";
const listingStatusToDbMap = {
    pending: "PENDING",
    approved: "APPROVED",
    rejected: "REJECTED",
};
const listingStatusFromDbMap = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
};
const userRoleToDbMap = {
    admin: "ADMIN",
    user: "USER",
};
const userRoleFromDbMap = {
    ADMIN: "admin",
    USER: "user",
};
const userStatusToDbMap = {
    active: "ACTIVE",
    inactive: "INACTIVE",
};
const userStatusFromDbMap = {
    ACTIVE: "active",
    INACTIVE: "inactive",
};
const visitStatusToDbMap = {
    pending: "PENDING",
    confirmed: "CONFIRMED",
    cancelled: "CANCELLED",
};
const visitStatusFromDbMap = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    CANCELLED: "cancelled",
};
const toStringArray = (value) => {
    if (!Array.isArray(value)) {
        return [];
    }
    return value.filter((item) => typeof item === "string");
};
export const toDbListingStatus = (status) => listingStatusToDbMap[status];
export const fromDbListingStatus = (status) => listingStatusFromDbMap[status];
export const toDbUserRole = (role) => userRoleToDbMap[role];
export const fromDbUserRole = (role) => userRoleFromDbMap[role];
export const toDbUserStatus = (status) => userStatusToDbMap[status];
export const fromDbUserStatus = (status) => userStatusFromDbMap[status];
export const toDbVisitStatus = (status) => visitStatusToDbMap[status];
export const fromDbVisitStatus = (status) => visitStatusFromDbMap[status];
export const toPropertyResponse = (property) => ({
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
export const toVisitRequestResponse = (visitRequest) => ({
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
export const toContactMessageResponse = (message) => ({
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
export const toAuthUserResponse = (user) => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: fromDbUserRole(user.role),
});
//# sourceMappingURL=prisma-mappers.js.map