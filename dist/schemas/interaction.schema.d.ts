import { z } from "zod";
export declare const visitRequestSchema: z.ZodObject<{
    propertyId: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    property: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    date: z.ZodString;
    time: z.ZodString;
    message: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const contactMessageSchema: z.ZodObject<{
    propertyId: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    property: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=interaction.schema.d.ts.map