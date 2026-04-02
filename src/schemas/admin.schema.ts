import { z } from "zod";

export const adminListingQuerySchema = z.object({
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
