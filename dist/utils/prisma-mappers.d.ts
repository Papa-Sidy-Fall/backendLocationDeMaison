import type { ContactMessage as DbContactMessage, ListingStatus as DbListingStatus, Property as DbProperty, User as DbUser, UserRole as DbUserRole, UserStatus as DbUserStatus, VisitRequest as DbVisitRequest, VisitStatus as DbVisitStatus } from "@prisma/client";
import type { ContactMessage, ListingStatus, Property, UserRole, UserStatus, VisitRequest, VisitStatus } from "../types/models.js";
export declare const toDbListingStatus: (status: ListingStatus) => DbListingStatus;
export declare const fromDbListingStatus: (status: DbListingStatus) => ListingStatus;
export declare const toDbUserRole: (role: UserRole) => DbUserRole;
export declare const fromDbUserRole: (role: DbUserRole) => UserRole;
export declare const toDbUserStatus: (status: UserStatus) => DbUserStatus;
export declare const fromDbUserStatus: (status: DbUserStatus) => UserStatus;
export declare const toDbVisitStatus: (status: VisitStatus) => DbVisitStatus;
export declare const fromDbVisitStatus: (status: DbVisitStatus) => VisitStatus;
export declare const toPropertyResponse: (property: DbProperty) => Property;
export declare const toVisitRequestResponse: (visitRequest: DbVisitRequest) => VisitRequest;
export declare const toContactMessageResponse: (message: DbContactMessage) => ContactMessage;
export declare const toAuthUserResponse: (user: DbUser) => {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
};
//# sourceMappingURL=prisma-mappers.d.ts.map