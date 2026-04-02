import { Router } from "express";
import { getAuthContext, requireAdmin } from "../middlewares/auth.js";
import {
  adminListingQuerySchema,
  listingStatusUpdateSchema,
  numericIdParamSchema,
  userStatusUpdateSchema,
} from "../schemas/admin.schema.js";
import {
  deleteAdminUser,
  deleteListing,
  getAdminStats,
  listAdminListings,
  listAdminUsers,
  updateAdminUserStatus,
  updateListingStatus,
} from "../services/admin.service.js";
import { listContactMessages, listVisitRequests } from "../services/property.service.js";

export const adminRouter = Router();

adminRouter.use(requireAdmin);

adminRouter.get("/stats", async (_req, res) => {
  const stats = await getAdminStats();

  res.json({
    success: true,
    data: stats,
  });
});

adminRouter.get("/listings", async (req, res) => {
  const query = adminListingQuerySchema.parse(req.query);
  const listings = await listAdminListings(query);

  res.json({
    success: true,
    data: listings,
  });
});

adminRouter.patch("/listings/:id/status", async (req, res) => {
  const params = numericIdParamSchema.parse(req.params);
  const payload = listingStatusUpdateSchema.parse(req.body);
  const listing = await updateListingStatus(params.id, payload.status);

  res.json({
    success: true,
    message: "Listing status updated",
    data: listing,
  });
});

adminRouter.delete("/listings/:id", async (req, res) => {
  const params = numericIdParamSchema.parse(req.params);
  await deleteListing(params.id);

  res.status(204).send();
});

adminRouter.get("/users", async (_req, res) => {
  const adminUsers = await listAdminUsers();

  res.json({
    success: true,
    data: adminUsers,
  });
});

adminRouter.patch("/users/:id/status", async (req, res) => {
  const params = numericIdParamSchema.parse(req.params);
  const payload = userStatusUpdateSchema.parse(req.body);
  const authContext = getAuthContext(res);
  const user = await updateAdminUserStatus(params.id, payload.status, authContext.userId);

  res.json({
    success: true,
    message: "User status updated",
    data: user,
  });
});

adminRouter.delete("/users/:id", async (req, res) => {
  const params = numericIdParamSchema.parse(req.params);
  const authContext = getAuthContext(res);
  await deleteAdminUser(params.id, authContext.userId);

  res.status(204).send();
});

adminRouter.get("/interactions", async (_req, res) => {
  res.json({
    success: true,
    data: {
      visits: await listVisitRequests(),
      messages: await listContactMessages(),
    },
  });
});
