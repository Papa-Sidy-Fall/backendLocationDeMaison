import type { ListingStatus, UserStatus } from "../types/models.js";
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
export declare const listAdminListings: (query: AdminListingQuery) => Promise<AdminListing[]>;
export declare const updateListingStatus: (id: number, status: ListingStatus) => Promise<AdminListing>;
export declare const deleteListing: (id: number) => Promise<void>;
export declare const getAdminStats: () => Promise<{
    totalAnnonces: number;
    pending: number;
    approved: number;
    rejected: number;
    totalUsers: number;
    newToday: number;
}>;
export declare const listAdminUsers: () => Promise<AdminUserView[]>;
export declare const updateAdminUserStatus: (userId: number, status: UserStatus, actorAdminId: number) => Promise<AdminUserView>;
export declare const deleteAdminUser: (userId: number, actorAdminId: number) => Promise<void>;
export {};
//# sourceMappingURL=admin.service.d.ts.map