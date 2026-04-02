import type { ContactMessage, ListingStatus, Property, PublishPropertyInput, VisitRequest } from "../types/models.js";
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
export declare const listProperties: (query: PropertyListQuery) => Promise<PaginatedResult<Property>>;
export declare const getPropertyById: (id: number) => Promise<Property>;
export declare const getSimilarProperties: (propertyId: number, limit?: number) => Promise<Property[]>;
export declare const publishProperty: (input: PublishPropertyInput) => Promise<Property>;
export declare const createVisitRequest: (input: VisitRequestInput) => Promise<VisitRequest>;
export declare const createContactMessage: (input: ContactMessageInput) => Promise<ContactMessage>;
export declare const listVisitRequests: () => Promise<VisitRequest[]>;
export declare const listContactMessages: () => Promise<ContactMessage[]>;
export {};
//# sourceMappingURL=property.service.d.ts.map