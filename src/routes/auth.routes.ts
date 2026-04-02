import { Router } from "express";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { login, register } from "../services/auth.service.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const payload = registerSchema.parse(req.body);
  const result = await register({
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    password: payload.password,
  });

  res.status(201).json({
    success: true,
    message: "Registration successful",
    data: result,
  });
});

authRouter.post("/login", async (req, res) => {
  const payload = loginSchema.parse(req.body);
  const result = await login(payload);

  res.json({
    success: true,
    message: "Login successful",
    data: result,
  });
});
