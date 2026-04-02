import { ZodError } from "zod";
import { AppError } from "../utils/app-error.js";
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
};
export const errorHandler = (error, _req, res, _next) => {
    if (error instanceof ZodError) {
        res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.issues,
        });
        return;
    }
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
            ...(error.details !== undefined ? { details: error.details } : {}),
        });
        return;
    }
    const fallbackMessage = error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({
        success: false,
        message: fallbackMessage,
    });
};
//# sourceMappingURL=error-handler.js.map