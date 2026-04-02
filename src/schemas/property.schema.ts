import { z } from "zod";

const isHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

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

const imageUrlsSchema = z
  .union([z.array(z.string()), z.string(), z.undefined()])
  .transform((value) => {
    if (Array.isArray(value)) {
      return value.map((item) => item.trim()).filter((item) => item.length > 0);
    }

    if (typeof value === "string") {
      const normalized = value.trim();
      return normalized.length > 0 ? [normalized] : [];
    }

    return [];
  })
  .refine((urls) => urls.every(isHttpUrl), {
    message: "imageUrls must contain valid http or https URLs",
  });

export const publishPropertySchema = z.object({
  propertyType: z.string().trim().min(1, "propertyType is required"),
  title: z.string().trim().min(1, "title is required"),
  description: z.string().trim().max(500).optional().default(""),
  price: z.coerce.number().positive("price must be positive"),
  location: z.string().trim().min(1, "location is required"),
  exactAddress: z.string().trim().min(5, "exactAddress is required").max(255, "exactAddress is too long"),
  quartier: z.string().trim().min(1, "quartier is required").max(120, "quartier is too long"),
  bedrooms: z.coerce.number().int().min(0).optional().default(0),
  bathrooms: z.coerce.number().int().min(0).optional().default(0),
  area: z.coerce.number().int().min(0).optional().default(0),
  features: featuresSchema,
  imageUrls: imageUrlsSchema,
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
