import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/app-error.js";
import { fromDbUserRole } from "../utils/prisma-mappers.js";
const JWT_SECRET = process.env.JWT_SECRET ?? "development-secret-change-me";
const parseBearerToken = (authorizationHeader) => {
    if (!authorizationHeader || authorizationHeader.trim().length === 0) {
        throw new AppError("Authentication required", 401);
    }
    const [scheme, token] = authorizationHeader.split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token || token.trim().length === 0) {
        throw new AppError("Invalid authorization header format", 401);
    }
    return token;
};
const parseUserId = (sub) => {
    if (typeof sub === "number" && Number.isInteger(sub) && sub > 0) {
        return sub;
    }
    if (typeof sub === "string") {
        const parsed = Number.parseInt(sub, 10);
        if (Number.isInteger(parsed) && parsed > 0) {
            return parsed;
        }
    }
    throw new AppError("Invalid token payload", 401);
};
const parseEmail = (email) => {
    if (typeof email !== "string" || email.trim().length === 0) {
        throw new AppError("Invalid token payload", 401);
    }
    return email.trim().toLowerCase();
};
const parseRole = (role) => {
    if (typeof role !== "string" || role.trim().length === 0) {
        throw new AppError("Invalid token payload", 401);
    }
    return role.trim().toLowerCase();
};
const getAuthContextFromToken = (token) => {
    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    }
    catch {
        throw new AppError("Invalid or expired token", 401);
    }
    if (typeof decoded !== "object" || decoded === null) {
        throw new AppError("Invalid token payload", 401);
    }
    const payload = decoded;
    return {
        userId: parseUserId(payload.sub),
        email: parseEmail(payload.email),
        role: parseRole(payload.role),
    };
};
const hydrateUserContext = async (authContext, adminRequired) => {
    const user = await prisma.user.findUnique({
        where: {
            email: authContext.email,
        },
    });
    if (!user || user.id !== authContext.userId) {
        throw new AppError("Invalid or expired token", 401);
    }
    if (user.status !== "ACTIVE") {
        throw new AppError("Account is inactive. Contact an administrator.", 403);
    }
    const role = fromDbUserRole(user.role);
    if (adminRequired && role !== "admin") {
        throw new AppError("Admin access required", 403);
    }
    return {
        userId: user.id,
        email: user.email,
        role,
    };
};
export const getAuthContext = (res) => {
    const authContext = res.locals.auth;
    if (!authContext) {
        throw new AppError("Authentication required", 401);
    }
    return authContext;
};
export const requireAuth = async (req, res, next) => {
    const token = parseBearerToken(req.headers.authorization);
    const authContext = await hydrateUserContext(getAuthContextFromToken(token), false);
    res.locals.auth = authContext;
    next();
};
export const requireAdmin = async (req, res, next) => {
    const token = parseBearerToken(req.headers.authorization);
    const authContext = await hydrateUserContext(getAuthContextFromToken(token), true);
    res.locals.auth = authContext;
    next();
};
//# sourceMappingURL=auth.js.map