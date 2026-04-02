import cors from "cors";
import express from "express";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.js";
import { adminRouter } from "./routes/admin.routes.js";
import { accountRouter } from "./routes/account.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { interactionRouter } from "./routes/interaction.routes.js";
import { propertyRouter } from "./routes/property.routes.js";
import { uploadsRootDir } from "./utils/media.js";

export const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsRootDir));

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "API is running",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/properties", propertyRouter);
app.use("/api", interactionRouter);
app.use("/api/admin", adminRouter);
app.use("/api/account", accountRouter);

app.use(notFoundHandler);
app.use(errorHandler);
