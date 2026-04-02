import { z } from "zod";
export declare const publishPropertySchema: z.ZodObject<{
    propertyType: z.ZodString;
    title: z.ZodString;
    description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    price: z.ZodCoercedNumber<unknown>;
    location: z.ZodString;
    exactAddress: z.ZodString;
    quartier: z.ZodString;
    bedrooms: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    bathrooms: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    area: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    features: z.ZodPipe<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodString, z.ZodUndefined]>, z.ZodTransform<string[], string | string[] | undefined>>;
    imageUrls: z.ZodPipe<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodString, z.ZodUndefined]>, z.ZodTransform<string[], string | string[] | undefined>>;
}, z.core.$strip>;
export declare const propertyIdParamSchema: z.ZodObject<{
    id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const propertyQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    type: z.ZodOptional<z.ZodString>;
    quartier: z.ZodOptional<z.ZodString>;
    priceRange: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        approved: "approved";
        rejected: "rejected";
        all: "all";
    }>>>;
    viewerEmail: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=property.schema.d.ts.map