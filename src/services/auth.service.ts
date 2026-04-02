import type { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import type { LoginInput, RegisterInput } from "../types/models.js";
import { AppError } from "../utils/app-error.js";
import { toAuthUserResponse } from "../utils/prisma-mappers.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "development-secret-change-me";
const JWT_EXPIRES_IN = "7d";

interface AuthPayload {
  token: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    role: "admin" | "user";
  };
}

const createToken = (user: User): string =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  );

export const register = async (input: RegisterInput): Promise<AuthPayload> => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingUser) {
    throw new AppError("Email already in use", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const newUser = await prisma.user.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      passwordHash,
      role: "USER",
      status: "ACTIVE",
      joinDate: new Date(),
    },
  });

  return {
    token: createToken(newUser),
    user: toAuthUserResponse(newUser),
  };
};

export const login = async (input: LoginInput): Promise<AuthPayload> => {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  if (user.status !== "ACTIVE") {
    throw new AppError("Account is inactive. Contact an administrator.", 403);
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  return {
    token: createToken(user),
    user: toAuthUserResponse(user),
  };
};
