import { z } from "zod";
export const adminListingQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(50).optional().default(10),
    status: z.enum(["all", "pending", "approved", "rejected"]).optional().default("all"),
    search: z.string().trim().optional(),
});
export const listingStatusUpdateSchema = z.object({
    status: z.enum(["pending", "approved", "rejected"]),
});
export const numericIdParamSchema = z.object({
    id: z.coerce.number().int().positive(),
});
export const userStatusUpdateSchema = z.object({
    status: z.enum(["active", "inactive"]),
});
//# sourceMappingURL=admin.schema.js.map