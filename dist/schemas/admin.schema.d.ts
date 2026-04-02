import { z } from "zod";
export declare const adminListingQuerySchema: z.ZodObject<{
    status: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        approved: "approved";
        rejected: "rejected";
        all: "all";
    }>>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const listingStatusUpdateSchema: z.ZodObject<{
    status: z.ZodEnum<{
        pending: "pending";
        approved: "approved";
        rejected: "rejected";
    }>;
}, z.core.$strip>;
export declare const numericIdParamSchema: z.ZodObject<{
    id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const userStatusUpdateSchema: z.ZodObject<{
    status: z.ZodEnum<{
        active: "active";
        inactive: "inactive";
    }>;
}, z.core.$strip>;
//# sourceMappingURL=admin.schema.d.ts.map