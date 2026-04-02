import { z } from "zod";

const optionalPropertyId = z.coerce.number().int().positive().optional();

const optionalPropertyTitle = z.string().trim().optional();

export const visitRequestSchema = z
  .object({
    propertyId: optionalPropertyId,
    property: optionalPropertyTitle,
    location: z.string().trim().optional(),
    name: z.string().trim().min(2, "name is required"),
    email: z.string().trim().toLowerCase().email("email is invalid"),
    phone: z.string().trim().min(8, "phone is required"),
    date: z.string().trim().min(1, "date is required"),
    time: z.string().trim().min(1, "time is required"),
    message: z.string().trim().max(500).optional().default(""),
  })
  .superRefine((data, context) => {
    if (data.propertyId === undefined && (!data.property || data.property.length === 0)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["propertyId"],
        message: "propertyId or property is required",
      });
    }
  });

export const contactMessageSchema = z
  .object({
    propertyId: optionalPropertyId,
    property: optionalPropertyTitle,
    location: z.string().trim().optional(),
    name: z.string().trim().min(2, "name is required"),
    email: z.string().trim().toLowerCase().email("email is invalid"),
    phone: z.string().trim().min(8, "phone is required"),
    message: z.string().trim().min(5, "message is required").max(1000),
  })
  .superRefine((data, context) => {
    if (data.propertyId === undefined && (!data.property || data.property.length === 0)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["propertyId"],
        message: "propertyId or property is required",
      });
    }
  });
