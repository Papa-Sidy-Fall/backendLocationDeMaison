import { Router } from "express";
import { contactMessageSchema, visitRequestSchema } from "../schemas/interaction.schema.js";
import { createContactMessage, createVisitRequest } from "../services/property.service.js";

export const interactionRouter = Router();

interactionRouter.post("/visits", async (req, res) => {
  const payload = visitRequestSchema.parse(req.body);
  const visit = await createVisitRequest(payload);

  res.status(201).json({
    success: true,
    message: "Visit request submitted",
    data: visit,
  });
});

interactionRouter.post("/messages", async (req, res) => {
  const payload = contactMessageSchema.parse(req.body);
  const message = await createContactMessage(payload);

  res.status(201).json({
    success: true,
    message: "Message submitted",
    data: message,
  });
});
