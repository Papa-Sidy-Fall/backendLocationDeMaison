import { toPropertyResponse } from "../utils/prisma-mappers.js";
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
export declare const getAccountDashboard: (email: string) => Promise<AccountDashboardData>;
//# sourceMappingURL=account.service.d.ts.map