import { z } from "zod";
const featuresSchema = z
    .union([z.array(z.string()), z.string(), z.undefined()])
    .transform((value) => {
    if (Array.isArray(value)) {
        return value
            .map((feature) => feature.trim())
            .filter((feature) => feature.length > 0);
    }
    if (typeof value === "string") {
        return value
            .split(",")
            .map((feature) => feature.trim())
            .filter((feature) => feature.length > 0);
    }
    return [];
});
export const publishPropertySchema = z.object({
    propertyType: z.string().trim().min(1, "propertyType is required"),
    title: z.string().trim().min(1, "title is required"),
    description: z.string().trim().max(500).optional().default(""),
    price: z.coerce.number().positive("price must be positive"),
    location: z.string().trim().min(1, "location is required"),
    quartier: z.string().trim().optional().default(""),
    bedrooms: z.coerce.number().int().min(0).optional().default(0),
    bathrooms: z.coerce.number().int().min(0).optional().default(0),
    area: z.coerce.number().int().min(0).optional().default(0),
    features: featuresSchema,
});
export const propertyIdParamSchema = z.object({
    id: z.coerce.number().int().positive(),
});
export const propertyQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(50).optional().default(9),
    type: z.string().trim().optional(),
    quartier: z.string().trim().optional(),
    priceRange: z.string().trim().optional(),
    status: z.enum(["all", "pending", "approved", "rejected"]).optional().default("all"),
    viewerEmail: z.string().trim().toLowerCase().email().optional(),
    search: z.string().trim().optional(),
});
//# sourceMappingURL=property.schema.js.map