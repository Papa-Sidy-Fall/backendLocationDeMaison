import { Router } from "express";
import { getAuthContext, requireAuth } from "../middlewares/auth.js";
import { getAccountDashboard } from "../services/account.service.js";

export const accountRouter = Router();

accountRouter.use(requireAuth);

accountRouter.get("/dashboard", async (_req, res) => {
  const authContext = getAuthContext(res);
  const dashboard = await getAccountDashboard(authContext.email);

  res.json({
    success: true,
    data: dashboard,
  });
});
